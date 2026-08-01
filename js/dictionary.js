// =========================================
// Dictionary Module
// =========================================

let dictionary = [];
let dictionaryIndex = [];
let dictionarySet;

async function loadDictionary() {

    try {

        const [indexResponse, dictionaryResponse] = await Promise.all([

            fetch("assets/data/dictionary-index.json"),
            fetch("assets/data/dictionary-final.json")

        ]);

        if (!indexResponse.ok || !dictionaryResponse.ok) {

            throw new Error("Failed to load dictionary.");

        }

        dictionaryIndex = await indexResponse.json();
        dictionary = await dictionaryResponse.json();

        console.log(`📚 Loaded ${dictionary.length} words`);
        console.log(`🔍 Search Index: ${dictionaryIndex.length}`);
        dictionarySet = new Set(
    dictionary.map(item => item.word)
);

console.log("⚡ Dictionary Set:", dictionarySet.size);

        return true;

    } catch (error) {

        console.warn("Fetch failed, trying inline data...", error);

        return loadDictionaryInline();

    }

}

function loadDictionaryInline() {

    return new Promise((resolve) => {

        if (window.__DICT_INLINE) {

            dictionary = window.__DICT_INLINE.dictionary;
            dictionaryIndex = window.__DICT_INLINE.index;
            dictionarySet = new Set(
                dictionary.map(item => item.word)
            );
            console.log(`📚 Loaded inline: ${dictionary.length} words`);
            resolve(true);
            return;

        }

        const script = document.createElement("script");

        script.src = "assets/data/dictionary-inline.js";

        script.onload = () => {

            if (window.__DICT_INLINE) {

                dictionary = window.__DICT_INLINE.dictionary;
                dictionaryIndex = window.__DICT_INLINE.index;
                dictionarySet = new Set(
                    dictionary.map(item => item.word)
                );
                console.log(`📚 Loaded inline: ${dictionary.length} words`);
                resolve(true);

            } else {
                resolve(false);
            }

        };

        script.onerror = () => resolve(false);

        document.head.appendChild(script);

    });

}