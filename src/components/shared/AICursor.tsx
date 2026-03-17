import { useState } from 'react'
import type { AICursorProps } from '../../types'
import { MOCK_RESPONSES } from '../../data/mockData'
import './AICursor.css'

import MagicWand from '@spectrum-icons/workflow/MagicWand'
import Clock from '@spectrum-icons/workflow/Clock'
import ArrowRight from '@spectrum-icons/workflow/ArrowRight'
import Checkmark from '@spectrum-icons/workflow/Checkmark'
import Refresh from '@spectrum-icons/workflow/Refresh'





export const AICursor = ({ blockId, onClose }: AICursorProps) => {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    const key = blockId.startsWith('image') ? 'default' : blockId
    setResponse(MOCK_RESPONSES[key] ?? MOCK_RESPONSES.default)
    setLoading(false)
  }

  return (
    <div className="ai-cursor-popover">
      <div className="ai-cursor-header">
        <span className="ai-cursor-title" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MagicWand size="XS" /> AI Cursor
        </span>
        <button className="ai-cursor-close" onClick={onClose}>✕</button>
      </div>

      {!response ? (
        <>
          <p className="ai-cursor-prompt">What would you like to change about this block?</p>
          <div className="ai-cursor-input-row">
            <input
              className="ai-cursor-input"
              placeholder="e.g. Make it more vibrant and energetic..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              autoFocus
            />
            <button
              className="ai-cursor-send"
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {loading ? <Clock size="XS" /> : <ArrowRight size="XS" />}
            </button>
          </div>
          {loading && (
            <div className="ai-cursor-loading">
              <span className="mini-dot-spin" />
              Regenerating this block...
            </div>
          )}
        </>
      ) : (
        <>
          <div className="ai-cursor-response">
            <span className="ai-response-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MagicWand size="S" />
            </span>
            <p>{response}</p>
          </div>
          <div className="ai-cursor-actions">
            <button className="ai-cursor-action-btn accept" onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Checkmark size="XS" /> Apply changes
            </button>
            <button className="ai-cursor-action-btn reject" onClick={() => setResponse(null)} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Refresh size="XS" /> Try again
            </button>
          </div>
        </>
      )}
    </div>
  )
}
