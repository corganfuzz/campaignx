import logo from '../../assets/logo.svg'
import type { TopNavProps } from '../../types'
import './TopNav.css'



export const TopNav = ({ onHome }: TopNavProps) => {
  return (
    <nav className="topnav">
      <div className="topnav-left">
        <button className="topnav-logo" onClick={onHome}>
          <img src={logo} alt="Concrete Focus" className="brand-logo" />
          <span className="logo-text">Concrete Focus</span>
        </button>

        <div className="topnav-divider" />

      </div>

      <div className="topnav-right">
        <div className="topnav-avatar">GR</div>
      </div>
    </nav>
  )
}
