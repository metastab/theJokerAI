import React, { useState, useRef } from "react"
import { getJokeFromMistral } from "./ai"
import JokeSection from "./JokeSection";

const SUGGESTIONS = ["espresso", "monday morning", "bad wifi", "procrastination", "gym"]

function createSmartJoke(keywords) {
    const k0 = keywords[0] || "coffee"
    const k1 = keywords[1] || "rain"
    const k2 = keywords[2] || "deadlines"
    
    const templates = [
        `Why did the **${k0}** refuse to get along with **${k1}**?\n\nBecause **${k2}** showed up and stole the entire punchline before anyone could finish their sentence!`,
        `A philosopher, an engineer, and an optimist walk into a room to debate **${k0}** and **${k1}**.\n\nAfter three hours of intense deliberation, they unanimously agreed: *"None of this makes sense without a healthy dose of **${k2}**."*`,
        `**Doctor:** *"I've analyzed your test results. You're exhibiting dangerous levels of **${k0}** combined with severe **${k1}**."*\n\n**Patient:** *"Is there any cure?!"*\n\n**Doctor:** *"Take two doses of **${k2}** and don't take life too seriously!"*`,
        `They say life is 10% **${k0}**, 20% **${k1}**, and 70% wondering where on earth **${k2}** came from.\n\n*(And 100% pretending you have everything under control.)*`
    ]
    return templates[Math.floor(Math.random() * templates.length)]
}

export default function Body() {
    const [keywords, setKeywords] = useState([]);
    const [joke, setJoke] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const inputRef = useRef(null)

    function handleAddKeyword(rawKeyword) {
        const trimmed = (rawKeyword || "").trim();
        if (!trimmed) return;
        if (!keywords.some(k => k.toLowerCase() === trimmed.toLowerCase())) {
            setKeywords(prev => [...prev, trimmed])
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        const value = inputRef.current ? inputRef.current.value : "";
        handleAddKeyword(value);
        if (inputRef.current) {
            inputRef.current.value = "";
            inputRef.current.focus();
        }
    }

    function handleRemoveKeyword(indexToRemove) {
        setKeywords(prev => prev.filter((_, idx) => idx !== indexToRemove))
    }

    function handleClearAll() {
        setKeywords([])
        setJoke("")
    }

    async function getJoke() {
        if (keywords.length < 3 || isLoading) return
        setJoke("")
        setIsLoading(true)
        try {
            const jokeMarkdown = await getJokeFromMistral(keywords)
            if (jokeMarkdown) {
                setJoke(jokeMarkdown)
            } else {
                setJoke(createSmartJoke(keywords))
            }
        } catch (err) {
            console.error(err)
            setJoke(createSmartJoke(keywords))
        } finally {
            setIsLoading(false)
        }
    }


    const keyword_list = keywords.map((keyword, index) => {
        return (
            <li id="typed-keywords" className="keyword-chip" key={`${keyword}-${index}`}>
                <span className="keyword-chip-text">{keyword}</span>
                <button
                    type="button"
                    className="keyword-chip-remove"
                    onClick={() => handleRemoveKeyword(index)}
                    aria-label={`Remove ${keyword}`}
                    title="Remove"
                >
                    ×
                </button>
            </li>
        )
    })

    return (
        <main>
            {/* Hero tagline */}
            <div className="hero-banner">
                <span className="hero-kicker">✦ AI Wit Engine</span>
                <h2 className="hero-title">Give the jester 3 words.<br />Get an original punchline.</h2>
                <p className="hero-desc">Feed your themes into the court jester's cauldron and let AI brew a bespoke joke.</p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="keyword-form">
                <div className="input-wrapper">
                    <span className="input-icon" aria-hidden="true">✍</span>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Type a word or topic (e.g. coffee, rain)..."
                        aria-label="keywords"
                        name="keywords"
                        autoComplete="off"
                    />
                </div>
                <button type="submit" className="add-btn">
                    <span className="btn-plus">+</span> Add keyword
                </button>
            </form>

            {/* Suggestions when list is small */}
            {keywords.length < 3 && (
                <div className="suggestions-bar">
                    <span className="suggestions-label">Try adding:</span>
                    <div className="suggestion-pills">
                        {SUGGESTIONS.filter(s => !keywords.includes(s)).slice(0, 3).map((s) => (
                            <button
                                key={s}
                                type="button"
                                className="suggestion-btn"
                                onClick={() => handleAddKeyword(s)}
                            >
                                + {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Warning indicator when fewer than 3 keywords */}
            {keywords.length < 3 && (
                <div className="warning-card">
                    <div id="min-items-warning" className="min-items-pill">
                        <span className="warning-dot"></span>
                        <span>Please provide at least <strong>3 keywords</strong> ({keywords.length}/3 added)</span>
                    </div>
                    <div className="steps-tracker">
                        <div className={`step-dot ${keywords.length >= 1 ? "filled" : ""}`}></div>
                        <div className={`step-dot ${keywords.length >= 2 ? "filled" : ""}`}></div>
                        <div className={`step-dot ${keywords.length >= 3 ? "filled" : ""}`}></div>
                    </div>
                </div>
            )}

            {/* Keywords Section */}
            {keywords.length > 0 && (
                <section className="keywords-section">
                    <div className="section-header-row">
                        <h2 id="form-header">Current keywords <span className="count-badge">{keywords.length}</span></h2>
                        <button type="button" className="clear-btn" onClick={handleClearAll} title="Clear all keywords">
                            Clear all
                        </button>
                    </div>

                    <ul id="keyword-list">
                        {keyword_list}
                    </ul>

                    {keywords.length >= 3 && (
                        <div className="get-keyword-container">
                            <div className="action-text">
                                <h3>Ready for a joke?</h3>
                                <p>The jester has enough fuel to craft your custom jest.</p>
                            </div>
                            <button
                                className="get-joke-btn"
                                onClick={getJoke}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="mini-spin">🎭</span> Jesting...
                                    </>
                                ) : (
                                    <>
                                        <span>🎭</span> Get a Joke.
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </section>
            )}

            {/* Joke display & Loading Section */}
            {(isLoading || joke) && <JokeSection joke={joke} isLoading={isLoading} />}
        </main>
    )
}