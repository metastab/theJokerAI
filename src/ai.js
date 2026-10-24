// API calls are now proxied through the Express backend (server/)
// so the HuggingFace API key never reaches the browser.

const API_URL = "https://the-joker-ai-backend.vercel.app/api/joke"

export async function getJokeFromMistral(ingredientsArr) {
    let response;
    try {
        response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keywords: ingredientsArr }),
        })
    } catch (networkErr) {
        throw new Error("Network error: Unable to reach the Mistral AI server. Please check your connection or try offline mode.")
    }

    if (!response.ok) {
        let errorMsg = "Mistral AI server encountered an error."
        try {
            const err = await response.json()
            errorMsg = err.error || err.message || errorMsg
        } catch (_) {
            errorMsg = `Server error (${response.status} ${response.statusText || "Unknown"})`
        }
        throw new Error(errorMsg)
    }

    const data = await response.json()
    if (!data || typeof data.joke !== "string" || !data.joke.trim()) {
        throw new Error("Mistral AI returned an empty or invalid response.")
    }

    return data.joke
}