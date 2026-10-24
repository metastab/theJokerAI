import React, { useState } from 'react'
import Head from './Header.jsx'
import Body from './body.jsx'
import './App.css'

function App() {
    const [isOfflineMode, setIsOfflineMode] = useState(false)

    return (
        <>
            <Head isOfflineMode={isOfflineMode} onToggleOffline={() => setIsOfflineMode(prev => !prev)} />
            <Body isOfflineMode={isOfflineMode} setIsOfflineMode={setIsOfflineMode} />
        </>
    )
}

export default App