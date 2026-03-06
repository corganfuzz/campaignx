import { DOMAINS } from '../../data/mockData'
import logo from '../../assets/logo.svg'
import './TopNav.css'

interface TopNavProps {
  onHome: () => void
}

export const TopNav = ({ onHome }: TopNavProps) => {
  return (
    <nav className="topnav">
      <div className="topnav-left">
        <button className="topnav-logo" onClick={onHome}>
          <img src={logo} alt="Concrete Focus" className="brand-logo" />
          <span className="logo-text">Concrete Focus</span>
        </button>

        <div className="topnav-divider" />

        <select className="topnav-select">
          {DOMAINS.map((d) => (
            <option key={d.key} value={d.key}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <div className="topnav-right">
        <div className="topnav-avatar">GR</div>
      </div>
    </nav>
  )
}
