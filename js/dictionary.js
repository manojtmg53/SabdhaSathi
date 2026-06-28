// =========================================
// Dictionary Module
// =========================================

let dictionary = [];

async function loadDictionary() {
    try {
        const response = await fetch("data/dictionary.json");

        if (!response.ok) {
            throw new Error("Failed to load dictionary.");
        }

        dictionary = await response.json();

        console.log(`📚 Loaded ${dictionary.length} words`);

        return true;

    } catch (error) {

        console.error(error);

        return false;
    }
}