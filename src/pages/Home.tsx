import { useState } from 'react'
import { MOCK_PAST_CAMPAIGNS } from '../data/mockData'
import type { Campaign } from '../types'
import './Home.css'

interface HomeProps {
  onStartCampaign: (prefill?: string) => void
  onOpenCampaign: (campaign: Campaign) => void
}

export const Home = ({ onStartCampaign, onOpenCampaign }: HomeProps) => {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onStartCampaign(inputValue.trim())
    } else {
      onStartCampaign()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
  }

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="home">
      {/* Hero Input */}
      <div className="home-hero">
        <div className="home-hero-badge">✦ AI Creative Studio</div>
        <h1 className="home-hero-title">What campaign are we building today?</h1>
        <p className="home-hero-sub">
          Describe your product and market — the AI will generate brand-aligned creative assets
          across all social formats.
        </p>

        <div className="home-input-row">
          <input
            className="home-input"
            placeholder="e.g. Dove Shampoo in Brazil for women 25-40..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="home-input-btn" onClick={handleSubmit}>
            Generate →
          </button>
        </div>

        <div className="home-chips">
          <button className="home-chip" onClick={() => onStartCampaign()}>
            📋 Fill brief manually
          </button>
          <button className="home-chip" onClick={() => setInputValue('Dove Shampoo in Brazil for women 25-40')}>
            ✦ Try an example
          </button>
        </div>
      </div>

      {/* Recent Campaigns */}
      <div className="home-recent">
        <div className="home-section-header">
          <h2 className="home-section-title">Recent Campaigns</h2>
          <span className="home-section-count">{MOCK_PAST_CAMPAIGNS.length} campaigns</span>
        </div>

        <div className="home-cards-grid">
          {MOCK_PAST_CAMPAIGNS.map((campaign) => (
            <button
              key={campaign.id}
              className="campaign-card"
              onClick={() => onOpenCampaign(campaign)}
            >
              <div className="campaign-card-thumb">
                <img
                  src={`https://picsum.photos/seed/${campaign.id}/400/200`}
                  alt={campaign.product}
                />
                <div className="campaign-card-overlay">
                  <span>Open Canvas →</span>
                </div>
              </div>
              <div className="campaign-card-body">
                <div className="campaign-card-product">📦 {campaign.product}</div>
                <div className="campaign-card-meta">
                  <span className="campaign-card-region">{campaign.region}</span>
                  <span className="campaign-card-dot">·</span>
                  <span className="campaign-card-date">{formatDate(campaign.createdAt)}</span>
                </div>
                <div className="campaign-card-message">"{campaign.message}"</div>
                <div className="campaign-card-assets">
                  <span className="asset-badge">1:1</span>
                  <span className="asset-badge">9:16</span>
                  <span className="asset-badge">16:9</span>
                </div>
              </div>
            </button>
          ))}

          {/* New Campaign Card */}
          <button className="campaign-card new-card" onClick={() => onStartCampaign()}>
            <div className="new-card-inner">
              <div className="new-card-icon">+</div>
              <div className="new-card-label">New Campaign</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
