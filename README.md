# Concrete Focus

> A React dashboard designed to orchestrate AI-generated, brand-compliant advertising assets across three global aspect ratios.

Built with **React 19**, **Bun**, **TypeScript**, and **Adobe React Spectrum S2** (Dark Mode).

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

## Component Architecture

The **Campaign Canvas** renders a 9-block blueprint for each product in a campaign, reflecting the modular outputs of the AWS Generation Pipeline:

| Block | Content | Technology |
|:---|:---|:---|
| **Creative Strategy** | Agent's market reasoning — target trends and approach. | Amazon Bedrock Agent |
| **Image (1:1)** | High-res Instagram/Facebook Feed asset (1024x1024). | Amazon Nova Canvas |
| **Image (9:16)** | Cinematic TikTok/Reels Vertical asset (720x1280). | Amazon Nova Canvas |
| **Image (16:9)** | Broad-scale YouTube/Facebook Landscape asset (1280x720). | Amazon Nova Canvas |
| **Ad Copy** | Localized headline, body text, and direct CTA. | Claude 3.5 Sonnet |
| **Compliance Report** | Real-time audit (PII, Legal, Brand Voice) with pass/fail badges. | Claude 3.5 Haiku |
| **Suggested Next Steps** | Actionable recommendations for market deployment. | Bedrock Agent |
| **Asset Metadata** | S3 resolution paths, cost summary, and generation latency. | DynamoDB |
| **Human Approval** | **HITL Interface**: Review, add notes, and finalize campaign status. | REST API (PATCH) |

Each block utilizes the **AI Cursor** — an interactive popover for real-time item refinement.

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
