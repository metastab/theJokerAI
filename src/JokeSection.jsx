import React, { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { Copy, Check, RefreshCw, Loader2, Sparkles, AlertCircle, Cpu } from "lucide-react"

const LOADING_STEPS = [
    "Analyzing keyword relationships...",
    "Drafting setup and comedic premise...",
    "Refining comedic timing and punchline...",
    "Polishing phrasing with Mistral AI..."
]

export default function JokeSection({
    joke,
    error,
    isLoading,
    isOffline = false,
    keywords = [],
    onRegenerate,
    onRetry,
    onSwitchOffline
}) {
    const [stepIndex, setStepIndex] = useState(0)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!isLoading) {
            setStepIndex(0)
            return
        }
        const interval = setInterval(() => {
            setStepIndex(prev => (prev + 1) % LOADING_STEPS.length)
        }, 1800)
        return () => clearInterval(interval)
    }, [isLoading])

    function handleCopy() {
        if (!joke) return
        navigator.clipboard.writeText(joke).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }).catch(err => {
            console.error("Failed to copy joke: ", err)
        })
    }

    return (
        <section className="card joke-card-container" aria-live="polite">
            {/* Loading State */}
            {isLoading && (
                <div className="loading-state-wrapper">
                    <div className="loading-indicator-box">
                        <Loader2 className="spinner loading-main-spinner" size={28} strokeWidth={2} aria-hidden="true" />
                        <div className="loading-details">
                            <p className="loading-status-title">
                                {isOffline ? "Composing offline joke" : "Generating your joke"}
                            </p>
                            <p className="loading-step-text" key={stepIndex}>
                                {isOffline
                                    ? "Applying local humor templates to keywords..."
                                    : LOADING_STEPS[stepIndex]}
                            </p>
                        </div>
                    </div>
                    <div className="loading-progress-track" aria-hidden="true">
                        <div className="loading-progress-fill" />
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
                <div className="error-state-wrapper">
                    <div className="error-header">
                        <div className="error-title-group">
                            <AlertCircle size={17} strokeWidth={2.2} className="error-icon" aria-hidden="true" />
                            <h2 className="error-title">Mistral AI was unable to respond</h2>
                        </div>
                        <span className="error-badge">Request Failed</span>
                    </div>

                    <div className="error-body">
                        <p className="error-message">{error}</p>
                        <p className="error-hint">
                            The online model service is currently unreachable or encountered an issue. You can retry the request or switch to <strong>Offline Model Mode</strong> to generate jokes using local templates.
                        </p>
                    </div>

                    <div className="error-actions">
                        {onRetry && (
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={onRetry}
                            >
                                <RefreshCw size={13} strokeWidth={2} aria-hidden="true" />
                                <span>Try again</span>
                            </button>
                        )}
                        {onSwitchOffline && (
                            <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={onSwitchOffline}
                            >
                                <Cpu size={13} strokeWidth={2} aria-hidden="true" />
                                <span>Generate in Offline Mode</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Ready Joke State */}
            {joke && !isLoading && !error && (
                <div className="joke-ready-wrapper">
                    <header className="joke-result-header">
                        <div className="joke-title-group">
                            <Sparkles size={16} strokeWidth={2} className="joke-header-icon" aria-hidden="true" />
                            <h2 className="joke-result-title">Generated Joke</h2>
                            <span className={`source-pill ${isOffline ? "source-offline" : ""}`}>
                                {isOffline ? "Offline Template" : "Mistral 7B"}
                            </span>
                        </div>

                        <div className="joke-actions-group">
                            {onRegenerate && (
                                <button
                                    type="button"
                                    className="btn btn-ghost btn-sm"
                                    onClick={onRegenerate}
                                    title="Regenerate joke"
                                >
                                    <RefreshCw size={13} strokeWidth={2} aria-hidden="true" />
                                    <span>Regenerate</span>
                                </button>
                            )}

                            <button
                                type="button"
                                className={`btn btn-secondary btn-sm ${copied ? "btn-copied" : ""}`}
                                onClick={handleCopy}
                                title={copied ? "Copied to clipboard" : "Copy joke to clipboard"}
                            >
                                {copied ? (
                                    <>
                                        <Check size={13} strokeWidth={2.4} aria-hidden="true" />
                                        <span>Copied</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy size={13} strokeWidth={2} aria-hidden="true" />
                                        <span>Copy</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </header>

                    <div className="joke-content-body">
                        <div className="joke-markdown-rendered">
                            <ReactMarkdown id="joke">{joke}</ReactMarkdown>
                        </div>
                    </div>

                    <footer className="joke-result-footer">
                        {keywords.length > 0 && (
                            <div className="joke-keywords-used">
                                <span className="keywords-used-label">Keywords:</span>
                                <div className="keywords-used-pills">
                                    {keywords.map((kw, i) => (
                                        <span key={`${kw}-${i}`} className="mini-keyword-pill">{kw}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        <span className="joke-model-meta">
                            {isOffline ? "Synthesized via local template" : "Synthesized via Mistral AI"}
                        </span>
                    </footer>
                </div>
            )}
        </section>
    )
}