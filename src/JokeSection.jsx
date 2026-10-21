
import React, { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"

const LOADING_PHRASES = [
    "Consulting the royal jester...",
    "Weaving your keywords into comedic gold...",
    "Balancing the setup and punchline...",
    "Tickling the comedic muse...",
    "Polishing the punchline for maximum laughter..."
]

export default function JokeSection(props) {
    const [phraseIndex, setPhraseIndex] = useState(0)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!props.isLoading) return
        const timer = setInterval(() => {
            setPhraseIndex((prev) => (prev + 1) % LOADING_PHRASES.length)
        }, 2200)
        return () => clearInterval(timer)
    }, [props.isLoading])

    function handleCopy() {
        if (!props.joke) return
        navigator.clipboard.writeText(props.joke).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }

    return (
        <section className="joke-section-wrapper" aria-live="polite">
            {props.isLoading && (
                <div className="joke-container loading-state">
                    <div className="jester-stage">
                        {/* Animated Jester Hat & Bells SVG */}
                        <div className="jester-icon-anim" aria-hidden="true">
                            <svg viewBox="0 0 72 72" width="56" height="56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="36" cy="36" r="34" fill="#FDF8F3" stroke="#EBDCCB" strokeWidth="2" />
                                {/* Jester Hat */}
                                <path d="M22 45C22 45 20 33 28 32C32 31.5 34 37 36 37C38 37 40 31.5 44 32C52 33 50 45 50 45H22Z" fill="#24150D" />
                                {/* Curved peaks */}
                                <path d="M25 33C21 26 14 26 12 30C10.5 33 14 36 19 36" stroke="#C98A3C" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M47 33C51 26 58 26 60 30C61.5 33 58 36 53 36" stroke="#C98A3C" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M36 32V20C36 17 39 16 41 18" stroke="#D96B27" strokeWidth="2.5" strokeLinecap="round" />
                                {/* Bells */}
                                <circle cx="12" cy="30" r="3" fill="#D96B27" className="bell-sway-left" />
                                <circle cx="60" cy="30" r="3" fill="#D96B27" className="bell-sway-right" />
                                <circle cx="41" cy="18" r="3" fill="#C98A3C" className="bell-sway-top" />
                                {/* Mask Smile */}
                                <path d="M28 49C32 53 40 53 44 49" stroke="#C98A3C" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                        </div>

                        {/* Juggling comedy spheres */}
                        <div className="juggling-balls">
                            <span className="ball ball-1"></span>
                            <span className="ball ball-2"></span>
                            <span className="ball ball-3"></span>
                        </div>

                        {/* Animated rotating status messages */}
                        <div className="loading-phrase-container">
                            <p className="loading-phrase" key={phraseIndex}>
                                {LOADING_PHRASES[phraseIndex]}
                            </p>
                        </div>

                        <div className="loading-shimmer-bar">
                            <div className="shimmer-indicator"></div>
                        </div>
                    </div>
                </div>
            )}

            {props.joke && !props.isLoading && (
                <div className="joke-container joke-ready">
                    <div className="joke-card-header">
                        <div className="joke-badge">
                            <span className="badge-icon">🎭</span>
                            <span className="badge-label">The Court Jester's Wit</span>
                        </div>
                        <button
                            type="button"
                            className={`copy-btn ${copied ? "copied" : ""}`}
                            onClick={handleCopy}
                            title="Copy joke to clipboard"
                        >
                            {copied ? (
                                <>
                                    <span className="copy-icon">✓</span> Copied!
                                </>
                            ) : (
                                <>
                                    <span className="copy-icon">📋</span> Copy
                                </>
                            )}
                        </button>
                    </div>

                    <div className="joke-body">
                        <span className="watermark-quote" aria-hidden="true">“</span>
                        <div className="joke-markdown-content">
                            <ReactMarkdown id="joke">{props.joke}</ReactMarkdown>
                        </div>
                    </div>

                    <div className="joke-footer">
                        <span className="joke-footer-tip">✦ Handcrafted by The Joker AI</span>
                    </div>
                </div>
            )}
        </section>
    )
}