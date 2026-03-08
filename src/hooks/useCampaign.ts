import { useState, useCallback } from 'react'
import type { Blueprint, BriefFormData, PipelineStep } from '../types'
import { PIPELINE_STEPS, mockGenerateCampaign } from '../data/mockData'

export type AppView = 'home' | 'form' | 'loading' | 'canvas' | 'error'

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
          products: ['Dove Shampoo', 'Dove Body Wash'],
          region: 'brazil',
          audience: 'Women 25-40',
          message: prefill,
          language: 'pt-BR',
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
      const newBlueprints: Blueprint[] = []
      for (let i = 0; i < data.products.length; i++) {
        // If testing the error flow, you could conditionally throw here.
        // For now, we wrap the mock in a try/catch to represent the real flow.
        const blueprint = await mockGenerateCampaign(i, (stepIndex) => {
          setPipelineSteps((prev) =>
            prev.map((s, idx) => ({
              ...s,
              status: idx < stepIndex ? 'done' : idx === stepIndex ? 'running' : 'pending',
            }))
          )
          setProgress(Math.round(((stepIndex + 1) / PIPELINE_STEPS.length) * 100))
        })
        // Override blueprint product name with user input
        newBlueprints.push({ ...blueprint, product: data.products[i], region: data.region })
      }

      setPipelineSteps((prev) => prev.map((s) => ({ ...s, status: 'done' as const })))
      setProgress(100)
      await new Promise((r) => setTimeout(r, 500))

      // In the real code, check `response.approval_status === 'pending_review'` here.
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

  // ── NEW ───────────────────────────────────────────────────────────────────
  // To wire to the real API, replace the setBlueprints call below with:
  //
  //   await fetch(`${import.meta.env.VITE_API_BASE_URL}/campaigns/${blueprintId}/approval`, {
  //     method: 'PATCH',
  //     headers: { 
  //       'Content-Type': 'application/json',
  //       'x-api-key': import.meta.env.VITE_API_KEY
  //     },
  //     body: JSON.stringify({ approval_status: status, reviewer_notes: notes }),
  //   })
  //
  const submitApproval = useCallback(
    async (blueprintId: string, status: 'approved' | 'rejected', notes?: string) => {
      await new Promise((r) => setTimeout(r, 600)) // mock network delay
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
  // ─────────────────────────────────────────────────────────────────────────

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