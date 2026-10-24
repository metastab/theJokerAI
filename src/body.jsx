import React, { useState, useRef } from "react"
import { Sparkles, Plus, X, RotateCcw, Tag, Loader2, Info } from "lucide-react"
import { getJokeFromMistral } from "./ai"
import JokeSection from "./JokeSection";

const SUGGESTIONS = ["espresso", "monday morning", "bad wifi", "procrastination", "gym", "commute", "coffee"]

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

export default function Body({ isOfflineMode = false, setIsOfflineMode }) {
    const [keywords, setKeywords] = useState([]);
    const [joke, setJoke] = useState("")
    const [error, setError] = useState(null)
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
        setError(null)
    }

    async function getJoke(overrideOffline) {
        if (keywords.length < 3 || isLoading) return
        setJoke("")
        setError(null)
        setIsLoading(true)

        const useOffline = overrideOffline !== undefined ? overrideOffline : isOfflineMode

        if (useOffline) {
            // Offline mode: generate using local templates without contacting Mistral
            setTimeout(() => {
                try {
                    const offlineJoke = createSmartJoke(keywords)
                    setJoke(offlineJoke)
                } catch (err) {
                    setError("Failed to generate offline template joke.")
                } finally {
                    setIsLoading(false)
                }
            }, 300)
            return
        }

        // Online mode: query Mistral API; on failure, display error state instead of falling back
        try {
            const jokeMarkdown = await getJokeFromMistral(keywords)
            if (jokeMarkdown) {
                setJoke(jokeMarkdown)
            } else {
                setError("Mistral AI did not return a joke. Please try again or switch to offline mode.")
            }
        } catch (err) {
            console.error("Mistral API error:", err)
            setError(err.message || "Mistral AI was unable to respond. Please check your network or try offline mode.")
        } finally {
            setIsLoading(false)
        }
    }

    function handleSwitchToOfflineAndGenerate() {
        if (setIsOfflineMode) {
            setIsOfflineMode(true)
        }
        getJoke(true)
    }

    const availableSuggestions = SUGGESTIONS.filter(
        s => !keywords.some(k => k.toLowerCase() === s.toLowerCase())
    ).slice(0, 4)

    return (
        <main className="main-content">
            {/* Header intro */}
            <section className="intro-section">
                <h1 className="intro-title">Generate an original joke from keywords</h1>
                <p className="intro-desc">
                    Enter at least three topics or themes. The model synthesizes them into a custom comedic setup and punchline.
                </p>
            </section>

            {/* Input Workspace Card */}
            <div className="card workspace-card">
                {/* Offline mode toggle */}
                <div className="mode-toggle-row">
                    <div className="mode-toggle-info">
                        <span className="mode-toggle-title">Offline model mode</span>
                        <span className="mode-toggle-hint">Generate locally via templates without calling Mistral AI</span>
                    </div>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={isOfflineMode}
                        className={`toggle-switch ${isOfflineMode ? "active" : ""}`}
                        onClick={() => setIsOfflineMode && setIsOfflineMode(prev => !prev)}
                        title={isOfflineMode ? "Turn off offline mode" : "Turn on offline mode"}
                    >
                        <span className="toggle-switch-track">
                            <span className="toggle-switch-thumb" />
                        </span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="keyword-input-group">
                    <div className="input-field-wrapper">
                        <Tag className="input-icon" size={16} strokeWidth={2} aria-hidden="true" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Add a keyword (e.g. coffee, rain)..."
                            aria-label="New keyword input"
                            name="keywords"
                            autoComplete="off"
                            className="text-input"
                        />
                    </div>
                    <button type="submit" className="btn btn-secondary">
                        <Plus size={16} strokeWidth={2.2} aria-hidden="true" />
                        <span>Add</span>
                    </button>
                </form>

                {/* Suggestions row */}
                {availableSuggestions.length > 0 && (
                    <div className="suggestions-row">
                        <span className="suggestions-label">Suggestions:</span>
                        <div className="suggestions-list">
                            {availableSuggestions.map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    className="suggestion-tag"
                                    onClick={() => handleAddKeyword(s)}
                                >
                                    <Plus size={12} strokeWidth={2} aria-hidden="true" />
                                    <span>{s}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Requirement Progress & Status */}
                <div className="requirement-bar">
                    <div id="min-items-warning" className="requirement-info">
                        <Info size={15} strokeWidth={2} className="requirement-icon" aria-hidden="true" />
                        <span>
                            {keywords.length < 3
                                ? `Add at least 3 keywords (${keywords.length}/3 added)`
                                : `Ready to generate with ${keywords.length} keywords`}
                        </span>
                    </div>

                    <div className="segmented-progress" aria-hidden="true">
                        <div className={`segment ${keywords.length >= 1 ? "active" : ""}`} />
                        <div className={`segment ${keywords.length >= 2 ? "active" : ""}`} />
                        <div className={`segment ${keywords.length >= 3 ? "active" : ""}`} />
                    </div>
                </div>

                {/* Keywords tag cloud */}
                {keywords.length > 0 && (
                    <div className="keywords-collection">
                        <div className="collection-header">
                            <h2 id="form-header" className="collection-title">
                                Selected keywords
                                <span className="counter-pill">{keywords.length}</span>
                            </h2>
                            <button
                                type="button"
                                className="text-action-btn"
                                onClick={handleClearAll}
                                title="Clear all keywords"
                            >
                                <RotateCcw size={13} strokeWidth={2} aria-hidden="true" />
                                <span>Clear all</span>
                            </button>
                        </div>

                        <ul id="keyword-list" className="tags-grid">
                            {keywords.map((keyword, index) => (
                                <li
                                    id="typed-keywords"
                                    key={`${keyword}-${index}`}
                                    className="tag-item"
                                >
                                    <span className="tag-label">{keyword}</span>
                                    <button
                                        type="button"
                                        className="tag-remove-btn"
                                        onClick={() => handleRemoveKeyword(index)}
                                        aria-label={`Remove ${keyword}`}
                                    >
                                        <X size={13} strokeWidth={2.2} aria-hidden="true" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Primary Action Button */}
                <div className="action-row">
                    <button
                        type="button"
                        className="btn btn-primary generate-btn"
                        onClick={() => getJoke()}
                        disabled={keywords.length < 3 || isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={16} strokeWidth={2.2} className="spinner" aria-hidden="true" />
                                <span>{isOfflineMode ? "Composing offline joke..." : "Generating joke with Mistral..."}</span>
                            </>
                        ) : (
                            <>
                                <Sparkles size={16} strokeWidth={2} aria-hidden="true" />
                                <span>{isOfflineMode ? "Generate offline joke" : "Generate joke"}</span>
                            </>
                        )}
                    </button>
                    {keywords.length < 3 && (
                        <span className="action-helper-text">
                            Add {3 - keywords.length} more {3 - keywords.length === 1 ? "keyword" : "keywords"} to enable
                        </span>
                    )}
                </div>
            </div>

            {/* Joke display, Error state & Loading Section */}
            {(isLoading || joke || error) && (
                <JokeSection
                    joke={joke}
                    error={error}
                    isLoading={isLoading}
                    isOffline={isOfflineMode}
                    keywords={keywords}
                    onRegenerate={() => getJoke()}
                    onRetry={() => getJoke()}
                    onSwitchOffline={handleSwitchToOfflineAndGenerate}
                />
            )}
        </main>
    )
}