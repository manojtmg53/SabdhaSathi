// =========================================
// Pages Module
// =========================================

function showFavoritesPage() {

    document.querySelector(".search-section").style.display = "";

    hideDetails();

    const favorites = getFavorites();

    if (favorites.length === 0) {

        results.innerHTML = `
            <div class="empty-state">

                <span class="material-symbols-rounded empty-icon">
                    favorite
                </span>

                <h3>No Favorites</h3>

                <p>Add words by tapping ❤️</p>

            </div>
        `;

        return;

    }

    renderResults(favorites);

}
// =========================================
// Settings Page
// =========================================

function showSettingsPage() {

    document.querySelector(".search-section").style.display = "none";

    hideDetails();

    results.innerHTML = `

        <div class="results-header">
            <h3>⚙️ Settings</h3>
        </div>

        <article class="word-card settings-item" id="themeSetting">
            <h2>🌙 Dark Mode</h2>
            <p>Toggle light and dark theme</p>
        </article>

        <article class="word-card settings-item" id="historySetting">
            <h2>🕒 Clear Search History</h2>
            <p>Remove all recent searches</p>
        </article>

        <article class="word-card settings-item" id="favoritesSetting">
            <h2>❤️ Clear Favorites</h2>
            <p>Remove all favorite words</p>
        </article>

        <article class="word-card">
            <h2>📚 Dictionary</h2>
            <p>Total Words: ${dictionary.length}</p>
        </article>

        <article class="word-card">
            <h2>ℹ️ About</h2>
            <p>SabdhaSathi v1.0 — Offline Nepali Dictionary</p>
            <p class="about-credit">
                Made with ❤️ by
                <a
                    class="about-link"
                    href="https://www.manojtamang53.com.np"
                    target="_blank"
                    rel="noopener">Manoj Tamang</a>
            </p>
        </article>

    `;
        // Dark Mode
    document.getElementById("themeSetting")
        .addEventListener("click", () => {

            toggleTheme();

        });

    // Clear History
    document.getElementById("historySetting")
        .addEventListener("click", () => {

            if (confirm("Clear all recent searches?")) {

                localStorage.removeItem("sabdhasathi_history");

                showToast("🕒 History cleared");

            }

        });

    // Clear Favorites
    document.getElementById("favoritesSetting")
        .addEventListener("click", () => {

            if (confirm("Remove all favorites?")) {

                localStorage.removeItem("sabdhasathi_favorites");

                showToast("❤️ Favorites cleared");

            }

        });

}

// =========================================
// Scan Page
// =========================================

function showScanPage() {

    document.querySelector(".search-section").style.display = "none";

    hideDetails();

    results.innerHTML = `

        <div class="scan-banner">

    <span class="material-symbols-rounded">
        document_scanner
    </span>

    <h2>Scan Text</h2>

    <p>Extract Nepali & English text from images</p>

</div>

        <article class="word-card">

            <div class="scan-buttons">

    <button class="scan-action-btn" id="cameraBtn">

        <span class="material-symbols-rounded">
            photo_camera
        </span>

        Camera

    </button>

    <button class="scan-action-btn" id="galleryBtn">

        <span class="material-symbols-rounded">
            photo_library
        </span>

        Gallery

    </button>

</div>

        </article>

        <article class="word-card">

            <h2>Extracted Text</h2>

            <textarea
    id="ocrText"
    rows="12"
    placeholder="Scanned text will appear here...">
</textarea>

<div
    id="ocrViewer"
    class="ocr-viewer hidden">
</div>

<div id="spellResults"></div>

            <br><br>


    <div class="ocr-buttons">

    <button class="scan-action-btn" id="copyOcrBtn">
        <span class="material-symbols-rounded">
            content_copy
        </span>
        Copy
    </button>

    <button class="scan-action-btn" id="editOcrBtn">
        <span class="material-symbols-rounded">
            spellcheck
        </span>
        Spell Check
    </button>

    <button class="scan-action-btn" id="clearOcrBtn">
        <span class="material-symbols-rounded">
            delete
        </span>
        Clear
    </button>

</div>

</div>

        </article>

    `;
const imagePicker = document.getElementById("imagePicker");

document.getElementById("galleryBtn")
    .addEventListener("click", () => {

        // Remove capture to let user pick from gallery
        imagePicker.removeAttribute("capture");
        imagePicker.click();

    });

document.getElementById("cameraBtn")
    .addEventListener("click", () => {

        // Use front camera on mobile devices
        imagePicker.setAttribute("capture", "environment");
        imagePicker.click();

    });

// Copy OCR text
document.getElementById("copyOcrBtn")
.addEventListener("click", async () => {

    await copyText(document.getElementById("ocrText").value);

    showToast("📋 Text copied");

});

// Clear OCR text (also resets the spell-check review view)
document.getElementById("clearOcrBtn")
.addEventListener("click", () => {

    resetOcrEditor();

    showToast("🗑 Text cleared");

});

// Spell Check (opens the interactive word-by-word review editor)
document.getElementById("editOcrBtn")
.addEventListener("click",()=>{

    const text =
        document.getElementById("ocrText").value.trim();

    if(!text){

        showToast("⚠️ No text to check");

        return;

    }

    renderOcrEditor(text);

});

}

