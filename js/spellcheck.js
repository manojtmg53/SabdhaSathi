function normalizeNepali(word){

    return word

        // OCR mistakes
        .replace(/ग्य/g,"ज्ञ")
        .replace(/तर/g,"त्र")

        // Similar letters
        .replace(/ण/g,"न")
        .replace(/श/g,"स")
        .replace(/ष/g,"स")

        // Common OCR mistakes
        .replace(/ृ/g,"र")
        .replace(/ँ/g,"")
        .replace(/ं/g,"")

        .trim();

}

function removeNepaliSuffix(word){

    const suffixes = [

        "हरुले",
        "हरुको",
        "हरूमा",
        "हरूबाट",
        "हरूलाई",
        "हरूसँग",

        "हरू",

        "बाट",
        "देखि",
        "सँग",
        "सम्म",

        "लाई",
        "ले",
        "को",
        "का",
        "की",
        "मा"

    ];

    let current = word;

    while (true) {

        let removed = false;

        for (const suffix of suffixes) {

            if (
                current.endsWith(suffix) &&
                current.length > suffix.length + 1
            ) {

                current = current.slice(0, -suffix.length);
                removed = true;
                break;

            }

        }

        if (!removed) break;

    }

    return current;

}

function isCorrectWord(word){

    if (!word) return false;

    const clean = word.replace(/[^\u0900-\u097Fa-zA-Z]/g, "");

    if (!clean) return true;

    // Exact match
    if (dictionarySet.has(clean))
        return true;

    // Normalized match
    const normalized = normalizeNepali(clean);

    if (dictionarySet.has(normalized))
        return true;

    // Base form
    const base = removeNepaliSuffix(clean);

    if (dictionarySet.has(base))
        return true;

    // Normalized base form
    const normalizedBase = normalizeNepali(base);

    if (dictionarySet.has(normalizedBase))
        return true;

    return false;

}


function checkSpelling(text) {

    const words = text.split(/\s+/);

    const resultBox = document.getElementById("spellResults");

    resultBox.innerHTML = "";

    words.forEach(word => {

        const clean = word.replace(/[^\u0900-\u097Fa-zA-Z]/g, "");

        if (!clean) return;

        if(isCorrectWord(clean)) return;

const normalized = normalizeNepali(clean);

const candidates = dictionaryIndex.filter(item => {

    // First letter should match
    if (item.normalized[0] !== normalized[0]) return false;

    // Length difference <= 2
    if (Math.abs(item.normalized.length - normalized.length) > 2)
        return false;

    return true;

});

const suggestions = candidates

    .map(item => {

        const entry = dictionary.find(d => d.word === item.word);

        return {
            word: item.word,
            meaning: entry?.meaning || "",
            score: levenshtein(normalized, item.normalized)
        };

    })

    .sort((a,b)=>a.score-b.score)

    .filter(item=>item.score<=2)

    .slice(0,3);


        resultBox.innerHTML += `

            <div class="spell-item">

                <strong>❌ ${escapeHtml(clean)}</strong>

                ${
    suggestions.length
    ? suggestions.map(s => `
        <button
            class="suggest-btn"
            data-old="${escapeHtml(clean)}"
            data-new="${escapeHtml(s.word)}">
            <strong>✔ ${escapeHtml(s.word)}</strong>
            ${
                s.meaning
                ? `<div class="suggest-meaning">${escapeHtml(s.meaning)}</div>`
                : ""
            }
        </button>
    `).join("")
    : "<br>No suggestion"
}

            </div>

        `;

    });

    attachSpellSuggestionEvents();

    if(resultBox.innerHTML===""){

        showToast("✅ No spelling mistakes");

    }

}

function attachSpellSuggestionEvents(){

    document.querySelectorAll(".suggest-btn").forEach(button=>{

        button.addEventListener("click",()=>{

            const oldWord = button.dataset.old;

            const newWord = button.dataset.new;

            const textarea = document.getElementById("ocrText");

            textarea.value =
                textarea.value.replace(oldWord,newWord);

            checkSpelling(textarea.value);

            showToast("✅ Word corrected");

        });

    });

}