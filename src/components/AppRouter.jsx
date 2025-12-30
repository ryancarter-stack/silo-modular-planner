import { useState } from 'react'
import App from '../App.jsx'
import RoadmapPage from './RoadmapPage'
import './AppRouter.css'

export default function AppRouter() {
  const [currentView, setCurrentView] = useState('modular')

  return (
    <div className="app-router">
      <nav className="global-nav">
        <div className="nav-brand">
          <span className="brand-icon">🌾</span>
          <span className="brand-text">Silo Planner</span>
        </div>
        <div className="nav-tabs">
          <button
            className={`nav-tab ${currentView === 'modular' ? 'active' : ''}`}
            onClick={() => setCurrentView('modular')}
          >
            <span className="tab-icon">⚙️</span>
            <span className="tab-text">Modular Architecture</span>
          </button>
          <button
            className={`nav-tab ${currentView === 'roadmap' ? 'active' : ''}`}
            onClick={() => setCurrentView('roadmap')}
          >
            <span className="tab-icon">🗺️</span>
            <span className="tab-text">Evolution Roadmap</span>
          </button>
        </div>
      </nav>

      <div className="view-container">
        {currentView === 'modular' && <App />}
        {currentView === 'roadmap' && <RoadmapPage />}
      </div>
    </div>
  )
}
