import { useState } from 'react'
import type { Blueprint } from '../types'
import { AICursor } from '../components/shared/AICursor'
import { ImageDetail } from '../components/shared/ImageDetail'
import { BlueprintApprovalBlock } from './BlueprintApprovalBlock'
import './Canvas.css'

import CheckmarkCircle from '@spectrum-icons/workflow/CheckmarkCircle'
import Alert from '@spectrum-icons/workflow/Alert'
import Cancel from '@spectrum-icons/workflow/Cancel'
import Download from '@spectrum-icons/workflow/Download'
import Box from '@spectrum-icons/workflow/Box'
import MagicWand from '@spectrum-icons/workflow/MagicWand'
import Image from '@spectrum-icons/workflow/Image'
import Edit from '@spectrum-icons/workflow/Edit'
import Chat from '@spectrum-icons/workflow/Chat'
import Shield from '@spectrum-icons/workflow/Shield'
import ArrowRight from '@spectrum-icons/workflow/ArrowRight'
import ArrowLeft from '@spectrum-icons/workflow/ArrowLeft'
import Folder from '@spectrum-icons/workflow/Folder'
import Camera from '@spectrum-icons/workflow/Camera'
import Globe from '@spectrum-icons/workflow/Globe'
import { downloadImageFromUrl } from '../utils/download'
import ReactMarkdown from 'react-markdown'

interface CanvasProps {
  blueprints: Blueprint[]
  onNewCampaign: () => void
  onBack: () => void
  submitApproval: (id: string, status: 'approved' | 'rejected', notes?: string) => Promise<void>
}

export const Canvas = ({ blueprints, onNewCampaign, onBack, submitApproval }: CanvasProps) => {
  const [activeTab, setActiveTab] = useState(0)
  const [aiCursorBlock, setAiCursorBlock] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<{ blueprint: Blueprint; ratio: string } | null>(null)

  const blueprint = blueprints[activeTab]
  if (!blueprint) return null

  const statusIcon = (s: string) => {
    if (s === 'pass') return <CheckmarkCircle size="XS" color="positive" />
    if (s === 'warn') return <Alert size="XS" color="notice" />
    return <Cancel size="XS" color="negative" />
  }

  const ratioLabels: Record<string, string> = {
    '1x1': 'Instagram',
    '9x16': 'TikTok / Reels',
    '16x9': 'YouTube / Facebook',
  }

  return (
    <div className="canvas-page">
      {/* Canvas Header */}
      <div className="canvas-header">
        <div className="canvas-header-left">
          <button className="canvas-back" onClick={onBack}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowLeft size="XS" /> Back
            </span>
          </button>
          <div className="canvas-title-wrap">
            <span className="canvas-status-dot" />
            <h2 className="canvas-title">Campaign Ready</h2>
          </div>
          <span className="canvas-region-badge">{blueprint.region}</span>
        </div>
        <div className="canvas-header-right">
          <button className="canvas-export-btn" onClick={() => alert('Exporting all assets…')}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Download size="XS" /> Export All
            </span>
          </button>
          <button className="canvas-new-btn" onClick={onNewCampaign}>
            + New Campaign
          </button>
        </div>
      </div>

      {/* Product Tabs */}
      {blueprints.length > 1 && (
        <div className="canvas-tabs">
          {blueprints.map((bp, i) => (
            <button
              key={bp.id}
              className={`canvas-tab ${activeTab === i ? 'active' : ''}`}
              onClick={() => setActiveTab(i)}
              data-index={i}
              style={{ '--tab-color': `var(--product-color-${i % 6})` } as any}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Box size="XS" /> {bp.product}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Blueprint Container */}
      <div className="canvas-body">
        <div className="blueprint">

          {/* Block A: Creative Strategy */}
          <div className="block block-strategy">
            <div className="block-header">
              <span className="block-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MagicWand size="XS" /> Creative Strategy
              </span>
              <button className="ai-cursor-btn" onClick={() => setAiCursorBlock('strategy')}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Edit size="XS" /> AI <MagicWand size="XS" />
                </span>
              </button>
            </div>
            <div className="block-strategy-text markdown-body">
              <ReactMarkdown>{blueprint.strategy}</ReactMarkdown>
            </div>
            {aiCursorBlock === 'strategy' && (
              <AICursor blockId="strategy" onClose={() => setAiCursorBlock(null)} />
            )}
          </div>

          {/* Block B/C/D: Images */}
          <div className="block block-images-wrap">
            <div className="block-header">
              <span className="block-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Image size="XS" /> Generated Assets — 3 Formats
              </span>
            </div>
            <div className="block-images-grid">
              {(Object.entries(blueprint.images) as [string, typeof blueprint.images[keyof typeof blueprint.images]][]).map(([ratio, img]) => (
                <div key={ratio} className="image-card">
                  <div
                    className="image-card-thumb"
                    onClick={() => setSelectedImage({ blueprint, ratio })}
                  >
                    <img src={img.url} alt={img.format} crossOrigin="anonymous" />
                    <div className="image-card-overlay">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        View Full Size <ArrowRight size="XS" />
                      </span>
                    </div>
                    <div className="image-card-ratio">{ratio.replace('x', ':')}</div>
                    {(img as any).generated !== undefined && (
                      <div className={`image-card-gen-badge ${(img as any).generated ? 'ai' : 'ref'}`}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {(img as any).generated ? <><MagicWand size="XS" /> AI Generated</> : <><Camera size="XS" /> Reference</>}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="image-card-body">
                    <div className="image-card-format">{ratioLabels[ratio]}</div>
                    <div className="image-card-dims">{img.dimensions}</div>
                    <div className="image-card-actions">
                      <button
                        className="image-action-btn"
                        onClick={() => setAiCursorBlock(`image-${ratio}`)}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                          <Edit size="XS" /> AI <MagicWand size="XS" />
                        </span>
                      </button>
                      <button
                        className="image-action-btn"
                        onClick={() => downloadImageFromUrl(img.url, `${blueprint.product}_${ratio}.png`)}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                          <Download size="XS" /> Save
                        </span>
                      </button>
                    </div>
                  </div>
                  {aiCursorBlock === `image-${ratio}` && (
                    <AICursor blockId={`image-${ratio}`} onClose={() => setAiCursorBlock(null)} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Block E & F: Ad Copy + Compliance */}
          <div className="block-row">
            {/* Block E: Ad Copy */}
            <div className="block block-copy">
              <div className="block-header">
                <span className="block-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Chat size="XS" /> Ad Copy
                </span>
                <button className="ai-cursor-btn" onClick={() => setAiCursorBlock('copy')}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Edit size="XS" /> AI <MagicWand size="XS" />
                  </span>
                </button>
              </div>
              <div className="copy-list">
                {blueprint.adCopy.map((c, i) => (
                  <div key={i} className="copy-row">
                    <span className="copy-flag">
                      {c.flag === 'Global' ? <Globe size="XS" /> : c.flag}
                    </span>
                    <div>
                      <div className="copy-lang">{c.lang}</div>
                      <div className="copy-text markdown-body">
                        <ReactMarkdown>{`"${c.text}"`}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {aiCursorBlock === 'copy' && (
                <AICursor blockId="copy" onClose={() => setAiCursorBlock(null)} />
              )}
            </div>

            {/* Block F: Compliance */}
            <div className="block block-compliance">
              <div className="block-header">
                <span className="block-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Shield size="XS" /> Compliance Check
                </span>
                <button className="ai-cursor-btn" onClick={() => setAiCursorBlock('compliance')}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Edit size="XS" /> AI <MagicWand size="XS" />
                  </span>
                </button>
              </div>
              <div className="compliance-list">
                {blueprint.compliance.map((item, i) => (
                  <div key={i} className={`compliance-row ${item.status}`}>
                    <span className="compliance-icon">{statusIcon(item.status)}</span>
                    <div className="compliance-label-wrap">
                      <span className="compliance-label">{item.label}</span>
                      {item.reason && (
                        <span className="compliance-reason-content">{item.reason}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {aiCursorBlock === 'compliance' && (
                <AICursor blockId="compliance" onClose={() => setAiCursorBlock(null)} />
              )}
            </div>
          </div>

          {/* Block G: Next Steps */}
          <div className="block block-next-steps">
            <div className="block-header">
              <span className="block-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ArrowRight size="XS" /> Suggested Next Steps
              </span>
            </div>
            <div className="next-steps-grid">
              {blueprint.nextSteps.map((step) => (
                <button
                  key={step.id}
                  className="next-step-btn"
                  onClick={() =>
                    step.action === 'new-product' || step.action === 'new-region'
                      ? onNewCampaign()
                      : alert(step.label)
                  }
                >
                  {step.label}
                </button>
              ))}
            </div>
          </div>

          {/* Block H: Output Files + Generation Report */}
          <div className="block block-output">
            <div className="block-header">
              <span className="block-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Folder size="XS" /> Output Files
              </span>
              <span className="output-saved-badge" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckmarkCircle size="XS" /> Saved locally
              </span>
            </div>

            <div className="output-folder-tree">
              <div className="folder-root">
                <span className="folder-icon"><Folder size="XS" /></span>
                <span className="folder-name">outputs / {blueprint.id} / {blueprint.product}</span>
              </div>
              {(['1x1', '9x16', '16x9'] as const).map((ratio) => {
                const img = blueprint.images[ratio]
                return (
                  <div key={ratio} className="folder-file">
                    <span className="file-icon"><Image size="XS" /></span>
                    <span className="file-name">{ratio}.png</span>
                    <span className="file-label">{img.format}</span>
                    <span className="file-dims">{img.dimensions}</span>
                    <button
                      className="file-download"
                      onClick={(e) => {
                        e.preventDefault();
                        downloadImageFromUrl(img.url, `${blueprint.product}_${ratio}.png`);
                      }}
                      title="Download image"
                    >
                      <Download size="XS" />
                    </button>
                  </div>
                )
              })}
            </div>

            {blueprint.generationReport && (
              <div className="generation-report">
                <h4>Generation Report</h4>
                <div className="report-grid">
                  <div className="report-item">
                    <span className="report-label">Estimated Cost</span>
                    <span className="report-value">${blueprint.generationReport.cost_usd.toFixed(2)}</span>
                  </div>
                  <div className="report-item">
                    <span className="report-label">Image Calls</span>
                    <span className="report-value">{blueprint.generationReport.nova_canvas_calls}</span>
                  </div>
                  <div className="report-item">
                    <span className="report-label">Input Tokens</span>
                    <span className="report-value">{blueprint.generationReport.token_counts.input.toLocaleString()}</span>
                  </div>
                  <div className="report-item">
                    <span className="report-label">Output Tokens</span>
                    <span className="report-value">{blueprint.generationReport.token_counts.output.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Block I: Approval Status */}
          <BlueprintApprovalBlock blueprint={blueprint} onSubmit={submitApproval} />

        </div>

        {/* Journey Line */}
        <div className="journey-line">
          {['Brief Input', 'Brand RAG', 'Creative Strategy', 'Image Gen', 'Resize + Overlay', 'Done'].map((step, i, arr) => (
            <div key={i} className="journey-step">
              <span className="journey-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {step}
                {i === arr.length - 1 && <CheckmarkCircle size="S" color="positive" />}
              </span>
              {i < arr.length - 1 && <span className="journey-arrow"><ArrowRight size="S" /></span>}
            </div>
          ))}
        </div>
      </div>

      {/* Image Detail Modal */}
      {selectedImage && (
        <ImageDetail
          blueprint={selectedImage.blueprint}
          ratio={selectedImage.ratio}
          onClose={() => setSelectedImage(null)}
          onRegenerate={() => { setSelectedImage(null); alert('Regenerating...') }}
        />
      )}
    </div>
  )
}