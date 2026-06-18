// API calls are now proxied through the Express backend (server/)
// so the HuggingFace API key never reaches the browser.

const API_URL = "https://the-joker-ai-backend.vercel.app/api/joke"

export async function getJokeFromMistral(ingredientsArr) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keywords: ingredientsArr }),
        })

        if (!response.ok) {
            const err = await response.json()
            throw new Error(err.error || "Server error")
        }

        const data = await response.json()
        return data.joke
    } catch (err) {
        console.error(err.message)
    }
}