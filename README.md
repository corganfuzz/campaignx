# Concrete Focus UI

> A React-based creative operations dashboard that takes a campaign brief as input and renders AI-generated, brand-compliant advertising assets across three social platforms.

Built with **React 19**, **Vite**, **TypeScript**, and **Adobe React Spectrum S2** (dark mode).

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript |
| Bundler | Vite 7 |
| Package Manager | Bun |
| UI Library | Adobe React Spectrum S2 (`@react-spectrum/s2`) |
| Icons | `@spectrum-icons/workflow` |
| Routing | `react-router` v7 |
| Animations | `react-type-animation` |
| Macro Plugin | `unplugin-parcel-macros` |

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (`curl -fsSL https://bun.sh/install | bash`)
- A deployed CampaignX backend (see [campaignx-infra](https://github.com/corganfuzz/campaignx-infra))

### Installation

```bash
bun install
```

### Environment

Create a `.env.local` file in the project root:

```
VITE_API_BASE_URL=https://<api-id>.execute-api.us-east-1.amazonaws.com/<stage>
VITE_API_KEY=<api-key-from-terraform-output>
```

### Development

```bash
bun dev          # Start with live API backend
bun dev:mock     # Start with mock data (no backend required)
```

### Production Build

```bash
bun build        # Outputs to dist/
bun preview      # Preview production build locally
```

---

## Project Structure

```
src/
├── App.tsx                          Application shell, view router, state orchestration
├── main.tsx                         Entry point — <Provider colorScheme="dark">
├── index.css                        Global styles and CSS reset
├── App.css                          Layout styles (sidebar + main content)
│
├── pages/
│   ├── Home.tsx                     Dashboard — recent campaigns, template prompt builder
│   ├── BriefForm.tsx                Manual brief form + JSON/YAML drag-and-drop import
│   ├── LoadingPipeline.tsx          Animated generation progress while polling API
│   ├── Canvas.tsx                   Sophia-style blueprint — 9-block campaign viewer
│   ├── BlueprintApprovalBlock.tsx   Approve / Reject controls with reviewer notes
│   └── ErrorScreen.tsx              Failure display with retry option
│
├── components/
│   ├── layout/
│   │   ├── TopNav.tsx               Top navigation bar with logo
│   │   └── Sidebar.tsx              Collapsible sidebar navigation
│   └── shared/
│       ├── AICursor.tsx             Floating AI refinement popover per canvas block
│       ├── ImageDetail.tsx          Full-resolution image viewer overlay
│       └── ErrorDialog.tsx          Global error modal with retry action
│
├── hooks/
│   └── useCampaign.ts              Core state machine — view transitions, API calls, polling
│
├── types/
│   └── index.ts                    TypeScript interfaces (Campaign, Brief, Blueprint, etc.)
│
├── data/
│   └── mockData.ts                 Mock campaign data for offline development
│
├── utils/
│   ├── download.ts                 S3 presigned URL → Blob download handler
│   └── yamlParser.ts               YAML/JSON brief file parser for drag-and-drop
│
└── assets/
    ├── logo.svg                    Application logo
    └── *.json                      Sample brief templates (Dove, Sony, ErgoPro, etc.)
```

---

## Canvas Blocks

The Canvas page renders a 9-block "Sophia-style" blueprint for each generated product:

| Block | Content |
|-------|---------|
| Creative Strategy | Agent's reasoning — why this creative approach for this market |
| Image 1:1 | Generated Instagram image (1024×1024) with download |
| Image 9:16 | Generated TikTok/Reels image (720×1280) with download |
| Image 16:9 | Generated YouTube image (1280×720) with download |
| Ad Copy | Localized headline, body text, and CTA |
| Compliance Report | Pass / Warn / Fail items, colour-coded |
| Suggested Next Steps | Agent recommendations for this market |
| Output Files | Folder tree of saved asset paths, cost summary |
| Approval Status | Status badge + Approve/Reject buttons with reviewer notes |

Each block supports an **AI Cursor** — a floating popover where users can type a refinement prompt to regenerate only that specific block.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start local dev server (connects to live API) |
| `bun dev:mock` | Start local dev server with mock data |
| `bun build` | TypeScript check + production build |
| `bun preview` | Serve the production build locally |
| `bun lint` | Run ESLint across the project |

---

## Related

- **Backend Infrastructure:** [campaignx-infra](https://github.com/corganfuzz/campaignx-infra) — Terraform-managed AWS stack (API Gateway, Lambda, DynamoDB, Bedrock, SQS, S3)
