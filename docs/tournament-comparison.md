# Tournament Comparison (P0) — IMPLEMENTED

## Overview
Category-based tournament where users choose 2–5 skill categories, then AIs compete in each. Two tournament modes exist based on user experience: **Fast Track** (1 round per category) and **Deep Dive** (3 sub-rounds per category).

## Status
**Implemented** — Full tournament flow: gate → category select → dynamic rounds → winner.

## Categories (at launch)

| ID | Name | Status |
|---|---|---|
| `rewriting` | Rewriting & Editing | available |
| `analysis` | Analysis & Reasoning | available |
| `creative` | Creative Writing | available |
| `coding` | Coding | available |
| `image_gen` | Image Generation | coming_soon |
| `video_gen` | Video Generation | coming_soon |
| `music_gen` | Music Generation | coming_soon |

## Tournament Modes

### Fast Track ("I know AI")
- 1 round per category
- Cat 1: 6 AIs, pick top 3 (elimination). Cats 2-N: 3 survivors, pick 1 favorite.
- Max votes per platform: N (number of categories)

### Deep Dive ("I am new to AI")
- 3 sub-rounds per category (same prompt, same responses, 3 voting passes)
- Sub-round 1: 6 AIs, pick top 3 (elimination). Sub-rounds 2-3: 3 survivors, pick 1 each.
- Max votes per platform: 3 × N
- No new API calls for sub-rounds 2-3 (results are cached)

## Flow (State Machine)
```
gate → category_select →
  round_prompt → round_results → round_vote →
  round_transition →
  ... (repeat per category/sub-round) →
  winner | tiebreaker → winner
```

Phases: `gate`, `onboarding`, `category_select`, `round_prompt`, `round_results`, `round_vote`, `round_transition`, `tiebreaker`, `winner`

## Winner Detection
- **Fast track**: needs > runner-up AND ≥ 2 votes
- **Deep dive**: needs > runner-up AND ≥ ceil(totalSubRounds / 2) votes
- Tie → tiebreaker (same 4 preference questions, +0.5 each)

## Assessment Framework
Each category displays 4 evaluation criteria (via `AssessmentCriteria.tsx`):
- Rewriting: Tone, Clarity, Structure, Conciseness
- Analysis: Depth, Logical Flow, Completeness, Nuance
- Creative: Creativity, Voice, Engagement, Originality
- Coding: Correctness, Efficiency, Readability, Explanation

## Tiebreaker
4 preference questions mapped to platform strengths (unchanged):
1. Speed vs thoroughness
2. Formal vs casual tone
3. Privacy importance
4. Google vs Microsoft ecosystem

Each answer adds +0.5 to matching platforms. Combined with vote scores, highest wins.

## UI Components

| Component | Purpose |
|-----------|---------|
| `CategorySelector.tsx` | Tile grid for picking 2-5 categories, "Not sure?" preset, coming soon tiles |
| `TournamentProgress.tsx` | Dynamic N categories with names + sub-round indicator (deep mode) |
| `AssessmentCriteria.tsx` | 4 criteria cards shown above results (per category) |
| `VoteOverlay.tsx` | Standalone vote picker (available but voting is integrated into cards) |
| `TiebreakerFlow.tsx` | 4 preference questions when votes are tied |
| `WinnerCard.tsx` | Winner + per-category breakdown + dynamic vote dots + "Try it free" CTA |
| `RoundTransition.tsx` | Brief animation between categories with progress dots |
| `NormalModeDisclaimer.tsx` | "Comparing standard chat mode" info banner |

## Data Layer

| File | Purpose |
|------|---------|
| `lib/categories.ts` | `CategoryConfig` interface, `CATEGORIES` array (7 categories), helpers |
| `lib/tournament.ts` | Phases, modes, vote state, tiebreaker, scoring helpers |
| `lib/useTournament.ts` | Custom hook: dynamic state machine with mode-aware transitions |

## Rate Limiting
- Only elimination rounds (6 AIs) count against rate limit
- 3 survivors rounds are free
- Deep dive: cached results for sub-rounds 2-3 (no new API calls)
- 3 tournament runs per 24h per IP

## API
`POST /api/compare` accepts `platforms` array and `platformCount` param. Rate limiting checks `platformCount === 6`.
