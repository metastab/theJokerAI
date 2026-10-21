export default function Header() {
    return (
        <header>
            <div className="header-container">
                <div className="header-brand">
                    <div className="joker-img-frame">
                        <img id="joker" src="/joker.png" alt="joker-logo" />
                    </div>
                    <div className="header-titles">
                        <h1 id="joker-text">The Joker <span className="header-badge">AI</span></h1>
                        <p className="header-subtitle">Wit & Humour on Demand</p>
                    </div>
                </div>
            </div>
        </header>
    )
}