# Random Decision Maker

## Current State
New project with empty backend and no frontend.

## Requested Changes (Diff)

### Add
- Spinning wheel component with canvas rendering, colorful segments, smooth deceleration animation
- Custom options input (comma-separated), saved/restored via localStorage
- Quick Decision buttons: Yes/No, What to eat, What to watch, Study or Chill
- Funny/humorous response pools for each quick decision type
- Result card with slide-in animation, Copy button (clipboard API), Share button (Web Share API)
- Confetti animation on result reveal
- Dark/light mode toggle, persisted in localStorage
- Daily decision count tracker (resets at midnight), stored in localStorage
- Sound effect on spin using Web Audio API (synthesized tone, no external files)
- Mobile-first responsive layout

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Create React components: App, SpinWheel (canvas-based), QuickDecisions, ResultCard, ConfettiCanvas, ThemeToggle, DecisionCounter
2. Implement wheel physics: random target angle, ease-out cubic deceleration over ~4s
3. Implement localStorage hooks for options, theme, daily count
4. Wire up response pools for all 4 quick decision categories
5. Web Audio API spin sound (oscillator sweep)
6. Confetti: particle system rendered on a floating canvas
7. Responsive CSS with OKLCH tokens, gradient backgrounds, glassmorphism cards
