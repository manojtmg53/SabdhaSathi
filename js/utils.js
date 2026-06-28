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