import express from "express"
import cors from "cors"
import { HfInference } from "@huggingface/inference"

const app = express()
const PORT = 3012

const SYSTEM_PROMPT = `
You are an assistant that receives a list of keywords that a user has and make a joke with all of those keywords. The joke can include additional keywords they didn't mention. Format your response in markdown to make it easier to render to a web page. Provide only the markdown format of the joke and nothing else. 
`

// Load API key from environment — never hard-code it here!
const hf = new HfInference(process.env.HF_ACCESS_TOKEN)

app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json())

app.post("/api/joke", async (req, res) => {
    const { keywords } = req.body

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
        return res.status(400).json({ error: "Please provide a non-empty 'keywords' array." })
    }

    const ingredientsString = keywords.join(", ")

    try {
        const response = await hf.chatCompletion({
            model: "Qwen/Qwen2.5-72B-Instruct",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `I have ${ingredientsString}. Please give me a joke!` },
            ],
            max_tokens: 1024,
        })

        const joke = response.choices[0].message.content
        return res.json({ joke })
    } catch (err) {
        console.error("HuggingFace API error:", err.message)
        return res.status(500).json({ error: "Failed to generate joke. Please try again." })
    }
})

const server = app.listen(PORT, () => {
    console.log(`✅  Joke backend running at http://localhost:${PORT}`)
})

// Gracefully close the server when node --watch restarts (SIGTERM)
process.on('SIGTERM', () => {
    server.close(() => process.exit(0))
})
