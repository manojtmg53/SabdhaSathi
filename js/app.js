// =========================================
// SabdhaSathi
// Main App
// =========================================

const searchInput = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearBtn");
const themeBtn = document.getElementById("themeBtn");
const results = document.getElementById("results");

function performSearch() {

    const query = searchInput.value;

    if (!query.trim()) {
        showWelcome();
        return;
    }

    addHistory(query);
    
    const matches = searchDictionary(query);

    renderResults(matches);
}

async function init() {

    const loaded = await loadDictionary();

    if (!loaded) {

        results.innerHTML = `
            <p class="welcome">
                ❌ Failed to load dictionary.
            </p>
        `;

        return;
    }

    showWelcome();

    searchInput.addEventListener("input", performSearch);

    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            performSearch();
        }
    });

    clearBtn.addEventListener("click", () => {

        searchInput.value = "";

        showWelcome();

        searchInput.focus();

    });

    themeBtn.addEventListener("click", () => {

        alert("Dark mode coming soon.");

    });

}

init();