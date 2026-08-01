const fs = require("fs");
const path = require("path");

const ENTRY_FOLDER = path.join(
    __dirname,
    "shabdakosha-main",
    "data",
    "dictionaries",
    "kosha-brihat",
    "entries"
);

function getAllFiles(dir) {

    let results = [];

    const items = fs.readdirSync(dir);

    for (const item of items) {

        const fullPath = path.join(dir, item);

        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {

            results = results.concat(getAllFiles(fullPath));

        } else {

            results.push(fullPath);

        }

    }

    return results;

}

const files = getAllFiles(ENTRY_FOLDER);

console.log("Total files:", files.length);

const dictionary = [];
let id = 1;

for (const file of files) {

    const text = fs.readFileSync(file, "utf8");

    const lines = text
        .split("\n")
        .filter(line => line.trim() !== "");

    for (const line of lines) {

        const parts = line.split("---").map(p => p.trim());

        let word = "";
        let etymology = "";
        let partOfSpeech = "";
        let meaning = "";

        // ----------------------------
// 2-part format
// घर --- ना. [प्रा.] १...
// ----------------------------
if (parts.length === 2) {

    word = parts[0];

    const rest = parts[1];

    const match = rest.match(/^([^\d]+?)\s+(.*)$/);

    if (match) {

        partOfSpeech = match[1].trim();
        meaning = match[2].trim();

    } else {

        meaning = rest.trim();

    }

}

// ----------------------------
// 3-part format
// word --- part --- meaning
// ----------------------------
else if (parts.length === 3) {

    word = parts[0];
    partOfSpeech = parts[1];
    meaning = parts[2];

}

// ----------------------------
// 4-part format
// word --- etymology --- part --- meaning
// ----------------------------
else if (parts.length >= 4) {

    word = parts[0];

    if (parts[2] === "") {

        partOfSpeech = parts[1];
        meaning = parts.slice(3).join(" --- ");

    } else {

        etymology = parts[1];
        partOfSpeech = parts[2];
        meaning = parts.slice(3).join(" --- ");

    }

}

        if (!word) continue;

        dictionary.push({
            id: id++,
            word,
            etymology,
            partOfSpeech,
            meaning
        });
    }
}

console.log("Total entries:", dictionary.length);
console.log(dictionary.slice(0,5));


const outputFile = path.join(__dirname, "dictionary.json");

fs.writeFileSync(
    outputFile,
    JSON.stringify(dictionary, null, 2),
    "utf8"
);

console.log("Saved:", outputFile);