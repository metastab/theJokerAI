import React from "react"
import { Cpu, WifiOff } from "lucide-react"

export default function Header({ isOfflineMode, onToggleOffline }) {
    return (
        <header className="site-header">
            <div className="header-container">
                <div className="header-brand">
                    <div className="brand-logo-frame">
                        <img id="joker" src="/joker.png" alt="The Joker logo" className="brand-logo-img" />
                    </div>
                    <div className="header-titles">
                        <div className="brand-title-row">
                            <span id="joker-text" className="brand-name">The Joker</span>
                            <span className="header-badge">AI</span>
                        </div>
                        <p className="header-subtitle">Wit &amp; humor on demand</p>
                    </div>
                </div>

                <div className="header-actions">
                    <div
                        className={`status-indicator ${isOfflineMode ? "status-offline" : "status-online"}`}
                        title={isOfflineMode ? "Offline Mode active (template based)" : "Connected to Mistral AI backend"}
                    >
                        <span className="status-dot"></span>
                        <span className="status-label">
                            {isOfflineMode ? "Offline Mode" : "Mistral 7B"}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    )
}