// =========================================
// Search History Module
// =========================================

const HISTORY_KEY = "sabdhasathi_history";
const MAX_HISTORY = 20;

function getHistory() {
    return JSON.parse(
        localStorage.getItem(HISTORY_KEY)
    ) || [];
}

function saveHistory(history) {
    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(history)
    );
}

function addHistory(word) {

    let history = getHistory();

    history = history.filter(item => item !== word);

    history.unshift(word);

    if (history.length > MAX_HISTORY) {
        history = history.slice(0, MAX_HISTORY);
    }

    saveHistory(history);
}