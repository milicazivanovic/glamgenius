# GlamGenius — AI Stylist Portfolio

**Live Demo:** [https://glamgenius.vercel.app/demo](https://glamgenius.vercel.app/demo)  
*(Note: This is a portfolio project. The demo uses a read-only database with 12 sample items.)*

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Prisma, Postgres (Neon), Vercel.

## Overview
GlamGenius is a "human-centered AI" wardrobe manager that helps users build outfits based on their real clothes, current mood, and weather. Unlike generic chatbots, it uses a deterministic rule engine to ensure every recommendation is physically possible (you own the item) and stylistically sound (color/season matching).

## For Recruiters
**Key Technical Highlights to Review:**
1.  **AI Architecture**: See `src/lib/agentRules.ts` for the custom intent parser and state machine.
2.  **Algorithm Transparency**: Visit `/agent` to see how the scoring engine weights factors like "Wear Frequency" and "Color Harmony".
3.  **Full Stack**: Next.js App Router with Postgres database (via Prisma).
4.  **UI/UX**: Custom "Vibe" selector, glassmorphism design system, and micro-interactions.

**Resume Snippet:**
> **GlamGenius — AI Stylist Agent (Live Product)**  
> Deployed full-stack AI outfit recommendation system with rule-based agent, explainable scoring engine, and interactive chat interface (Next.js, TypeScript, Prisma, Postgres).

---

## ⚠️ Local Development Note
This project is configured for **Postgres** to match production. To run locally:
1.  Set up a local Postgres instance (or use a Neon project branch).
2.  Add `POSTGRES_PRISMA_URL` to your `.env` (file ignored by git).
3.  Run `npx prisma migrate dev && npx prisma db seed`.

---

AI-powered outfit recommendation engine with wardrobe management, contextual generation, and explainability. Built as a production-quality portfolio project.

## Architecture

```
src/
├── app/                    # Next.js 14 App Router pages
│   ├── page.tsx            # Landing page
│   ├── generate/           # Outfit generation (mood × occasion × weather)
│   ├── outfits/            # Outfit history + feedback + comparison
│   ├── wardrobe/           # Clothing inventory + analytics
│   ├── calendar/           # Outfit planning
│   ├── about/              # Algorithm explainability
│   └── api/
│       ├── generate/       # POST — score & rank outfits
│       ├── feedback/       # POST — star rating + liked signal
│       ├── outfits/        # GET — outfit history
│       ├── wardrobe/       # CRUD + wear tracking
│       └── calendar/       # Plan outfits on dates
├── components/
│   ├── Logo.tsx            # SVG sparkle + wordmark
│   ├── Navbar.tsx          # Dark nav bar with active underline
│   ├── OutfitCard.tsx      # Card with explainability panel
│   ├── ClothingItemCard.tsx
│   ├── FeedbackForm.tsx    # Star rating + thumbs
│   ├── StylistChat.tsx     # AI stylist slide-in panel
│   ├── Skeleton.tsx        # Shimmer loading states
│   ├── Toast.tsx           # Notification system
│   ├── ErrorBoundary.tsx
│   └── EmptyState.tsx
└── lib/
    ├── outfitRules.ts      # 6-factor scoring algorithm
    ├── colors.ts           # Color clash detection
    ├── types.ts            # TypeScript interfaces
    ├── schemas.ts          # Zod validation
    └── prisma.ts           # Prisma client singleton
```

## Tech Stack

| Layer       | Technology                        |
| ----------- | --------------------------------- |
| Framework   | Next.js 14 (App Router)           |
| Language    | TypeScript                        |
| Styling     | Tailwind CSS + CSS Variables      |
| Database    | SQLite via Prisma ORM             |
| Icons       | Lucide React                      |
| Testing     | Vitest                            |
| Validation  | Zod                               |

## Features

- **Contextual Generation** — 3 outfits scored by mood, occasion, weather, color harmony, season, and wear frequency
- **Explainability** — "Why this outfit?" panel shows each scoring factor's contribution
- **Feedback Loop** — Star ratings and wear-again signals create labeled data for future ML
- **Outfit Comparison** — Side-by-side comparison of any 2 generated outfits
- **Wear Analytics** — Frequency tracking, average wear rates, least-worn identification
- **AI Stylist Chat** — Slide-in panel (Ctrl+K) with style advice and wardrobe insights
- **Calendar Planning** — Schedule outfits for upcoming days
- **Mark as Worn** — One-click wear tracking updates item rotation stats

## Recommendation Algorithm

The engine uses a 6-factor weighted scoring system:

| Factor             | Weight  | Logic                                                        |
| ------------------ | ------- | ------------------------------------------------------------ |
| Season Compat.     | +3 / −5 | Checks all items from compatible seasons                     |
| Weather Match      | +3 / +1 | Maps weather input to appropriate seasonal items             |
| Color Harmony      | +2 / −3 | Detects same-color non-neutral clashes between top/bottom    |
| Mood Match         | +N      | Tag overlap with mood-associated keywords                    |
| Occasion Match     | +N      | Tag overlap with occasion-associated keywords                |
| Wear Frequency     | +2 / −1 | Bonus for fresh items (avg ≤ 3), penalty for over-worn (> 7) |

All valid top × bottom × shoe (× outer) combinations are enumerated, scored, deduplicated, and the top 3 unique outfits are returned.

## 🤖 AI Agent Architecture (Deterministic Rule Engine)
The application features a transparent, deterministic rule-based agent located in `src/lib/agentRules.ts`. It provides reliable, explainable styling advice without the cost/latency of an external LLM for every interaction.

**Pipeline:**
1. **Input**: User natural language ("I'm stressed, need a work outfit").
2. **Intent Parser**: Regex-based slot filling extracts:
   - `Intent`: GENERATE, MODIFY, ACTION, HELP
   - `Mood`: relaxed, confident, energetic...
   - `Occasion`: work, date, party...
   - `Weather`: cold, hot, raining...
   - `Modifier`: warmer, formal...
3. **Context Manager**: Retains session state (last generated outfits, constraints) for multi-turn refinement.
4. **Scoring Engine**: `outfitRules.ts` evaluates candidate outfits based on:
   - **Season Match**: +3 points
   - **Color Harmony**: +2 points (Contrast/Analogous checks)
   - **Vibe Alignment**: +1-2 points (Comfort boost for negative vibes)
   - **Wear Balancing**: Penalizes over-worn items.
5. **Response**: Structured JSON containing Explanation + Actions + visual Outfit Cards.

**Debug Mode**: Toggle the 🐞 icon in the chat to see real-time agent tracing (Intent confidence, parsed slots, triggered rules).

## Getting Started

```bash
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Testing

```bash
npm test
```

Runs Vitest unit tests for `colorsClash` and `generateOutfits` (14 test cases covering color clash detection, required categories, uniqueness, explainability, and season preference).

## Future ML Upgrade Path

1. **Current**: Rule-based scoring with hand-tuned weights
2. **Phase 2**: Learn personalized weights from feedback data (logistic regression on rating/liked signals)
3. **Phase 3**: Embedding-based item similarity (CLIP visual embeddings)
4. **Phase 4**: LLM-powered natural language outfit explanations
