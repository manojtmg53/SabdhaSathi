// =========================================
// Utility Functions
// =========================================

async function copyText(text) {

    try {

        await navigator.clipboard.writeText(text);

        return true;

    } catch (error) {

        console.error(error);

        return false;

    }

}

function escapeHtml(text) {

    return (text || "")
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

}