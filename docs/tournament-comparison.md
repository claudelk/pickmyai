# Tournament Comparison (P0) — IMPLEMENTED

## Overview
3-round tournament bracket where users actively judge AI responses across different skill categories, leading to a personalized recommendation.

## Status
**Implemented** — All phases complete. Full tournament flow from gate to winner card.

## Flow (State Machine)
```
gate → onboarding → round1_prompt → round1_results → round1_vote →
  round2_prompt → round2_results → round2_vote →
    round3_prompt → round3_results → round3_vote →
      winner | tiebreaker → winner
```

Managed by `lib/useTournament.ts` custom hook. Stage transitions are automatic after API responses complete and user votes.

## Rounds

| Round | Category | Platforms | User Action |
|-------|----------|-----------|-------------|
| 1 | Rewriting/Editing | All 6 | Pick top 3 (ordered: #1 = vote, #2/#3 advance) |
| 2 | Analysis/Reasoning | Top 3 survivors | Pick 1 favorite (= 1 vote) |
| 3 | Creative Writing | Same top 3 | Pick 1 favorite (= 1 vote) |

## Default Prompts
Each round has a benchmark-quality default prompt with hint: *"This prompt is designed to test [category]. Feel free to use it or write your own."*

- **Rewriting**: Rewrite an informal paragraph to sound professional
- **Analysis**: Analyze remote vs hybrid work tradeoffs for a startup
- **Creative**: Write a story opening about missing last pages in library books

## Assessment Framework
Each round displays 4 evaluation criteria above results (via `AssessmentCriteria.tsx`):
- Round 1: Tone, Clarity, Structure, Conciseness
- Round 2: Depth, Logical Flow, Completeness, Nuance
- Round 3: Creativity, Voice, Engagement, Originality

## Vote System
- Max votes per platform: 3 (one per round)
- Clear winner: platform with most votes (2+ out of 3, higher than second place)
- Tie: goes to tiebreaker flow

## Tiebreaker
4 preference questions mapped to platform strengths:
1. Speed vs thoroughness
2. Formal vs casual tone
3. Privacy importance
4. Google vs Microsoft ecosystem

Each answer adds +0.5 to matching platforms. Combined with vote scores, highest wins.

## UI Components

| Component | Purpose |
|-----------|---------|
| `TournamentProgress.tsx` | "Round 1 of 3 — Rewriting" progress bar |
| `AssessmentCriteria.tsx` | 4 criteria cards shown above results |
| `VoteOverlay.tsx` | Standalone vote picker (available but voting is integrated into cards) |
| `TiebreakerFlow.tsx` | 4 preference questions when votes are tied |
| `WinnerCard.tsx` | Final recommendation with vote breakdown + "Try it free" CTA |
| `NormalModeDisclaimer.tsx` | "Comparing standard chat mode" info banner |

## Data Layer

| File | Purpose |
|------|---------|
| `lib/tournament.ts` | Types, round configs, tiebreaker questions, resolver, helpers |
| `lib/useTournament.ts` | Custom hook with all tournament state & transitions |

## Normal Mode Disclaimer
Clear statement: "Comparing standard chat mode — not deep research, deep thinking, code interpreter, or image/video generation."

## Rate Limiting
Rate limit only counts on Round 1 (when all 6 AIs are queried). Rounds 2-3 (3 AIs each) do not consume rate limit. 3 tournament runs per 24h per IP.

## API Changes
`POST /api/compare` now accepts optional `platforms` array and `tournamentRound` param. Rate limiting is bypassed for rounds 2-3.
