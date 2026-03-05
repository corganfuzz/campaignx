import { useState, useCallback } from 'react'
import type { Blueprint, BriefFormData, PipelineStep } from '../types'
import { PIPELINE_STEPS, mockGenerateCampaign } from '../data/mockData'

export type AppView = 'home' | 'form' | 'loading' | 'canvas'

export const useCampaign = () => {
  const [view, setView] = useState<AppView>('home')
  const [briefData, setBriefData] = useState<BriefFormData | null>(null)
  const [blueprints, setBlueprints] = useState<Blueprint[]>([])
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>(PIPELINE_STEPS)
  const [progress, setProgress] = useState(0)
  const [selectedImageDetail, setSelectedImageDetail] = useState<{ blueprint: Blueprint; ratio: string } | null>(null)

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
    setView('loading')

    const newBlueprints: Blueprint[] = []

    for (let i = 0; i < data.products.length; i++) {
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
    setBlueprints(newBlueprints)
    setView('canvas')
  }, [])

  const openPastCampaign = useCallback((blueprintList: Blueprint[]) => {
    setBlueprints(blueprintList)
    setView('canvas')
  }, [])

  const goHome = useCallback(() => setView('home'), [])
  const goToForm = useCallback(() => setView('form'), [])

  return {
    view,
    briefData,
    blueprints,
    pipelineSteps,
    progress,
    selectedImageDetail,
    setSelectedImageDetail,
    startNewCampaign,
    submitBrief,
    openPastCampaign,
    goHome,
    goToForm,
  }
}
