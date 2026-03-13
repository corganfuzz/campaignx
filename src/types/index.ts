export type AspectRatio = '1x1' | '9x16' | '16x9'
export type ComplianceStatus = 'pass' | 'warn' | 'fail'

export interface ComplianceItem {
  status: ComplianceStatus
  label: string
}

export interface CampaignImage {
  url: string
  format: string
  dimensions: string
  ratio: AspectRatio
}

import type { ReactNode } from 'react'

export interface AdCopy {
  lang: string
  flag: string | ReactNode
  text: string
}

export interface NextStep {
  id: string
  label: string
  action: 'new-product' | 'new-region' | 'export' | 'legal' | 'regenerate'
}

export type ApprovalStatus = 'pending_review' | 'approved' | 'rejected'

export interface TokenCounts {
  input: number
  output: number
}

export interface GenerationReport {
  cost_usd: number
  token_counts: TokenCounts
  nova_canvas_calls: number
}

export interface Blueprint {
  id: string
  product: string
  region: string
  audience: string
  message: string
  strategy: string
  images: Record<AspectRatio, CampaignImage>
  adCopy: AdCopy[]
  compliance: ComplianceItem[]
  nextSteps: NextStep[]
  createdAt: string
  approvalStatus?: ApprovalStatus
  reviewedBy?: string
  reviewerNotes?: string
  reviewedAt?: string
  generationReport?: GenerationReport
}

export interface Campaign {
  id: string
  product: string
  region: string
  audience: string
  message: string
  language: string
  createdAt: string
  blueprints: Blueprint[]
}

export interface PipelineStep {
  id: string
  label: string
  status: 'pending' | 'running' | 'done'
}

export interface BriefFormData {
  products: string[]
  region: string
  audience: string
  message: string
  language: string
}

export interface SidebarProps {
  activeView: string
  onNavigate: (view: string) => void
  onNewCampaign: () => void
}

export interface TopNavProps {
  onHome: () => void
}

export interface AICursorProps {
  blockId: string
  onClose: () => void
}

export interface ErrorDialogProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message: string | null
  onRetry?: () => void
}

export interface ImageDetailProps {
  blueprint: Blueprint
  ratio: string
  onClose: () => void
  onRegenerate: () => void
}

export interface BlueprintApprovalBlockProps {
  blueprint: Blueprint
  onSubmit: (id: string, status: 'approved' | 'rejected', notes?: string) => Promise<void>
}

export interface BriefFormProps {
  prefill: BriefFormData | null
  onSubmit: (data: BriefFormData) => void
  onBack: () => void
}

export interface CanvasProps {
  blueprints: Blueprint[]
  onNewCampaign: () => void
  onBack: () => void
  submitApproval: (id: string, status: 'approved' | 'rejected', notes?: string) => Promise<void>
}

export interface ErrorScreenProps {
  failureReason: string | null
  onRetry: () => void
  onHome: () => void
}

export interface HomeProps {
  onStartCampaign: (prefill?: string) => void
  onOpenCampaign: (campaign: Campaign) => void
  pastCampaigns: Campaign[]
  isLoadingHistory: boolean
  fetchRecentCampaigns: () => Promise<void>
  onSubmitBrief: (data: BriefFormData) => Promise<void>
}

export interface LoadingPipelineProps {
  steps: PipelineStep[]
  progress: number
}