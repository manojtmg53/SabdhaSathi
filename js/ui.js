// =========================================
// UI Module
// =========================================

const wordDetails = document.getElementById("wordDetails");

// =========================================
// Welcome
// =========================================

function showWelcome() {

    const history = getHistory();

    if (history.length === 0) {

        results.innerHTML = `
            <p class="welcome">
                Type a word to search.
            </p>
        `;

        return;
    }

    results.innerHTML = `
        <div class="results-header">
            <h3>🕒 Recent Searches</h3>
        </div>

        ${history.map(word => `
            <article class="word-card history-card" data-word="${word}">
                <div class="word-content">
                    <h2>${word}</h2>
                </div>
            </article>
        `).join("")}
    `;

    document.querySelectorAll(".history-card").forEach(card => {

        card.addEventListener("click", () => {

            searchInput.value = card.dataset.word;
            performSearch();

        });

    });

}

// =========================================

function showNoResults() {

    results.innerHTML = `
        <div class="empty-state">
            <h3>No Results</h3>
            <p>Try another word.</p>
        </div>
    `;

    hideDetails();

}

// =========================================

function renderResults(words) {

    if (words.length === 0) {
        showNoResults();
        return;
    }

    results.innerHTML = `
        <div class="results-header">
            <h3>${words.length} Result${words.length > 1 ? "s" : ""}</h3>
        </div>

        ${words.map(item => `

            <article class="word-card result-card"
                     data-id="${item.id}">

                <div class="word-content">
                    <h2>${item.word}</h2>
                    <p>${item.meaning}</p>
                </div>

                <div class="card-actions">

                    <button
                        class="action-btn favorite-btn ${isFavorite(item.word) ? "active" : ""}"
                        data-word="${item.word}"
                        data-meaning="${item.meaning}">

                        <span class="material-symbols-rounded">
                            favorite
                        </span>

                    </button>

                    <button
                        class="action-btn copy-btn"
                        data-word="${item.word}"
                        data-meaning="${item.meaning}">

                        <span class="material-symbols-rounded">
                            content_copy
                        </span>

                    </button>

                </div>

            </article>

        `).join("")}
    `;

    attachCardEvents();

}

// =========================================

function showDetails(id) {

    const word = dictionary.find(item => item.id == id);

    if (!word) return;

    wordDetails.classList.remove("hidden");

    wordDetails.innerHTML = `

        <div class="details-card">

            <h2>${word.word}</h2>

            <p><strong>Meaning</strong><br>${word.meaning}</p>

            <p><strong>English</strong><br>${word.english || "-"}</p>

            <p><strong>Part of Speech</strong><br>${word.partOfSpeech || "-"}</p>

            <p><strong>Synonyms</strong><br>${(word.synonyms || []).join(", ") || "-"}</p>

            <p><strong>Example</strong><br>${word.example || "-"}</p>

        </div>

    `;

    wordDetails.scrollIntoView({
        behavior: "smooth"
    });

}

function hideDetails() {

    wordDetails.classList.add("hidden");
    wordDetails.innerHTML = "";

}

// =========================================

function attachCardEvents() {

    // Copy
    document.querySelectorAll(".copy-btn").forEach(button => {

        button.addEventListener("click", async (e) => {

            e.stopPropagation();

            await copyText(
`${button.dataset.word}
${button.dataset.meaning}`
            );

            button.innerHTML =
            `<span class="material-symbols-rounded">check</span>`;

            setTimeout(() => {

                button.innerHTML =
                `<span class="material-symbols-rounded">content_copy</span>`;

            },1000);

        });

    });

    // Favorite
    document.querySelectorAll(".favorite-btn").forEach(button => {

        button.addEventListener("click",(e)=>{

            e.stopPropagation();

            toggleFavorite({
                word: button.dataset.word,
                meaning: button.dataset.meaning
            });

            performSearch();

        });

    });

    // Open Details
    document.querySelectorAll(".result-card").forEach(card=>{

        card.addEventListener("click",()=>{

            showDetails(card.dataset.id);

        });

    });

}