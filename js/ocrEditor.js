// =========================================
// OCR Interactive Editor
// =========================================

// =========================================
// OCR Undo History
// =========================================

let undoHistory = [];
let undoTimer = null;


function tokenizeOCR(text) {

    // Split into:
    // - words (Nepali & English)
    // - numbers
    // - whitespace
    // - punctuation
    // - symbols

    return text.match(
        /[\u0900-\u097Fa-zA-Z0-9%]+|\r?\n|[ \t]+|[^\s\u0900-\u097Fa-zA-Z0-9%]/gu
    ) || [];

}

function isWord(token) {
    return /^[\u0900-\u097Fa-zA-Z0-9%]+$/u.test(token);
}

function isPunctuation(token) {
    return !isWord(token) && !/^\s+$/.test(token);
}

function splitNepaliWord(word){

    const suffixes = [

        "हरुलाई",
        "हरू",
        "सम्म",
        "सँग",
        "बाट",
        "देखि",
        "द्वारा",
        "प्रति",
        "भित्र",
        "पछि",
        "अघि",
        "को",
        "का",
        "की",
        "मा",
        "ले",
        "लाई",
        "ने",
        "दै",
        "यो"

    ];

    for(const suffix of suffixes){

        if(word.endsWith(suffix)){

            return{

                base: word.slice(0,-suffix.length),

                suffix

            };

        }

    }

    return{

        base: word,

        suffix:""

    };

}

function renderOcrEditor(text){

    const viewer = document.getElementById("ocrViewer");
    const textarea = document.getElementById("ocrText");

    textarea.style.display = "none";

    viewer.style.display = "block";
    viewer.classList.remove("hidden");

    const tokens = tokenizeOCR(text);

    viewer.innerHTML = "";

tokens.forEach(token => {

    // Preserve spaces and newlines.
    // Ordinary spaces (kept by white-space: pre-wrap) stay breakable,
    // so long lines wrap inside the viewer instead of overflowing it.
    if (/^\s+$/.test(token)) {

        viewer.insertAdjacentHTML(
            "beforeend",
            token.replace(/\n/g, "<br>")
        );

        return;
    }

    if (isWord(token)) {

    const span = document.createElement("span");
span.className = "ocr-word";

if (/^[A-Za-z]+$/.test(token)) {

    span.classList.add("ocr-english");

} else if (/^[0-9०-९]+$/.test(token)) {

    span.classList.add("ocr-number");

} else if (isCorrectWord(token)) {

    span.classList.add("ocr-correct");

} else {

    span.classList.add("ocr-wrong");

}

span.dataset.word = token;
span.textContent = token;

viewer.appendChild(span);

} else {

    viewer.append(token);

}

});

viewer.querySelectorAll(".ocr-word").forEach(word => {

    word.addEventListener("click", () => {

        const clickedWord = word.dataset.word;

        const parts = splitNepaliWord(clickedWord);

// Try exact match
let entry = dictionary.find(item => item.word === clickedWord);

// If not found, try base word

if (!entry) {

    entry = dictionary.find(
        item => item.word === parts.base
    );

}

let suggestions = [];

if (!isCorrectWord(clickedWord)) {

const normalized = normalizeNepali(parts.base);

    suggestions = dictionaryIndex

        .filter(item => {

            if (item.normalized[0] !== normalized[0]) return false;

            if (
                Math.abs(
                    item.normalized.length -
                    normalized.length
                ) > 2
            ) return false;

            return true;

        })

        .map(item => {

            const entry = dictionary.find(
                d => d.word === item.word
            );

            return {

                word: item.word,

                meaning:
                    entry?.meaning ||
                    "Meaning unavailable.",

                score: levenshtein(
                    normalized,
                    item.normalized
                )

            };

        })

        .sort((a,b)=>a.score-b.score)

        .filter(item=>item.score<=2)

        .slice(0,5);

}

openOcrPopup(`

<h2>📖 ${escapeHtml(clickedWord)}</h2>

${
entry
?

`
<h4>अर्थ</h4>

<p>${escapeHtml(entry.meaning)}</p>
`

:

`
<p>Meaning not found.</p>
`
}

${
suggestions.length
?

`
<hr>

<h3>💡 Did you mean?</h3>

${suggestions.map(s=>`

<div class="popup-card">

<div class="popup-word">

✔ ${escapeHtml(s.word)}

</div>

<div class="popup-meaning">

${escapeHtml(s.meaning)}

</div>

<button
class="replace-btn"
data-old="${escapeHtml(clickedWord)}"
data-new="${escapeHtml(s.word + parts.suffix)}">

Replace

</button>

</div>

`).join("")}
`

:

""
}

`);

document.querySelectorAll(".replace-btn").forEach(btn => {

    btn.addEventListener("click", () => {

        const textarea = document.getElementById("ocrText");

        // Save previous text
undoHistory.push(textarea.value);

textarea.value = textarea.value.replace(
    btn.dataset.old,
    btn.dataset.new
);

renderOcrEditor(textarea.value);

closeOcrPopup();

showUndoSnackbar(
    "✅ Corrected",
    () => {

        if(!undoHistory.length) return;

        textarea.value = undoHistory.pop();

        renderOcrEditor(textarea.value);

    }
);

    });

});

}); 
}); 

}

// =========================================
// Reset OCR Editor
// =========================================

function resetOcrEditor() {

    const viewer = document.getElementById("ocrViewer");
    const textarea = document.getElementById("ocrText");

    if (viewer) {
        viewer.style.display = "none";
        viewer.classList.add("hidden");
        viewer.innerHTML = "";
    }

    if (textarea) {
        textarea.style.display = "";
        textarea.value = "";
    }

    const spellResults = document.getElementById("spellResults");

    if (spellResults) {
        spellResults.innerHTML = "";
    }

    undoHistory = [];

}

function openOcrPopup(html){

    const popup = document.getElementById("ocrPopup");

    const content = document.getElementById("ocrPopupContent");

    content.innerHTML = html;

    popup.classList.remove("hidden");

}

function closeOcrPopup(){

    document
        .getElementById("ocrPopup")
        .classList.add("hidden");

}

document
.getElementById("ocrPopup")
.addEventListener("click",e=>{

    if(e.target.id==="ocrPopup"){

        closeOcrPopup();

    }

});

function showUndoSnackbar(message, callback){

    const snackbar = document.getElementById("undoSnackbar");
    const text = document.getElementById("undoText");
    const action = document.getElementById("undoAction");

    text.textContent = message;

    snackbar.classList.remove("hidden");

    clearTimeout(undoTimer);

    action.onclick = () => {

        callback();

        snackbar.classList.add("hidden");

    };

    undoTimer = setTimeout(() => {

        snackbar.classList.add("hidden");

    }, 5000);

}