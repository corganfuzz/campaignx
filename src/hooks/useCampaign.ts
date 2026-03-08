import { useState, useCallback } from 'react'
import type { Blueprint, BriefFormData, PipelineStep } from '../types'
import { PIPELINE_STEPS } from '../data/mockData'

export type AppView = 'home' | 'form' | 'loading' | 'canvas' | 'error'

const API_BASE = import.meta.env.VITE_API_BASE_URL as string
const API_KEY = import.meta.env.VITE_API_KEY as string

const apiHeaders = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY,
}

// Map the raw DynamoDB / Lambda response shape → frontend Blueprint type
function mapApiBlueprint(raw: Record<string, any>, campaignId: string): Blueprint {
  const images = raw.images ?? {}
  return {
    id: `${campaignId}#${raw.product_name}`,
    product: raw.product_name ?? 'Unknown Product',
    region: raw.region ?? '',
    audience: raw.audience ?? '',
    message: raw.message ?? '',
    strategy: (raw.strategy ?? '').trim(),
    images: {
      '1x1': images['1x1'] ?? { url: '', format: 'Instagram Feed', dimensions: '1080 × 1080px', ratio: '1x1' },
      '9x16': images['9x16'] ?? { url: '', format: 'TikTok / Reels', dimensions: '1080 × 1920px', ratio: '9x16' },
      '16x9': images['16x9'] ?? { url: '', format: 'YouTube / Facebook', dimensions: '1920 × 1080px', ratio: '16x9' },
    },
    adCopy: (raw.adCopy ?? []).map((c: any) => ({
      lang: c.lang ?? 'English',
      flag: '🌐',
      text: (c.text ?? '').trim(),
    })),
    compliance: [],
    nextSteps: [],
    createdAt: raw.created_at ?? new Date().toISOString(),
    approvalStatus: raw.approval_status ?? 'pending_review',
    reviewedBy: raw.reviewed_by,
    reviewerNotes: raw.reviewer_notes,
    reviewedAt: raw.reviewed_at,
  }
}

// Poll GET /campaigns/{id} until blueprints arrive or timeout (~2 min)
async function pollCampaign(campaignId: string): Promise<Blueprint[]> {
  const maxAttempts = 24
  const delayMs = 5000

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise((r) => setTimeout(r, delayMs))

    const res = await fetch(`${API_BASE}/campaigns/${campaignId}`, {
      headers: apiHeaders,
    })

    if (!res.ok) continue

    const data = await res.json()
    const items: any[] = data.blueprints ?? []

    if (items.length > 0) {
      return items.map((raw) => mapApiBlueprint(raw, campaignId))
    }
  }

  throw new Error('Campaign generation timed out. Please try again.')
}

export const useCampaign = () => {
  const [view, setView] = useState<AppView>('home')
  const [briefData, setBriefData] = useState<BriefFormData | null>(null)
  const [blueprints, setBlueprints] = useState<Blueprint[]>([])
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>(PIPELINE_STEPS)
  const [progress, setProgress] = useState(0)
  const [selectedImageDetail, setSelectedImageDetail] = useState<{ blueprint: Blueprint; ratio: string } | null>(null)
  const [failureReason, setFailureReason] = useState<string | null>(null)

  const startNewCampaign = useCallback((prefill?: string) => {
    setBriefData(
      prefill
        ? {
          products: ['Summit Trek Backpack', 'Ultra-Light Trekking Poles'],
          region: 'usa',
          audience: 'Hikers',
          message: prefill,
          language: 'en',
        }
        : null
    )
    setView('form')
  }, [])

  const submitBrief = useCallback(async (data: BriefFormData) => {
    setBriefData(data)
    setBlueprints([])
    setPipelineSteps(PIPELINE_STEPS.map((s) => ({ ...s, status: 'pending' as const })))
    setProgress(0)
    setFailureReason(null)
    setView('loading')

    try {
      // ── Step 1: Submit the brief → API Gateway → SQS → Lambda → Bedrock
      const submitRes = await fetch(`${API_BASE}/brief`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify({
          products: data.products,
          region: data.region,
          audience: data.audience,
          message: data.message,
          language: data.language,
        }),
      })

      if (!submitRes.ok) {
        const err = await submitRes.json().catch(() => ({}))
        throw new Error((err as any).message ?? `API error: ${submitRes.status}`)
      }

      const { campaignId } = await submitRes.json()

      // ── Step 2: Animate pipeline steps while Bedrock is generating
      const totalSteps = PIPELINE_STEPS.length
      for (let i = 0; i < totalSteps; i++) {
        // Spread animations across the expected ~30s generation window
        await new Promise((r) => setTimeout(r, (25000 / totalSteps) * (0.8 + Math.random() * 0.4)))
        setPipelineSteps((prev) =>
          prev.map((s, idx) => ({
            ...s,
            status: idx < i ? 'done' : idx === i ? 'running' : 'pending',
          }))
        )
        setProgress(Math.round(((i + 1) / totalSteps) * 90))
      }

      // ── Step 3: Poll DynamoDB via GET /campaigns/{id} until blueprints appear
      const newBlueprints = await pollCampaign(campaignId)

      setPipelineSteps((prev) => prev.map((s) => ({ ...s, status: 'done' as const })))
      setProgress(100)
      await new Promise((r) => setTimeout(r, 500))

      setBlueprints(newBlueprints)
      setView('canvas')
    } catch (err: any) {
      setFailureReason(err.message || 'An unexpected error occurred during generation.')
      setView('error')
    }
  }, [])

  const openPastCampaign = useCallback((blueprintList: Blueprint[]) => {
    setBlueprints(blueprintList)
    setView('canvas')
  }, [])

  const goHome = useCallback(() => setView('home'), [])
  const goToForm = useCallback(() => setView('form'), [])

  const submitApproval = useCallback(
    async (blueprintId: string, status: 'approved' | 'rejected', notes?: string) => {
      // blueprintId format: `{campaignId}#{productName}`
      const [campaignId, ...productParts] = blueprintId.split('#')
      const productName = productParts.join('#')

      await fetch(`${API_BASE}/campaigns/${campaignId}/approval`, {
        method: 'PATCH',
        headers: apiHeaders,
        body: JSON.stringify({
          product_name: productName,
          approval_status: status,
          reviewer_notes: notes ?? '',
        }),
      })

      // Optimistically update local state immediately
      setBlueprints((prev) =>
        prev.map((bp) =>
          bp.id === blueprintId
            ? {
              ...bp,
              approvalStatus: status,
              reviewedBy: 'reviewer@company.com',
              reviewerNotes: notes,
              reviewedAt: new Date().toISOString(),
            }
            : bp
        )
      )
    },
    []
  )

  return {
    view,
    briefData,
    blueprints,
    pipelineSteps,
    progress,
    selectedImageDetail,
    failureReason,
    setSelectedImageDetail,
    setFailureReason,
    startNewCampaign,
    submitBrief,
    openPastCampaign,
    goHome,
    goToForm,
    submitApproval,
  }
}