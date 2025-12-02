# TenderAgent - AI-Powered RFP Automation Platform

A comprehensive Next.js web application simulating an intelligent multi-agent system for automating the RFP (Request for Proposal) lifecycle for a wires & cables OEM.

## Features

### Core Agent Flows
- **Sales Agent**: Scans RFPs, extracts specifications, and prepares summaries
- **Master Agent**: Orchestrates specialized agents and calculates win probability
- **Technical Agent**: Matches SKUs, analyzes spec gaps, and validates compliance
- **Pricing Agent**: Calculates costs, analyzes trends, and optimizes pricing scenarios
- **Final Response**: Generates comprehensive PDF responses

### Enhanced Features
- Real-time deadline tracking with countdown timers
- Risk scoring and fit score analysis
- Historical pricing trend visualization
- Scenario-based pricing (low/medium/high/optimal margins)
- Spec gap analyzer with strengths and weaknesses
- Compliance matrix for standards validation
- Win probability prediction
- Profitability analysis

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Charts**: Recharts
- **Animations**: Framer Motion
- **PDF Generation**: jsPDF
- **Icons**: Lucide React

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
TenderAI/
├── app/                          # Next.js app directory
│   ├── page.tsx                  # Login page
│   ├── dashboard/                # Sales dashboard
│   └── rfp/[id]/                 # RFP agent flows
│       ├── sales-agent/
│       ├── master-agent/
│       ├── technical-agent/
│       ├── pricing-agent/
│       └── final-response/
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── agents/                   # Agent-specific components
│   ├── rfp/                      # RFP-related components
│   └── layout/                   # Layout components
├── data/                         # Mock JSON data
│   ├── rfps.json
│   ├── products.json
│   ├── pricing.json
│   ├── competitors.json
│   └── standards.json
├── lib/                          # Utility functions
└── types/                        # TypeScript definitions
```

## Demo Credentials

Any email and password will work for the demo login.

## Features Walkthrough

1. **Login**: Animated gradient background with smooth transitions
2. **Dashboard**: View all RFPs with search, filters, and stats
3. **Sales Agent**: Simulated RFP analysis with animated logs
4. **Master Agent**: Orchestration with win probability calculation
5. **Technical Agent**: SKU matching with compliance matrix
6. **Pricing Agent**: Cost breakdown with scenario pricing
7. **Final Response**: Comprehensive summary with PDF download

## License

MIT
