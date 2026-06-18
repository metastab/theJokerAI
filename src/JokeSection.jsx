
import ReactMarkdown from "react-markdown"

export default function JokeSection(props) {
    if (!props.joke) {
        return (
            <section className="joke-container" aria-live="polite">
                <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </section>
        )
    }

    return (
        <section className="joke-container" aria-live="polite">
            <ReactMarkdown id="joke">{props.joke}</ReactMarkdown>
        </section>
    )
}