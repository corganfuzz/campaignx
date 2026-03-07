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
      <div className="home-background-gradient" />
      {/* Hero Input */}
      <div className="home-hero">
        <div className="home-hero-badge">✦ AI Creative Studio</div>
        <h1 className="home-hero-title">What campaign are we building today?</h1>
        <p className="home-hero-sub">
          Describe your product and market — the AI will generate brand-aligned creative assets
          across all social formats.
        </p>

        <div className="home-input-container">
          <div className="home-prompt-label">Prompt</div>
          <textarea
            className="home-input"
            placeholder="e.g. Dove Shampoo in Brazil for women 25-40"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
          />
          <div className="home-input-controls">
            <div className="home-controls-left">
              <button className="control-btn pilled">
                Image
              </button>
              <button className="control-btn pilled">
                <span className="btn-icon">🤖</span> Gemini 2.0 Flash
              </button>
              <button className="control-btn more">
                <span className="btn-icon">⚙️</span> More
              </button>
            </div>
            <button className="home-generate-btn" onClick={handleSubmit}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
              </svg>
              <span>Generate</span>
            </button>
          </div>
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
