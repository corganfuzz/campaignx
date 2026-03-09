import React, { useState } from 'react'
import './Sidebar.css'

import Home from '@spectrum-icons/workflow/Home'
import Book from '@spectrum-icons/workflow/Book'
import ArrowRight from '@spectrum-icons/workflow/ArrowRight'
import ArrowLeft from '@spectrum-icons/workflow/ArrowLeft'
import Add from '@spectrum-icons/workflow/Add'

interface SidebarProps {
    activeView: string
    onNavigate: (view: string) => void
    onNewCampaign: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, onNewCampaign }) => {
    const [isCollapsed, setIsCollapsed] = useState(false)

    const navItems = [
        { id: 'home', label: 'Home', icon: <Home size="XS" /> },
        { id: 'guides', label: 'Guides', icon: <Book size="XS" /> },
    ]

    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-content">
                <button
                    className="sidebar-new-btn"
                    onClick={onNewCampaign}
                >
                    <span className="sidebar-icon"><Add size="XS" /></span>
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
                <span className="sidebar-icon">{isCollapsed ? <ArrowRight size="XS" /> : <ArrowLeft size="XS" />}</span>
            </button>
        </aside>
    )
}
