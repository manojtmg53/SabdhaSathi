// =========================================
// SabdhaSathi
// Main App
// =========================================

const searchInput = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearBtn");
const themeBtn = document.getElementById("themeBtn");
const topSettingsBtn =
    document.getElementById("topSettingsBtn");

const homeNav = document.getElementById("homeNav");
const favoritesNav = document.getElementById("favoritesNav");
const settingsNav = document.getElementById("settingsNav")
const scanNav = document.getElementById("scanNav");;

const results = document.getElementById("results");

function performSearch(saveHistory = false) {

    const query = searchInput.value.trim();

if (!query) {

    const suggestions = document.getElementById("suggestions");

    if (suggestions) {

        suggestions.innerHTML = "";
        suggestions.style.display = "none";

    }

    showWelcome();

    return;

}

    if (saveHistory) {
        addHistory(query);
    }

const matches = searchDictionary(query);


renderResults(matches);
}

async function init() {

    results.innerHTML = `
        <div class="empty-state">
            <span class="material-symbols-rounded empty-icon">dictionary</span>
            <h3>Loading dictionary...</h3>
            <p>पुस्तक खुल्दैछ, कृपया पर्खनुहोस्</p>
        </div>
    `;

    const loaded = await loadDictionary();

    if (!loaded) {

        results.innerHTML = `
            <div class="empty-state">
                <span class="material-symbols-rounded empty-icon">error</span>
                <h3>Failed to load dictionary</h3>
                <p>Please check your connection and reload.</p>
            </div>
        `;

        return;

    }

    loadTheme();

    showWelcome();

    // Register service worker for offline PWA support
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('[App] SW registered'))
            .catch(err => console.warn('[App] SW failed:', err));
    }

    // Attach OCR image picker listener once (imagePicker persists across page views)
    const imagePicker = document.getElementById("imagePicker");

    imagePicker.addEventListener("change", async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const textArea = document.getElementById("ocrText");

        textArea.value = "Reading image... Please wait.";

        try {

            const worker = await Tesseract.createWorker("eng+nep", 1, {
                workerPath: "vendor/tesseract/worker.min.js",
                corePath: "vendor/tesseract/tesseract-core-simd.wasm.js",
                langPath: "vendor/tesseract/langs",
                logger: (m) => {

                    if (m.status === "recognizing text") {

                        textArea.value =
                            `Reading image... ${Math.round(m.progress * 100)}%`;

                    }

                }
            });

            const { data: { text } } = await worker.recognize(file);

            await worker.terminate();

            textArea.value = text;

        } catch (err) {

            console.error(err);

            textArea.value = "OCR failed.";

        } finally {

            e.target.value = "";

        }

    });

    searchInput.addEventListener("input", () => {

        const query = searchInput.value.trim();

        if (query.length > 0) {

            // Show lightweight suggestions while typing
            const suggestions = getSuggestions(query);

            showSuggestions(suggestions);

        } else {

            const suggestions = document.getElementById("suggestions");

            if (suggestions) {
                suggestions.innerHTML = "";
                suggestions.style.display = "none";
            }

            showWelcome();

        }

    });

    searchInput.addEventListener("keydown", (e) => {

        if (e.key === "Enter") {

            const suggestions = document.getElementById("suggestions");

            if (suggestions) {
                suggestions.style.display = "none";
            }

            performSearch(true);

        }

    });

    clearBtn.addEventListener("click", () => {

        searchInput.value = "";

        const suggestions = document.getElementById("suggestions");

        if (suggestions) {
            suggestions.innerHTML = "";
            suggestions.style.display = "none";
        }

        showWelcome();

        searchInput.focus();

    });

    themeBtn.addEventListener("click", toggleTheme);

    topSettingsBtn.addEventListener("click", () => {

    document
        .getElementById("settingsNav")
        .click();

});

homeNav.addEventListener("click", () => {
    document.querySelector(".search-section").style.display = "";

    setActiveNav(homeNav);

    searchInput.value = "";

    const suggestions = document.getElementById("suggestions");

    if (suggestions) {
        suggestions.innerHTML = "";
        suggestions.style.display = "none";
    }

    showWelcome();

});

favoritesNav.addEventListener("click", () => {

    setActiveNav(favoritesNav);

    searchInput.value = "";

    const suggestions = document.getElementById("suggestions");

    if (suggestions) {

        suggestions.innerHTML = "";
        suggestions.style.display = "none";

    }

    showFavoritesPage();

});

}

settingsNav.addEventListener("click", () => {

    setActiveNav(settingsNav);

    searchInput.value = "";

    const suggestions = document.getElementById("suggestions");

    if (suggestions) {

        suggestions.innerHTML = "";
        suggestions.style.display = "none";

    }

    showSettingsPage();

});


init();

// =========================================
// Bottom Navigation
// =========================================

function setActiveNav(activeButton) {

    document.querySelectorAll(".bottom-nav .nav-item")
        .forEach(btn => btn.classList.remove("active"));

    activeButton.classList.add("active");

}

scanNav.addEventListener("click", () => {

    setActiveNav(scanNav);

    searchInput.value = "";

    const suggestions = document.getElementById("suggestions");

    if (suggestions) {
        suggestions.innerHTML = "";
        suggestions.style.display = "none";
    }

    showScanPage();

});

function showToast(message){

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toast.timer);

    toast.timer = setTimeout(()=>{

        toast.classList.remove("show");

    },2000);

}

// =========================================
// Theme
// =========================================

function loadTheme() {

    const theme = localStorage.getItem("theme");

    if (theme === "dark") {

        document.body.classList.add("dark");

    }

    updateThemeIcon();

}

function toggleTheme() {

    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");

    localStorage.setItem(
        "theme",
        isDark ? "dark" : "light"
    );

    updateThemeIcon();

}
function updateThemeIcon() {

    const icon = themeBtn.querySelector(".material-symbols-rounded");

    if (!icon) return;

    icon.textContent = document.body.classList.contains("dark")
        ? "light_mode"
        : "dark_mode";

}