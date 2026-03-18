# Onboarding Flow

## Overview
Dual-path entry gate with full-screen video background that routes users based on AI experience level, then directly to category selection. No guided onboarding questions — the category tiles themselves serve as the onboarding.

## Entry Gate (EntryGate.tsx)
- Full-screen hero video background (`/hero-bg.mp4`) with autoPlay, muted, loop
- Dark overlay (bg-black/50) for text readability
- Navbar becomes transparent over the video via `has-category-bg` CSS class
- Two frosted glass tiles (bg-white/10 backdrop-blur-xl) for path selection

### "How it works" steps (shown above tiles)
1. **Pick your skills** — Choose the categories that matter most to you
2. **Compare & vote** — Watch six AIs respond to the same prompt and pick your favorites
3. **Your winner** — Get a personalized recommendation based on your votes

## Paths

### Path A: "I know AI" → Fast Track
- Button label: "Get started"
- Sets tournament mode to "fast" (1 round per category)
- Goes directly to category selection screen

### Path B: "I am new to AI" → Deep Dive
- Button label: "Guide me"
- Sets tournament mode to "deep" (3 sub-rounds per category)
- Goes directly to category selection screen

## Category Selection (CategorySelector.tsx)
- Large 2-column tile grid with photorealistic background images (Next.js Image)
- 4 available categories: Rewriting & Editing, Analysis & Reasoning, Creative Writing, Coding
- 3 "coming soon" tiles (Image/Video/Music Gen): smaller row, greyed out with lock icon, not selectable
- Min 2, max 5 selectable
- Selected tiles: accent border, checkmark badge (top-right), order number badge (top-left)
- "Not sure? Start with our picks" preset button selects Rewriting + Creative + Analysis
- Confirm button shows count, disabled until 2+ selected

## Tournament Flow
After category selection, tournament runs with full-screen category background images and frosted glass UI panels. See [tournament-comparison.md](tournament-comparison.md) for full details.
