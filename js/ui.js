// =========================================
// UI Module
// =========================================

const wordDetails = document.getElementById("wordDetails");

// =========================================
// Welcome
// =========================================

function showWelcome() {

    hideDetails();

    const history = getHistory();

    if (history.length === 0) {

        results.innerHTML = `
            <p class="welcome">
                स्वागत छ 👋<br>
                खोजी सुरु गर्न शब्द टाइप गर्नुहोस्।
            </p>
        `;

        return;
    }

    results.innerHTML = `
        <div class="results-header">
            <h3>🕒 Recent Searches</h3>
        </div>

        ${history.map(word => `
            <article class="word-card history-card"
                     data-word="${word}">

                <div class="word-content">
                    <h2>${word}</h2>
                </div>

            </article>
        `).join("")}
    `;

    document.querySelectorAll(".history-card").forEach(card => {

        card.addEventListener("click", () => {

            searchInput.value = card.dataset.word;

            performSearch(true);

        });

    });

}

// =========================================

function showNoResults() {

    hideDetails();

    results.innerHTML = `
        <div class="empty-state">
            <span class="material-symbols-rounded empty-icon">
                search_off
            </span>

            <h3>No Results</h3>

            <p>Try another word.</p>
        </div>
    `;

}

// =========================================

function renderResults(words) {

    hideDetails();

    if (words.length === 0) {

        showNoResults();
        return;

    }

    results.innerHTML = `

        <div class="results-header">

            <h3>
                ${words.length} Result${words.length > 1 ? "s" : ""}
            </h3>

        </div>

        ${words.map(item => `

            <article
                class="word-card result-card"
                data-id="${item.id}">

                <div class="word-content">

                    <h2>${item.word}</h2>

                    <small>

                        ${
                            Array.isArray(item.english)
                            ? item.english.join(", ")
                            : (item.english || "")
                        }

                    </small>

                    <p>${item.meaning}</p>

                </div>

                <div class="card-actions">

                   <button
    class="action-btn favorite-btn ${isFavorite(item.id) ? "active" : ""}"
    data-id="${item.id}"
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

                    <button
                        class="action-btn detail-btn"
                        data-id="${item.id}">

                        <span class="material-symbols-rounded">
                            arrow_forward_ios
                        </span>

                    </button>

                </div>

            </article>

        `).join("")}

    `;

    attachCardEvents();

}

// =========================================
// Details
// =========================================

function showDetails(id) {

    const item = dictionary.find(w => w.id == id);

    if (!item) return;

    // Hide search results
results.style.display = "none";

    wordDetails.classList.remove("hidden");

    wordDetails.innerHTML = `

        <div class="details-card">

        <button id="backToResults" class="back-btn">
    <span class="material-symbols-rounded">arrow_back</span>
    Back
</button>

            <h2>${item.word}</h2>

            ${
                item.etymology
                ? `
                <p>
                    <strong>Etymology</strong><br>
                    ${item.etymology}
                </p>
                `
                : ""
            }

            <p>
                <strong>Meaning</strong><br>
                ${item.meaning}
            </p>

            ${
                item.partOfSpeech
                ? `
                <p>
                    <strong>Part of Speech</strong>
                    <span class="pos-badge">
                        ${item.partOfSpeech}
                    </span>
                </p>
                `
                : ""
            }

            ${
                item.english
                ? `
                <p>
                    <strong>English</strong><br>
                    ${
                        Array.isArray(item.english)
                        ? item.english.join(", ")
                        : item.english
                    }
                </p>
                `
                : ""
            }

            ${
                item.synonyms?.length
                ? `
                <p>
                    <strong>Synonyms</strong><br>
                    ${item.synonyms.join(", ")}
                </p>
                `
                : ""
            }

            ${
                item.example
                ? `
                <p>
                    <strong>Example</strong><br>
                    ${item.example}
                </p>
                `
                : ""
            }

        </div>

    `;

    wordDetails.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
    
    document
    .getElementById("backToResults")
    .addEventListener("click", () => {

        hideDetails();

        results.style.display = "";

        results.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });
}

function hideDetails() {

    wordDetails.classList.add("hidden");
    wordDetails.innerHTML = "";

    results.style.display = "";

}

// =========================================
// Events
// =========================================

function attachCardEvents() {

    // Copy

    document.querySelectorAll(".copy-btn").forEach(button => {

        button.addEventListener("click", async (e) => {

            e.stopPropagation();

            const success = await copyText(
`${button.dataset.word}
${button.dataset.meaning}`
            );

            if (!success) return;

            button.innerHTML = `
                <span class="material-symbols-rounded">
                    check
                </span>
            `;

            setTimeout(() => {

                button.innerHTML = `
                    <span class="material-symbols-rounded">
                        content_copy
                    </span>
                `;

            },1000);

        });

    });

    // Favorite

    document.querySelectorAll(".favorite-btn").forEach(button => {

        button.addEventListener("click", (e) => {

            e.stopPropagation();

            const item = dictionary.find(
    w => w.id == button.dataset.id
);

toggleFavorite(item);

            // Re-render current page context
            const favoritesNav = document.getElementById("favoritesNav");
            const isFavoritesActive = favoritesNav && favoritesNav.classList.contains("active");

            if (isFavoritesActive) {
                showFavoritesPage();
            } else {
                performSearch();
            }

        });

    });

    // Details Button

    document.querySelectorAll(".detail-btn").forEach(button => {

        button.addEventListener("click", (e) => {

            e.stopPropagation();

            showDetails(button.dataset.id);

        });

    });

    // Entire Card

    document.querySelectorAll(".result-card").forEach(card => {

        card.addEventListener("click", () => {

            showDetails(card.dataset.id);

        });

    });

}
// =========================================
// Live Suggestions
// =========================================

function showSuggestions(words) {

    const suggestions = document.getElementById("suggestions");

    if (!suggestions) return;

    if (words.length === 0) {

        suggestions.style.display = "none";
        suggestions.innerHTML = "";

        results.style.display = "";

        return;
    }

    suggestions.style.display = "block";

    // Hide stale results while the suggestion dropdown is open
    results.style.display = "none";

    suggestions.innerHTML = words.slice(0,8).map(item => `

        <div
            class="suggestion-item"
            data-id="${item.id}">

            <div class="suggestion-info">

                <strong>${item.word}</strong>

                <small>

                    ${
                        Array.isArray(item.english)
                        ? item.english.join(", ")
                        : (item.english || "")

                    }

                </small>

            </div>

            <div class="suggestion-actions">

                <button
                    class="action-btn favorite-btn ${isFavorite(item.id) ? "active" : ""}"
                    data-id="${item.id}"
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

        </div>

    `).join("");

    attachSuggestionEvents();

}
// =========================================
// Suggestion Events
// =========================================
// =========================================
// Suggestion Events
// =========================================

function attachSuggestionEvents() {

    // Click suggestion
    document.querySelectorAll(".suggestion-item").forEach(item => {

        item.addEventListener("click", () => {

            const id = item.dataset.id;

            const word = dictionary.find(w => w.id == id);

            if (!word) return;

            searchInput.value = word.word;

            document.getElementById("suggestions").style.display = "none";

            performSearch(true);

            showDetails(id);

        });

    });

    // Favorite
    document.querySelectorAll(".favorite-btn").forEach(button => {

        if (!button.closest("#suggestions")) return;

        button.addEventListener("click", (e) => {

            e.preventDefault();
            e.stopPropagation();

            const item = dictionary.find(
    w => w.id == button.dataset.id
);

if (!item) return;

toggleFavorite(item);

button.classList.toggle("active");

        });

    });

    // Copy
    document.querySelectorAll(".copy-btn").forEach(button => {

        if (!button.closest("#suggestions")) return;

        button.addEventListener("click", async (e) => {

            e.preventDefault();
            e.stopPropagation();

            const success = await copyText(
`${button.dataset.word}
${button.dataset.meaning}`
            );

            if (!success) return;

            button.innerHTML =
                `<span class="material-symbols-rounded">check</span>`;

            setTimeout(() => {

                button.innerHTML =
                    `<span class="material-symbols-rounded">content_copy</span>`;

            },1000);

        });

    });

}