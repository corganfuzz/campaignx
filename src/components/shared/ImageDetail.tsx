import type { Blueprint } from '../../types'
import './ImageDetail.css'

interface ImageDetailProps {
  blueprint: Blueprint
  ratio: string
  onClose: () => void
  onRegenerate: () => void
}

const RATIO_LABELS: Record<string, string> = {
  '1x1': 'Instagram Feed',
  '9x16': 'TikTok / Reels',
  '16x9': 'YouTube / Facebook',
}

export const ImageDetail = ({ blueprint, ratio, onClose, onRegenerate }: ImageDetailProps) => {
  const img = blueprint.images[ratio as keyof typeof blueprint.images]
  if (!img) return null

  return (
    <div className="image-detail-overlay" onClick={onClose}>
      <div className="image-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="image-detail-header">
          <div className="image-detail-title">
            <span>{RATIO_LABELS[ratio]}</span>
            <span className="image-detail-ratio">{ratio.replace('x', ':')}</span>
          </div>
          <button className="image-detail-close" onClick={onClose}>✕</button>
        </div>

        <div className="image-detail-img-wrap">
          <img src={img.url} alt={img.format} />
          <div className="image-detail-overlay-text">
            "{blueprint.message}"
          </div>
        </div>

        <div className="image-detail-meta">
          <div className="image-meta-row">
            <span className="image-meta-key">Format</span>
            <span className="image-meta-val">{img.format}</span>
          </div>
          <div className="image-meta-row">
            <span className="image-meta-key">Dimensions</span>
            <span className="image-meta-val">{img.dimensions}</span>
          </div>
          <div className="image-meta-row">
            <span className="image-meta-key">Product</span>
            <span className="image-meta-val">{blueprint.product}</span>
          </div>
          <div className="image-meta-row">
            <span className="image-meta-key">Region</span>
            <span className="image-meta-val">{blueprint.region}</span>
          </div>
        </div>

        <div className="image-detail-actions">
          <button className="image-detail-btn regen" onClick={onRegenerate}>
            🔄 Regenerate This Format
          </button>
          <button className="image-detail-btn download" onClick={() => alert('Downloading...')}>
            ↓ Download
          </button>
        </div>
      </div>
    </div>
  )
}
