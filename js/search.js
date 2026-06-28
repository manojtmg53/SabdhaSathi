// =========================================
// Search Module
// =========================================

function searchDictionary(query) {

    query = query.trim().toLowerCase();

    if (query === "") {
        return [];
    }

    return dictionary.filter(item =>
        item.word.toLowerCase().includes(query)
    );

}