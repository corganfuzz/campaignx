import type { AppView } from '../../hooks/useCampaign'
import { DOMAINS } from '../../data/mockData'
import './TopNav.css'

interface TopNavProps {
  view: AppView
  onHome: () => void
  onNewCampaign: () => void
}

export const TopNav = ({ view, onHome, onNewCampaign }: TopNavProps) => {
  return (
    <nav className="topnav">
      <div className="topnav-left">
        <button className="topnav-logo" onClick={onHome}>
          <span className="logo-icon">✦</span>
          <span className="logo-text">CampaignX</span>
        </button>

        <div className="topnav-divider" />

        <button
          className={`topnav-btn ${view === 'home' ? 'active' : ''}`}
          onClick={onHome}
        >
          Home
        </button>

        <button
          className="topnav-btn accent"
          onClick={onNewCampaign}
        >
          + New Campaign
        </button>

        <button className="topnav-btn">Guides</button>

        <select className="topnav-select">
          {DOMAINS.map((d) => (
            <option key={d.key} value={d.key}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <div className="topnav-right">
        <button className="topnav-btn">📎 Data</button>
        <div className="topnav-avatar">GR</div>
      </div>
    </nav>
  )
}
