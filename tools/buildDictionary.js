const fs = require("fs");
const path = require("path");

const dictionary = JSON.parse(
    fs.readFileSync(
        path.join(__dirname, "dictionary-clean.json"),
        "utf8"
    )
);

// Sort alphabetically
dictionary.sort((a, b) =>
    a.word.localeCompare(b.word, "ne")
);

function normalizeNepali(word){

    return word

        .replace(/ग्य/g,"ज्ञ")
        .replace(/तर/g,"त्र")

        .replace(/ण/g,"न")
        .replace(/श/g,"स")
        .replace(/ष/g,"स")

        .replace(/ृ/g,"र")
        .replace(/ँ/g,"")
        .replace(/ं/g,"")

        .trim();

}

// Build lightweight index
const index = dictionary.map(entry => ({
    id: entry.id,
    word: entry.word,
    normalized: normalizeNepali(entry.word)
}));

// Save full dictionary
fs.writeFileSync(
    path.join(__dirname, "dictionary-final.json"),
    JSON.stringify(dictionary)
);

// Save search index
fs.writeFileSync(
    path.join(__dirname, "dictionary-index.json"),
    JSON.stringify(index)
);

console.log("Dictionary:", dictionary.length);
console.log("Index:", index.length);
console.log("Done.");