import type { Blueprint, Campaign, PipelineStep } from '../types'

export const PIPELINE_STEPS: PipelineStep[] = [
  { id: '1', label: 'Retrieving brand guidelines from knowledge base...', status: 'pending' },
  { id: '2', label: 'Analyzing regional market trends...', status: 'pending' },
  { id: '3', label: 'Checking legal constraints...', status: 'pending' },
  { id: '4', label: 'Generating creative concept...', status: 'pending' },
  { id: '5', label: 'Creating hero image...', status: 'pending' },
  { id: '6', label: 'Resizing for 3 formats...', status: 'pending' },
  { id: '7', label: 'Applying text overlays...', status: 'pending' },
]

export const MOCK_BLUEPRINTS: Record<string, Blueprint> = {
  dove_shampoo_brazil: {
    id: 'bp_001',
    product: 'Dove Shampoo',
    region: 'Brazil',
    audience: 'Women 25-40',
    message: 'Feel fresh every day',
    strategy:
      'For the Brazilian market, we recommend vibrant lifestyle imagery targeting young professional women. The visual language should draw on warm, energetic tones — sun-drenched environments, confident body language, and urban energy. Brand voice: empowering, optimistic, and relatable. Cultural resonance is key: Brazilians respond strongly to authenticity and joyful self-expression. Avoid overly clinical aesthetics.',
    images: {
      '1x1': {
        url: 'https://picsum.photos/seed/dove1/600/600',
        format: 'Instagram Feed',
        dimensions: '1080 × 1080px',
        ratio: '1x1',
      },
      '9x16': {
        url: 'https://picsum.photos/seed/dove2/400/711',
        format: 'TikTok / Reels',
        dimensions: '1080 × 1920px',
        ratio: '9x16',
      },
      '16x9': {
        url: 'https://picsum.photos/seed/dove3/800/450',
        format: 'YouTube / Facebook',
        dimensions: '1920 × 1080px',
        ratio: '16x9',
      },
    },
    adCopy: [
      { lang: 'Portuguese (BR)', flag: '🇧🇷', text: 'Sinta-se fresca todos os dias' },
      { lang: 'English', flag: '🇺🇸', text: 'Feel fresh every day' },
    ],
    compliance: [
      { status: 'pass', label: 'Brand colors detected' },
      { status: 'pass', label: 'Logo present in all formats' },
      { status: 'warn', label: '"guaranteed results" — possible legal flag' },
      { status: 'pass', label: 'Tone matches brand voice guidelines' },
    ],
    nextSteps: [
      { id: 'ns1', label: 'Generate for Body Wash', action: 'new-product' },
      { id: 'ns2', label: 'Try Japan market', action: 'new-region' },
      { id: 'ns3', label: 'Export all assets', action: 'export' },
      { id: 'ns4', label: 'Run full legal check', action: 'legal' },
    ],
    createdAt: '2025-04-02T10:30:00Z',
    approvalStatus: 'pending_review',
    generationReport: {
      cost_usd: 0.51,
      token_counts: { input: 1842, output: 487 },
      nova_canvas_calls: 3,
    },
  },

  dove_bodywash_brazil: {
    id: 'bp_002',
    product: 'Dove Body Wash',
    region: 'Brazil',
    audience: 'Women 25-40',
    message: 'Nourish your skin naturally',
    strategy:
      'Building on the Dove Shampoo campaign, the Body Wash campaign extends the same vibrant Brazilian lifestyle theme. Focus on skin radiance and natural ingredients. Warm golden lighting, tropical accents, and a focus on texture and touch. The copy should feel sensorial and personal.',
    images: {
      '1x1': {
        url: 'https://picsum.photos/seed/body1/600/600',
        format: 'Instagram Feed',
        dimensions: '1080 × 1080px',
        ratio: '1x1',
      },
      '9x16': {
        url: 'https://picsum.photos/seed/body2/400/711',
        format: 'TikTok / Reels',
        dimensions: '1080 × 1920px',
        ratio: '9x16',
      },
      '16x9': {
        url: 'https://picsum.photos/seed/body3/800/450',
        format: 'YouTube / Facebook',
        dimensions: '1920 × 1080px',
        ratio: '16x9',
      },
    },
    adCopy: [
      { lang: 'Portuguese (BR)', flag: '🇧🇷', text: 'Nutra sua pele naturalmente' },
      { lang: 'English', flag: '🇺🇸', text: 'Nourish your skin naturally' },
    ],
    compliance: [
      { status: 'pass', label: 'Brand colors detected' },
      { status: 'pass', label: 'Logo present in all formats' },
      { status: 'pass', label: 'No prohibited claims detected' },
      { status: 'pass', label: 'Tone matches brand voice guidelines' },
    ],
    nextSteps: [
      { id: 'ns1', label: 'Generate for Shampoo', action: 'new-product' },
      { id: 'ns2', label: 'Try USA market', action: 'new-region' },
      { id: 'ns3', label: 'Export all assets', action: 'export' },
      { id: 'ns4', label: 'Run full legal check', action: 'legal' },
    ],
    createdAt: '2025-04-02T10:35:00Z',
    approvalStatus: 'approved',
    reviewedBy: 'jane@company.com',
    reviewerNotes: 'Great work — approved for Brazil launch',
    reviewedAt: '2025-04-02T12:00:00Z',
    generationReport: {
      cost_usd: 0.48,
      token_counts: { input: 1720, output: 440 },
      nova_canvas_calls: 3,
    },
  },
}

export const MOCK_PAST_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp_001',
    product: 'Dove Shampoo',
    region: 'Brazil',
    audience: 'Women 25-40',
    message: 'Feel fresh every day',
    language: 'pt-BR',
    createdAt: '2025-04-02T10:30:00Z',
    blueprints: [MOCK_BLUEPRINTS.dove_shampoo_brazil],
  },
  {
    id: 'camp_002',
    product: 'Dove Body Wash',
    region: 'Japan',
    audience: 'Young professionals',
    message: 'Pure care for your skin',
    language: 'ja',
    createdAt: '2025-04-01T09:00:00Z',
    blueprints: [],
  },
  {
    id: 'camp_003',
    product: 'Dove Toothpaste',
    region: 'USA',
    audience: 'Families',
    message: 'Brighten every smile',
    language: 'en',
    createdAt: '2025-03-28T14:20:00Z',
    blueprints: [],
  },
]

export const REGIONS = [
  { key: 'brazil', label: '🇧🇷 Brazil', lang: 'Portuguese (BR)', langCode: 'pt-BR' },
  { key: 'japan', label: '🇯🇵 Japan', lang: 'Japanese', langCode: 'ja' },
  { key: 'usa', label: '🇺🇸 United States', lang: 'English', langCode: 'en' },
  { key: 'germany', label: '🇩🇪 Germany', lang: 'German', langCode: 'de' },
  { key: 'mexico', label: '🇲🇽 Mexico', lang: 'Spanish', langCode: 'es' },
  { key: 'france', label: '🇫🇷 France', lang: 'French', langCode: 'fr' },
]

export const mockGenerateCampaign = async (
  productIndex: number,
  onStep: (stepIndex: number) => void
): Promise<Blueprint> => {
  const steps = PIPELINE_STEPS.length
  for (let i = 0; i < steps; i++) {
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400))
    onStep(i)
  }
  const blueprints = Object.values(MOCK_BLUEPRINTS)
  return blueprints[productIndex % blueprints.length]
}

export const MOCK_RESPONSES: Record<string, string> = {
  strategy: "I've updated the creative strategy to emphasize a more premium, aspirational tone while keeping the Brazilian cultural warmth. The color palette suggestion now leans toward deep ocean blues with gold accents.",
  copy: 'Ad copy updated! The new Brazilian Portuguese version reads: "Renove sua energia todos os dias" — a more dynamic and energetic phrasing that resonates better with urban millennials.',
  compliance: 'Full legal review complete. The word "guaranteed" has been replaced with "proven" which is compliant per regional advertising standards. All other claims are clear.',
  default: 'Block updated based on your instructions. The AI has applied your feedback while maintaining brand consistency and regional relevance.',
}

export const RATIO_LABELS: Record<string, string> = {
  '1x1': 'Instagram Feed',
  '9x16': 'TikTok / Reels',
  '16x9': 'YouTube / Facebook',
}

export const TEMPLATES = [
  {
    title: 'ErgoPro Launch',
    prompt: 'Create a campaign for the ErgoPro Adjustable Stand Desk targeting remote workers in the USA. Message: "Upgrade your home office with our new smart standing desk."',
    payload: `products:
  - ErgoPro Adjustable Stand Desk
region: usa
audience: Remote workers and developers
message: Upgrade your home office with our new smart standing desk.`
  },
  {
    title: 'Dove Brazil',
    prompt: 'Build a social campaign for Dove Shampoo and Conditioner in Brazil, targeting women 25-40 with the message: "Feel fresh every day with natural ingredients."',
    payload: `products:
  - Dove Shampoo
  - Dove Conditioner
region: brazil
audience: Women 25-40
message: Feel fresh every day with natural ingredients.`
  },
  {
    title: 'Sony Audio Japan',
    prompt: 'I need a campaign for the WH-1000XM6 Headphones in Japan. Target audiophiles and commuters with the message: "Experience silence like never before."',
    payload: `products:
  - WH-1000XM6 Headphones
region: japan
audience: Audiophiles and commuters
message: Experience silence like never before.`
  },
  {
    title: 'Winter Gear Germany',
    prompt: 'Create a campaign for the Summit Series Parka and Thermal Beanie in Germany. Target winter sports enthusiasts with the message: "Conquer the cold this season."',
    payload: `products:
  - Summit Series Parka
  - Thermal Beanie
region: germany
audience: Winter sports enthusiasts
message: Conquer the cold this season.`
  }
]

export const AI_COMMENTARY = [
  'Retrieving brand guidelines from knowledge base...',
  'Analyzing cultural trends and consumer preferences...',
  'Cross-referencing legal constraints for this market...',
  'Crafting creative direction with AI...',
  'Generating hero imagery with AWS Bedrock Nova Canvas...',
  'Resizing and adapting for 3 social formats...',
  'Applying localized text overlays...',
]