import { useState, useEffect } from 'react'
import { MOCK_PAST_CAMPAIGNS } from '../data/mockData'
import type { Campaign, BriefFormData } from '../types'
import { parseBriefText } from '../utils/yamlParser'
import { TypeAnimation } from 'react-type-animation'
import './Home.css'

import MagicWand from '@spectrum-icons/workflow/MagicWand'
import Settings from '@spectrum-icons/workflow/Settings'
import ArrowRight from '@spectrum-icons/workflow/ArrowRight'
import Box from '@spectrum-icons/workflow/Box'
import Cancel from '@spectrum-icons/workflow/Cancel'
import AutoSelectSubject from '@react-spectrum/s2/icons/AutoSelectSubject';
import Keyboard from '@react-spectrum/s2/icons/Keyboard';

interface HomeProps {
  onStartCampaign: (prefill?: string) => void
  onOpenCampaign: (campaign: Campaign) => void
  pastCampaigns: Campaign[]
  isLoadingHistory: boolean
  fetchRecentCampaigns: () => Promise<void>
  onSubmitBrief: (data: BriefFormData) => Promise<void>
}

const TEMPLATES = [
  {
    title: 'ErgoPro Launch',
    prompt: 'Create a campaign for the ErgoPro Adjustable Stand Desk targeting remote workers in the USA. Message: "Upgrade your home office with our new smart standing desk."',
    payload: `products:
  - ErgoPro Adjustable Stand Desk
region: usa
audience: Remote workers and developers
message: Upgrade your home office with our new smart standing desk.`
  },
  {
    title: 'Dove Brazil',
    prompt: 'Build a social campaign for Dove Shampoo and Conditioner in Brazil, targeting women 25-40 with the message: "Feel fresh every day with natural ingredients."',
    payload: `products:
  - Dove Shampoo
  - Dove Conditioner
region: brazil
audience: Women 25-40
message: Feel fresh every day with natural ingredients.`
  },
  {
    title: 'Sony Audio Japan',
    prompt: 'I need a campaign for the WH-1000XM6 Headphones in Japan. Target audiophiles and commuters with the message: "Experience silence like never before."',
    payload: `products:
  - WH-1000XM6 Headphones
region: japan
audience: Audiophiles and commuters
message: Experience silence like never before.`
  },
  {
    title: 'Winter Gear Germany',
    prompt: 'Create a campaign for the Summit Series Parka and Thermal Beanie in Germany. Target winter sports enthusiasts with the message: "Conquer the cold this season."',
    payload: `products:
  - Summit Series Parka
  - Thermal Beanie
region: germany
audience: Winter sports enthusiasts
message: Conquer the cold this season.`
  }
]

export const Home = ({
  onStartCampaign,
  onOpenCampaign,
  pastCampaigns,
  isLoadingHistory,
  fetchRecentCampaigns,
  onSubmitBrief
}: HomeProps) => {
  const [inputValue, setInputValue] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [targetPrompt, setTargetPrompt] = useState('')

  useEffect(() => {
    fetchRecentCampaigns()
  }, [fetchRecentCampaigns])

  const handleSubmit = () => {
    if (inputValue.trim()) {
      const matched = TEMPLATES.find(t => t.prompt === inputValue.trim())
      if (matched) {
        const parsed = parseBriefText(matched.payload)
        if (parsed.products && parsed.products.length >= 1 && parsed.message) {
          let prods = Array.isArray(parsed.products) ? parsed.products : [parsed.products]
          onSubmitBrief({
            products: prods.map(p => String(p)),
            region: parsed.region || 'usa',
            audience: parsed.audience || 'General',
            message: parsed.message,
            language: parsed.language || 'en',
          })
          return
        }
      }

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
        <div className="home-hero-badge">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MagicWand size="XS" /> AI Creative Studio
          </span>
        </div>
        <h1 className="home-hero-title">What campaign are we building today?</h1>
        <p className="home-hero-sub">
          Describe your product and market — the AI will generate brand-aligned creative assets
          across all social formats.
        </p>

        <button
          className="home-templates-btn"
          onClick={() => setIsDialogOpen(true)}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Keyboard />Generate Ideas</span>
        </button>

        <div className="home-input-container">
          <div className="home-prompt-label">Prompt</div>
          {isTyping ? (
            <div className="home-input typing-container">
              <TypeAnimation
                cursor={true}
                sequence={[
                  targetPrompt,
                  () => {
                    setInputValue(targetPrompt)
                    setIsTyping(false)
                  }
                ]}
                speed={70}
                style={{ whiteSpace: 'pre-wrap', display: 'block' }}
              />
            </div>
          ) : (
            <textarea
              className="home-input"
              placeholder="e.g. Dove Shampoo in Brazil for women 25-40"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
            />
          )}
          <div className="home-input-controls">
            <div className="home-controls-left">
              <button className="control-btn pilled">
                Image
              </button>
              <button className="control-btn pilled" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="btn-icon"><MagicWand size="XS" /></span> Amazon Nova Pro
              </button>
              <button className="control-btn more" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="btn-icon"><Settings size="XS" /></span> More
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

        {/* <div className="home-chips">
          <button className="home-chip" onClick={() => onStartCampaign()}>
            <PasteList size="XS" /> Fill brief manually
          </button>
          <button className="home-chip" onClick={() => setInputValue('Dove Shampoo in Brazil for women 25-40')}>
            <MagicWand size="XS" /> Try an example
          </button>
        </div> */}
      </div>

      {/* Recent Campaigns */}
      <div className="home-recent">
        <div className="home-section-header">
          <h2 className="home-section-title">Recent Campaigns</h2>
          <span className="home-section-count">
            {isLoadingHistory ? 'Loading...' : `${pastCampaigns.length} campaigns`}
          </span>
        </div>

        <div className="home-cards-grid">
          {/* New Campaign Card (First) */}
          <button className="campaign-card new-card" onClick={() => onStartCampaign()}>
            <div className="new-card-inner">
              <div className="new-card-icon">+</div>
              <div className="new-card-label">New Campaign</div>
            </div>
          </button>

          {isLoadingHistory ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="campaign-card skeleton">
                <div className="campaign-card-thumb skeleton-box" />
                <div className="campaign-card-body">
                  <div className="skeleton-line" />
                  <div className="skeleton-line short" />
                </div>
              </div>
            ))
          ) : (
            (pastCampaigns.length > 0 ? pastCampaigns : MOCK_PAST_CAMPAIGNS).slice(0, 3).map((campaign) => (
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
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Open Canvas <ArrowRight size="XS" />
                    </span>
                  </div>
                </div>
                <div className="campaign-card-body">
                  <div className="campaign-card-product" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Box size="XS" /> {campaign.product}
                  </div>
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
            ))
          )}
        </div>
      </div>

      {/* Templates Dialog */}
      {isDialogOpen && (
        <div className="template-dialog-overlay" onClick={() => setIsDialogOpen(false)}>
          <div className="template-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="template-dialog-header">
              <h3>Ideas for you</h3>
              <button
                className="template-dialog-close"
                onClick={() => setIsDialogOpen(false)}
              >
                <Cancel size="S" />
              </button>
            </div>
            <p className="template-dialog-sub">Choose a pre-configured YAML brief to directly generate a campaign.</p>

            <div className="template-grid">
              {TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  className="template-card"
                  onClick={() => {
                    setTargetPrompt(tmpl.prompt)
                    setInputValue('')
                    setIsTyping(true)
                    setIsDialogOpen(false)
                  }}
                >
                  <div className="template-card-header-icon">
                    <AutoSelectSubject />
                  </div>
                  <div className="template-card-title">{tmpl.title}</div>
                  <div className="template-card-content">"{tmpl.prompt}"</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
