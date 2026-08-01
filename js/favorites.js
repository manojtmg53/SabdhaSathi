// =========================================
// Favorites Module
// =========================================

const FAVORITES_KEY = "sabdhasathi_favorites";

function getFavorites() {
    return JSON.parse(
        localStorage.getItem(FAVORITES_KEY)
    ) || [];
}

function saveFavorites(favorites) {
    localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(favorites)
    );
}

function isFavorite(id) {

    return getFavorites().some(item => item.id === id);

}

function toggleFavorite(wordObject) {

    let favorites = getFavorites();

    const exists = favorites.find(
    item => item.id === wordObject.id
);

if (exists) {

    favorites = favorites.filter(
        item => item.id !== wordObject.id
    );

} else {

    favorites.push(wordObject);

}

    saveFavorites(favorites);
}