import React, { useState } from 'react'
import './Sidebar.css'

interface SidebarProps {
    activeView: string
    onNavigate: (view: string) => void
    onNewCampaign: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, onNewCampaign }) => {
    const [isCollapsed, setIsCollapsed] = useState(false)

    const navItems = [
        { id: 'home', label: 'Home', icon: '🏠' },
        { id: 'guides', label: 'Guides', icon: '📖' },
    ]

    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-content">
                <button
                    className="sidebar-new-btn"
                    onClick={onNewCampaign}
                >
                    <span className="sidebar-icon">+</span>
                    {!isCollapsed && <span className="sidebar-label">New Campaign</span>}
                </button>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            className={`sidebar-nav-item ${activeView === item.id ? 'active' : ''}`}
                            onClick={() => onNavigate(item.id)}
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            {!isCollapsed && <span className="sidebar-label">{item.label}</span>}
                        </button>
                    ))}
                </nav>
            </div>

            <button
                className="sidebar-toggle"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <span className="sidebar-icon">{isCollapsed ? '→' : '←'}</span>
            </button>
        </aside>
    )
}
