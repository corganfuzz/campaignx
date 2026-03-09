import { useState, useCallback } from 'react'
import type { Blueprint, BriefFormData, PipelineStep, Campaign } from '../types'
import { PIPELINE_STEPS, MOCK_PAST_CAMPAIGNS, mockGenerateCampaign } from '../data/mockData'

export type AppView = 'home' | 'form' | 'loading' | 'canvas' | 'error'

const API_BASE = import.meta.env.VITE_API_BASE_URL as string
const API_KEY = import.meta.env.VITE_API_KEY as string

const apiHeaders = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY,
}

function mapApiBlueprint(raw: Record<string, any>, campaignId: string): Blueprint {
  console.log('[CampaignX] Mapping blueprint:', raw.product_name, '| raw.images:', raw.images)
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
      flag: 'Global',
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
    console.log(`[CampaignX] Poll attempt ${attempt + 1} response:`, data)
    const items: any[] = data.blueprints ?? []

    if (items.length > 0) {
      console.log('[CampaignX] Raw blueprints from API:', JSON.stringify(items, null, 2))
      const mapped = items.map((raw) => mapApiBlueprint(raw, campaignId))
      console.log('[CampaignX] Mapped blueprints (images):', mapped.map(b => ({ product: b.product, images: b.images })))
      return mapped
    }
  }

  throw new Error('Campaign generation timed out. Please try again.')
}

export const useCampaign = () => {
  const [view, setView] = useState<AppView>('home')
  const [briefData, setBriefData] = useState<BriefFormData | null>(null)
  const [blueprints, setBlueprints] = useState<Blueprint[]>([])
  const [pastCampaigns, setPastCampaigns] = useState<Campaign[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>(PIPELINE_STEPS)
  const [progress, setProgress] = useState(0)
  const [selectedImageDetail, setSelectedImageDetail] = useState<{ blueprint: Blueprint; ratio: string } | null>(null)
  const [failureReason, setFailureReason] = useState<string | null>(null)

  const fetchRecentCampaigns = useCallback(async () => {
    if (import.meta.env.VITE_USE_MOCKS) {
      setIsLoadingHistory(true)
      setTimeout(() => {
        setPastCampaigns(MOCK_PAST_CAMPAIGNS)
        setIsLoadingHistory(false)
      }, 500)
      return
    }

    if (!API_BASE || API_BASE === 'undefined') {
      console.warn('[CampaignX] API_BASE is not defined, skipping history fetch.')
      return
    }
    setIsLoadingHistory(true)
    try {
      const res = await fetch(`${API_BASE}/campaigns`, { headers: apiHeaders })
      if (!res.ok) throw new Error(`History fetch failed: ${res.status}`)
      const data = await res.json()
      console.log('[CampaignX] Raw /campaigns response:', data)

      const rawItems: any[] = Array.isArray(data) ? data : (data.campaigns || data.Items || [])

      const grouped: Record<string, any[]> = {}
      for (const item of rawItems) {
        const cid = item.campaign_id
        if (!cid) continue
        if (!grouped[cid]) grouped[cid] = []
        grouped[cid].push(item)
      }

      const campaigns: Campaign[] = Object.entries(grouped)
        .map(([cid, items]) => {
          const first = items[0]
          return {
            id: cid,
            product: (first.products as string[] | undefined)?.join(', ') || first.product_name || 'Campaign',
            region: first.region || '',
            audience: first.audience || '',
            message: first.message || '',
            language: first.language || 'en',
            createdAt: first.created_at || new Date().toISOString(),
            blueprints: items.map((bp) => mapApiBlueprint(bp, cid)),
          }
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      console.log('[CampaignX] Parsed campaigns:', campaigns.length)
      setPastCampaigns(campaigns)
    } catch (err) {
      console.error('[CampaignX] Failed to fetch history:', err)
    } finally {
      setIsLoadingHistory(false)
    }
  }, [])

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
    setFailureReason(null)
  }, [])

  const submitBrief = useCallback(async (data: BriefFormData) => {
    setBriefData(data)
    setBlueprints([])
    setPipelineSteps(PIPELINE_STEPS.map((s) => ({ ...s, status: 'pending' as const })))
    setProgress(0)
    setFailureReason(null)
    setView('loading')

    try {
      if (import.meta.env.VITE_USE_MOCKS) {
        const newBlueprints: Blueprint[] = []
        for (let b = 0; b < data.products.length; b++) {
          const bp = await mockGenerateCampaign(b, (stepIndex) => {
            setPipelineSteps((prev) =>
              prev.map((s, idx) => ({
                ...s,
                status: idx < stepIndex ? 'done' : idx === stepIndex ? 'running' : 'pending',
              }))
            )
            setProgress(Math.round(((stepIndex + 1) / PIPELINE_STEPS.length) * 90))
          })
          newBlueprints.push({ ...bp, product: data.products[b] })
        }

        setPipelineSteps((prev) => prev.map((s) => ({ ...s, status: 'done' as const })))
        setProgress(100)
        await new Promise((r) => setTimeout(r, 500))

        setBlueprints(newBlueprints)
        setView('canvas')
        return
      }

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

      const totalSteps = PIPELINE_STEPS.length
      for (let i = 0; i < totalSteps; i++) {
        await new Promise((r) => setTimeout(r, (25000 / totalSteps) * (0.8 + Math.random() * 0.4)))
        setPipelineSteps((prev) =>
          prev.map((s, idx) => ({
            ...s,
            status: idx < i ? 'done' : idx === i ? 'running' : 'pending',
          }))
        )
        setProgress(Math.round(((i + 1) / totalSteps) * 90))
      }

      const newBlueprints = await pollCampaign(campaignId)

      setPipelineSteps((prev) => prev.map((s) => ({ ...s, status: 'done' as const })))
      setProgress(100)
      await new Promise((r) => setTimeout(r, 500))

      setBlueprints(newBlueprints)
      setView('canvas')
    } catch (err: any) {
      setFailureReason(err.message || 'An unexpected error occurred.')
    }
  }, [])

  const openPastCampaign = useCallback((blueprintList: Blueprint[]) => {
    setBlueprints(blueprintList)
    setView('canvas')
  }, [])

  const goHome = useCallback(() => {
    setView('home')
    setFailureReason(null)
  }, [])
  const submitApproval = useCallback(
    async (blueprintId: string, status: 'approved' | 'rejected', notes?: string) => {
      try {
        if (import.meta.env.VITE_USE_MOCKS) {
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
          return
        }

        const [campaignId, ...productParts] = blueprintId.split('#')
        const productName = productParts.join('#')

        const response = await fetch(`${API_BASE}/campaigns/${campaignId}/approval`, {
          method: 'PATCH',
          headers: apiHeaders,
          body: JSON.stringify({
            product_name: productName,
            approval_status: status,
            reviewer_notes: notes ?? '',
          }),
        })

        const data = await response.json()
        console.log(`[CampaignX] Approval submitted for ${productName} (${status}):`, data)

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
      } catch (err: any) {
        setFailureReason(`Approval failed: ${err.message}`)
      }
    },
    []
  )

  const clearError = useCallback(() => setFailureReason(null), [])
  const goToForm = useCallback(() => setView('form'), [])

  return {
    view,
    briefData,
    blueprints,
    pastCampaigns,
    isLoadingHistory,
    pipelineSteps,
    progress,
    selectedImageDetail,
    failureReason,
    setSelectedImageDetail,
    clearError,
    setFailureReason,
    startNewCampaign,
    submitBrief,
    openPastCampaign,
    fetchRecentCampaigns,
    goHome,
    goToForm,
    submitApproval,
  }
}