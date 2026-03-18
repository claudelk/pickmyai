# LLM Selection Algorithm

## Overview
The algorithm determines which AI platform to recommend based on user behavior during the 3-round tournament.

## Scoring

### Vote Points (Primary)
- Round 1: User picks top 3. #1 pick = 1 vote point. #2/#3 = 0 points (but advance).
- Round 2: User picks favorite from 3 survivors = 1 vote point.
- Round 3: User picks favorite from 3 survivors = 1 vote point.
- **Max possible per platform: 3 points**

### Clear Winner
If one platform has strictly more votes than all others → that platform wins.

### Tiebreaker (Preference Points)
When 2+ platforms are tied on votes, 4 preference questions break the tie.

Each question maps to known platform strengths:

| Question | Option A (platforms) | Option B (platforms) |
|----------|---------------------|---------------------|
| Speed or thoroughness? | Speed: Mistral, Grok, ChatGPT | Thorough: Claude, Gemini, Meta AI |
| Formal or casual tone? | Formal: Claude, ChatGPT | Casual: Grok, Meta AI, Mistral, Gemini |
| Is privacy important? | Yes: Mistral, Meta AI (+0.5 each) | No: neutral (no points) |
| Google or Microsoft tools? | Google: Gemini | Microsoft/neither: ChatGPT, Claude |

Each matching answer adds **+0.5** to the listed platforms' scores (added on top of vote points).

### Final Score
```
final_score = vote_points + tiebreaker_points
```
Platform with highest final_score wins. If still tied after tiebreaker, pick the one that appeared first in the user's round 1 top-3 ordering (preference signal).

## Survivor Selection (Round 1 → Rounds 2-3)
- User picks top 3 in order during round 1
- All 3 advance to rounds 2 and 3
- The other 3 are eliminated

## Platform Strength Mapping
| Platform | Known Strengths |
|----------|----------------|
| ChatGPT | Versatile, fast, large plugin ecosystem |
| Claude | Careful reasoning, long-form, nuanced |
| Gemini | Visual/multimodal, Google integration |
| Mistral | Speed, privacy, European data compliance |
| Grok | Real-time web, current events, casual tone |
| Meta AI | Open-source, customizable, coding |
