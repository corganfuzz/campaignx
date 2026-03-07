import { useState } from 'react'
import type { Blueprint } from '../types'
import './BlueprintApprovalBlock.css'

interface Props {
  blueprint: Blueprint
  onSubmit: (id: string, status: 'approved' | 'rejected', notes?: string) => Promise<void>
}

export function BlueprintApprovalBlock({ blueprint, onSubmit }: Props) {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const isPending = !blueprint.approvalStatus || blueprint.approvalStatus === 'pending_review'

  const handleApproval = async (status: 'approved' | 'rejected') => {
    setLoading(true)
    await onSubmit(blueprint.id, status, notes || undefined)
    setLoading(false)
  }

  return (
    <div className="block block-approval">
      <div className="block-header">
        <span className="block-label">🔖 Approval Status</span>
      </div>

      <div className={`approval-badge approval-badge--${blueprint.approvalStatus ?? 'pending_review'}`}>
        {blueprint.approvalStatus === 'approved' && '✅ Approved'}
        {blueprint.approvalStatus === 'rejected' && '❌ Rejected'}
        {isPending && '⏳ Pending Review'}
      </div>

      {blueprint.reviewedBy && (
        <div className="approval-reviewer-info">
          <span className="reviewer-label">Reviewed by</span>
          <span className="reviewer-value">{blueprint.reviewedBy}</span>
          {blueprint.reviewedAt && (
            <span className="reviewer-date">
              {new Date(blueprint.reviewedAt).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </span>
          )}
          {blueprint.reviewerNotes && (
            <p className="reviewer-notes">"{blueprint.reviewerNotes}"</p>
          )}
        </div>
      )}

      {isPending && (
        <div className="approval-actions">
          <textarea
            className="approval-notes-input"
            placeholder="Add review notes (optional)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            disabled={loading}
          />
          <div className="approval-buttons">
            <button
              className="btn-approve"
              onClick={() => handleApproval('approved')}
              disabled={loading}
            >
              {loading ? 'Submitting...' : '✅ Approve'}
            </button>
            <button
              className="btn-reject"
              onClick={() => handleApproval('rejected')}
              disabled={loading}
            >
              {loading ? 'Submitting...' : '❌ Reject'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}