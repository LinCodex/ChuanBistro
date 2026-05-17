# TEAM_008: XiYueHui Branding

## Overview
Updated the application branding from Chuan Bistro to Xi Yue Hui (禧悦會海鲜自助火锅), a Chinese AYCE hotpot restaurant.

## Changes
- Updated `src/App.tsx` text labels and replaced the hero video URL with the local `/background.mp4`.
- Extracted and included `XiaohongshuIcon` and replaced the row of 3 share buttons in `error` and `result` steps with a single "Share Review" dropdown.
- Updated `src/translations.ts` survey questions to target AYCE hotpot context (e.g. broths, meats, seafood).
- Updated AI prompt rules in `src/services/gemini.ts` to ensure it generates reviews for Xi Yue Hui AYCE Hotpot.
