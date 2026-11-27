# QR Link Pro

**Dynamic QR Routing & Scan Analytics Platform**

A production-ready, mobile-first QR code management system built with Next.js 14+ (App Router). Manage 20 fixed QR cards (`001`–`020`), perform rapid redirects, track scans, and control everything from a responsive admin dashboard optimized for on-site smartphone use.

**Live Domain:** [https://DRFTreviews.vercel.app](https://DRFTreviews.vercel.app)

---

## Features

- **Dynamic Redirect Engine** (`/q/[id]`)
  - Instant 302 redirects for active cards
  - Automatic scan counting + device metadata capture
  - Graceful handling of inactive/unassigned cards
  - Stylized 404 for invalid IDs outside `001`–`020`

- **Protected Admin Dashboard** (`/admin`)
  - Mobile-first responsive grid + list view of all 20 cards
  - Real-time status badges (Active / Inactive)
  - Scan counters and top-performing card highlights
  - Quick search & filter by ID, business name, or status
  - Inline edit modal with URL validation
  - One-click status toggle + stats reset
  - Seed button to initialize all 20 cards

- **Analytics Summary**
  - Total Cards · Active Cards · Total Scans · Top Performer

- **Security**
  - Lightweight password protection via `ADMIN_PASSWORD` env var
  - Secure cookie / middleware-based admin route protection

- **Tech Stack**
  - Next.js 14+ (App Router)
  - TypeScript
  - Tailwind CSS + shadcn/ui
  - Lucide React icons
  - Vercel KV (or lightweight JSON key-value fallback)
  - Fully compatible with Vercel Free Hobby Tier

---

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd qr-link-pro
npm install

Project Structure
app/
├── q/
│   └── [id]/
│       └── route.ts          # Dynamic redirect + scan tracking
├── admin/
│   └── page.tsx              # Protected admin dashboard
├── unassigned/
│   └── page.tsx              # Friendly "Card Currently Unassigned" page
├── layout.tsx
└── page.tsx                  # Landing / marketing page (optional)

lib/
├── storage.ts                # KV / JSON abstraction layer
├── types.ts                  # Shared TypeScript types
└── auth.ts                   # Admin password + cookie helpers

components/
├── admin/                    # Dashboard UI components
├── ui/                       # shadcn/ui primitives
└── ...

middleware.ts                 # Admin route protection
