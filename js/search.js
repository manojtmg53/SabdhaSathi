// =========================================
// Search Engine
// =========================================

function normalize(text) {
    return (text || "")
        .toString()
        .toLowerCase()
        .trim();
}


function searchDictionary(query) {

    query = normalize(query);

    if (!query) return [];

    const exact = [];
    const starts = [];
    const contains = [];

    for (const item of dictionary) {

        const word = normalize(item.word);

        if (word === query) {

            exact.push(item);

        } else if (word.startsWith(query)) {

            starts.push(item);

        } else if (word.includes(query)) {

            contains.push(item);

        }

    }

    return [
        ...exact,
        ...starts,
        ...contains
    ].slice(0,100);

}

function getSuggestions(query) {

    query = normalize(query);

    if (!query) return [];

    const matches = [];

    for (const item of dictionary) {

        const word = normalize(item.word);
        const english = normalize(
            Array.isArray(item.english)
                ? item.english.join(" ")
                : (item.english || "")
        );

        if (word.startsWith(query) || english.startsWith(query)) {
            matches.push(item);
        }

    }

    return matches.slice(0, 8);

}