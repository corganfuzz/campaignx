import { useState } from 'react'
import type { Blueprint } from '../types'
import { AICursor } from '../components/shared/AICursor'
import { ImageDetail } from '../components/shared/ImageDetail'
import { BlueprintApprovalBlock } from './BlueprintApprovalBlock'
import './Canvas.css'

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
    if (s === 'pass') return '✅'
    if (s === 'warn') return '⚠️'
    return '❌'
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
          <button className="canvas-back" onClick={onBack}>← Back</button>
          <div className="canvas-title-wrap">
            <span className="canvas-status-dot" />
            <h2 className="canvas-title">Campaign Ready</h2>
          </div>
          <span className="canvas-region-badge">{blueprint.region}</span>
        </div>
        <div className="canvas-header-right">
          <button className="canvas-export-btn" onClick={() => alert('Exporting all assets…')}>
            ↓ Export All
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
            >
              📦 {bp.product}
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
              <span className="block-label">✦ Creative Strategy</span>
              <button className="ai-cursor-btn" onClick={() => setAiCursorBlock('strategy')}>
                ✏️ AI ✦
              </button>
            </div>
            <p className="block-strategy-text">{blueprint.strategy}</p>
            {aiCursorBlock === 'strategy' && (
              <AICursor blockId="strategy" onClose={() => setAiCursorBlock(null)} />
            )}
          </div>

          {/* Block B/C/D: Images */}
          <div className="block block-images-wrap">
            <div className="block-header">
              <span className="block-label">🖼 Generated Assets — 3 Formats</span>
            </div>
            <div className="block-images-grid">
              {(Object.entries(blueprint.images) as [string, typeof blueprint.images[keyof typeof blueprint.images]][]).map(([ratio, img]) => (
                <div key={ratio} className="image-card">
                  <div
                    className="image-card-thumb"
                    onClick={() => setSelectedImage({ blueprint, ratio })}
                  >
                    <img src={img.url} alt={img.format} />
                    <div className="image-card-overlay">
                      <span>View Full Size →</span>
                    </div>
                    <div className="image-card-ratio">{ratio.replace('x', ':')}</div>
                  </div>
                  <div className="image-card-body">
                    <div className="image-card-format">{ratioLabels[ratio]}</div>
                    <div className="image-card-dims">{img.dimensions}</div>
                    <div className="image-card-actions">
                      <button
                        className="image-action-btn"
                        onClick={() => setAiCursorBlock(`image-${ratio}`)}
                      >
                        ✏️ AI ✦
                      </button>
                      <button
                        className="image-action-btn"
                        onClick={() => alert(`Downloading ${ratio}...`)}
                      >
                        ↓ Save
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
                <span className="block-label">💬 Ad Copy</span>
                <button className="ai-cursor-btn" onClick={() => setAiCursorBlock('copy')}>
                  ✏️ AI ✦
                </button>
              </div>
              <div className="copy-list">
                {blueprint.adCopy.map((c, i) => (
                  <div key={i} className="copy-row">
                    <span className="copy-flag">{c.flag}</span>
                    <div>
                      <div className="copy-lang">{c.lang}</div>
                      <div className="copy-text">"{c.text}"</div>
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
                <span className="block-label">🛡 Compliance Check</span>
                <button className="ai-cursor-btn" onClick={() => setAiCursorBlock('compliance')}>
                  ✏️ AI ✦
                </button>
              </div>
              <div className="compliance-list">
                {blueprint.compliance.map((item, i) => (
                  <div key={i} className={`compliance-row ${item.status}`}>
                    <span className="compliance-icon">{statusIcon(item.status)}</span>
                    <span className="compliance-label">{item.label}</span>
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
              <span className="block-label">→ Suggested Next Steps</span>
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
              <span className="block-label">📁 Output Files</span>
              <span className="output-saved-badge">✅ Saved locally</span>
            </div>

            <div className="output-folder-tree">
              <div className="folder-root">
                <span className="folder-icon">📁</span>
                <span className="folder-name">outputs / {blueprint.id} / {blueprint.product}</span>
              </div>
              {(['1x1', '9x16', '16x9'] as const).map((ratio) => {
                const img = blueprint.images[ratio]
                return (
                  <div key={ratio} className="folder-file">
                    <span className="file-icon">🖼</span>
                    <span className="file-name">{ratio}.png</span>
                    <span className="file-label">{img.format}</span>
                    <span className="file-dims">{img.dimensions}</span>
                    <a
                      className="file-download"
                      href={img.url}
                      download={`${blueprint.product}_${ratio}.png`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      ↓
                    </a>
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
          {['Brief Input', 'Brand RAG', 'Creative Strategy', 'Image Gen', 'Resize + Overlay', 'Done ✓'].map((step, i, arr) => (
            <div key={i} className="journey-step">
              <span className="journey-label">{step}</span>
              {i < arr.length - 1 && <span className="journey-arrow">→</span>}
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