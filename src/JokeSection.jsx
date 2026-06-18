
import ReactMarkdown from "react-markdown"
export default function JokeSection(props) {
    return (
        <section className="joke-container" aria-live="polite">
            {/* <h2 id="joke-header">The Grand Joke:</h2> */}
            <ReactMarkdown id="joke">{props.joke}</ReactMarkdown>
        </section>
    )
}