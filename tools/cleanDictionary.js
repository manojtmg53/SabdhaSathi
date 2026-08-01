const fs = require("fs");
const path = require("path");

const inputFile = path.join(__dirname, "dictionary.json");

const dictionary = JSON.parse(
    fs.readFileSync(inputFile, "utf8")
);

const cleaned = dictionary.map(entry => {

    let word = entry.word.trim();
    let variant = "";
    let etymology = entry.etymology || "";
    let partOfSpeech = entry.partOfSpeech || "";
    let meaning = entry.meaning || "";

    // Extract variant: अ(२) -> word=अ, variant=2
    const variantMatch = word.match(/^(.*?)\((.*?)\)$/);

    if (variantMatch) {

        word = variantMatch[1].trim();
        variant = variantMatch[2].trim();

    }

    // Extract etymology from partOfSpeech
    const posMatch = partOfSpeech.match(/^(\[.*?\])\s*(.*)$/);

    if (posMatch) {

        etymology = posMatch[1];
        partOfSpeech = posMatch[2];

    }

    // Extract etymology from meaning
    const meaningMatch = meaning.match(/^(\[.*?\])\s*(.*)$/);

    if (meaningMatch && !etymology) {

        etymology = meaningMatch[1];
        meaning = meaningMatch[2];

    }

    return {

        id: entry.id,
        word,
        variant,
        etymology,
        partOfSpeech,
        meaning

    };

});

const outputFile = path.join(
    __dirname,
    "dictionary-clean.json"
);

fs.writeFileSync(
    outputFile,
    JSON.stringify(cleaned, null, 2),
    "utf8"
);

console.log("Cleaned entries:", cleaned.length);
console.log(cleaned.slice(0,10));
console.log("Saved:", outputFile);