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

export interface AdCopy {
  lang: string
  flag: string
  text: string
}

export interface NextStep {
  id: string
  label: string
  action: 'new-product' | 'new-region' | 'export' | 'legal' | 'regenerate'
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
