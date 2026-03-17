import { useState } from 'react'
import { ToastQueue } from '@react-spectrum/s2'
import type { BlueprintApprovalBlockProps } from '../types'
import './BlueprintApprovalBlock.css'

import CheckmarkCircle from '@spectrum-icons/workflow/CheckmarkCircle'
import Cancel from '@spectrum-icons/workflow/Cancel'
import Clock from '@spectrum-icons/workflow/Clock'
import Bookmark from '@spectrum-icons/workflow/Bookmark'

export function BlueprintApprovalBlock({ blueprint, onSubmit }: BlueprintApprovalBlockProps) {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const isPending = !blueprint.approvalStatus || blueprint.approvalStatus === 'pending_review'

  const handleApproval = async (status: 'approved' | 'rejected') => {
    setLoading(true)
    try {
      await onSubmit(blueprint.id, status, notes || undefined)
      
      if (status === 'approved') {
        ToastQueue.positive('Your campaign has been approved! Sending Email notification.', {
          timeout: 5000
        })
      } else {
        ToastQueue.negative('Campaign rejected!', {
          timeout: 5000
        })
      }
    } catch (error) {
      ToastQueue.negative('Failed to update status. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="block block-approval">
      <div className="block-header">
        <span className="block-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Bookmark size="XS" /> Approval Status
        </span>
      </div>

      <div className={`approval-badge approval-badge--${blueprint.approvalStatus ?? 'pending_review'}`}>
        {blueprint.approvalStatus === 'approved' && <><CheckmarkCircle size="XS" /> Approved</>}
        {blueprint.approvalStatus === 'rejected' && <><Cancel size="XS" /> Rejected</>}
        {isPending && <><Clock size="XS" /> Pending Review</>}
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
              style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}
            >
              {loading ? 'Submitting...' : <><CheckmarkCircle size="XS" /> Approve</>}
            </button>
            <button
              className="btn-reject"
              onClick={() => handleApproval('rejected')}
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}
            >
              {loading ? 'Submitting...' : <><Cancel size="XS" /> Reject</>}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}