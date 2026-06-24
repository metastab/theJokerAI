
import ReactMarkdown from "react-markdown"

export default function JokeSection(props) {
    return (
        <>
            {props.isLoading && (       
                <section className="joke-container" aria-live="polite">
                    <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </section>
            )}

            {props.joke && (            
                <section className="joke-container" aria-live="polite">
                    <ReactMarkdown id="joke">{props.joke}</ReactMarkdown>
                </section>
            )}
        </>
    )
}