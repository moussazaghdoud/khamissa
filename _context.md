# J'aide maman à guérir - Project Context

## Overview
Web app where **Isaac (the son) guides his mother** through CBT (Cognitive Behavioral Therapy), neuroscience-based rumination interruption, and Islamic spiritual reflection to help break destructive thought loops. All UI in **French** using informal "tu/toi" (Isaac speaking directly to maman). Simple, short sentences, gentle tone — user may have low concentration. Spiritual content in Arabic + French translation.

**App Name:** J'aide maman à guérir
**Subtitle:** Isaac t'accompagne, une étape à la fois

## Emotional Context
The mother was always loving and caring with Isaac. She is NOT harsh with herself or her son. Her pain is **deep regret that during her depression, she couldn't do MORE** for him. Isaac's tone is:
- **Grateful & reassuring**: "Tu étais là pour moi même quand tu souffrais"
- **Never implying she was harsh** — she was always gentle
- **Acknowledging what she DID do**, not what she didn't
- Avoid: "sois douce", "tu te juges", "pourquoi es-tu dure avec toi-même"

## Tech Stack
- **Framework:** Next.js 15.5.12 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (using `@tailwindcss/postcss`)
- **Storage:** LocalStorage (no backend database)
- **Audio:** Streams from everyayah.com CDN (40+ calming verses) + local MP3 fallback + lawn mower ambient + HTML5 Audio API
- **Deployment:** Railway (from GitHub)
- **Repo:** https://github.com/moussazaghdoud/khamissa

## Project Structure
```
src/
  app/
    layout.tsx          # Root layout (lang="fr", Inter font, includes EmergencyCalm)
    page.tsx            # Home - Isaac's photo (large) + feeling-based navigation ("Comment te sens-tu?")
    globals.css         # CSS vars, animations, inhale/exhale colors (--inhale/#3a8f7d, --exhale/#d4764e)
    interrupt/page.tsx  # 5-step guided CBT reset process (Isaac guides)
    journal/page.tsx    # Daily Reality Journal (3 prompts, Isaac asks)
    journey/page.tsx    # Guided Daily Journey (Matin/Midi/Soir/Nuit)
    calm/page.tsx       # 2-min breathing animation + dhikr audio + tondeuse ambient
    compassion/page.tsx # Letter to the maman who went through depression
    isaac/page.tsx      # 5 guided exercises — Isaac speaks in first person
    timer/page.tsx      # Rumination timer (schedule worry time)
  components/
    NavBar.tsx          # Bottom nav (5 items: Accueil, Parcours, Reset, Calme, Isaac)
    IsaacCompanion.tsx  # Isaac's photo component (small companion or large hero), with optional speech bubble
    SpiritualReminder.tsx # Quranic verse card with audio play/loop buttons
    EmergencyCalm.tsx   # Floating "J'angoisse" button + 4-step calming protocol (always visible)
  lib/
    audio.ts            # CDN streaming, local fallback, mobile unlock, tondeuse ambient, preload
    spiritual-data.ts   # Quranic verses (arabic + french + verseKey), dhikr items
    storage.ts          # LocalStorage: journal, thoughts, compassion, timer, isaac, journey
public/
  isaac.png             # Photo of Isaac (displayed on homepage large, small companion on all pages)
  audio/
    tondeuse.mp3        # Gentle lawn mower ambient sound (looping, low volume white noise)
    dhikr/              # Human voice dhikr clips (~10s each, 128kbps, fade in/out)
      dhikr-subhanallah.mp3
      dhikr-alhamdulillah.mp3
      dhikr-allahu-akbar.mp3
      dhikr-hasbiyallah.mp3
    verses/             # Quranic verse recitations by Mishary Alafasy (everyayah.com)
      094006.mp3        # Coran 94:6 - Fa inna ma'al usri yusra
      013028.mp3        # Coran 13:28 - Ala bi dhikri Allah
      065003.mp3        # Coran 65:3 - Wa man yatawakkal
      007156.mp3        # Coran 7:156 - Wa rahmati wasi'at
      042019.mp3        # Coran 42:19 - Allah latifun bi ibadihi
      002286.mp3        # Coran 2:286 - La yukallifu Allah
      001002.mp3        # Coran 1:2 - Alhamdulillahi Rabbil Aalameen
```

## Isaac as Companion
- **Homepage**: Isaac's photo displayed large (144px circle) with no speech bubble, title "J'aide maman à guérir"
- **All other pages**: Small Isaac (40px) with contextual speech bubble message
- **Isaac module**: Isaac speaks in first person ("Maman, quelles choses tu as faites pour moi ?")
- **All text uses informal "tu/toi"** — Isaac talks directly to his mother
- **IsaacCompanion component**: `size="large"` for homepage hero, `size="small"` (default) for companion on other pages

## 9 Core Features
1. **Rumination Interrupt** (`/interrupt`) - 5-step CBT: Isaac guides maman through writing thought > fact vs fear > evidence > friend advice > alternative thought. Pattern detection warns if same thought appears 3+ times.
2. **Daily Reality Journal** (`/journal`) - 3 prompts asked by Isaac: what did you do today, what went well, negative thought. Shows "Alhamdulillah" on save.
3. **Guided Daily Journey** (`/journey`) - Structured daily flow in 4 time slots:
   - Matin (2min): breathing + dhikr + intention question
   - Midi (1min): mental check — links to /interrupt if stuck
   - Soir (3min): 3 journal questions (auto-saves to journal storage)
   - Nuit (2min): breathing + dhikr + calming verse
   Suggests the right step based on current hour. Tracks daily completion.
4. **Rumination Timer** (`/timer`) - Schedule specific "thinking time" (time + duration). Outside window Isaac says "Tu peux laisser cette pensée se reposer."
5. **Self-Compassion** (`/compassion`) - Write a message to the maman who went through depression. Framed as acknowledging what she DID do, not self-blame. Saves history.
6. **Calm Mode** (`/calm`) - 2-min session: breathing animation (inhale 4s/hold 4s/exhale 6s) + selectable dhikr + looping audio + **lawn mower ambient sound** option.
7. **Thought Pattern Detection** - Built into interrupt flow, detects recurring thoughts via word matching.
8. **Emergency Calm Button** - Floating "J'angoisse" button visible on every screen. Launches a 4-step calming protocol: breathing, dhikr audio, cognitive grounding, Quranic reminder (Quran 65:3).
9. **Isaac Module** (`/isaac`) - Isaac speaks directly to maman in first person — 5 guided exercises for parental regret (NOT guilt):
   1. Reconnaitre la réalité (what you still did for me despite being sick)
   2. Repenser les regrets (a sick mother who does her best deserves admiration, not regret)
   3. Message pour Isaac (what do you want me to feel from you today?)
   4. Petites actions présentes (suggestions: read to me, hug me, talk to me, spend time)
   5. Lâcher le passé (I live with you today, the present is where love acts)
   Progress bar, therapeutic messages, Quranic verses at each step.

## Audio System
### CDN Streaming (primary)
- 40+ calming Quranic verses streamed from everyayah.com (Mishary Alafasy, 128kbps)
- Verses categorized: mercy, ease, remembrance, trust, gentleness, patience, forgiveness
- Single play: random verse. Loop: shuffles through all verses.
- Each SpiritualReminder has a `verseKey` mapping to specific verse audio

### Ambient Sound
- Gentle lawn mower (`/audio/tondeuse.mp3`) — looping white noise at 35% volume
- Available as toggle button in Calm Mode breathing session
- Pre-loaded on first user interaction for mobile compatibility

### Local Fallback
- 4 dhikr clips (~10s each, calm tasbih from archive.org, gentle fade in/out)
- 7 verse MP3s as offline fallback

### Mobile Compatibility
- Audio unlock on first touch/click (silent audio trick for iOS/Android)
- Tondeuse pre-loaded via `preloadTondeuse()` on first user gesture
- Pure HTML5 Audio — no Web Audio API dependency (except bell sound)

## Design
- Warm calming palette: sage greens, warm neutrals, soft accents
- CSS variables: --primary (#7c9a8e), --accent (#d4a574), --surface-warm (#f5f0eb)
- **Breathing colors**: vivid teal (#3a8f7d / --inhale) for inhale, warm coral (#d4764e / --exhale) for exhale — highly visible contrast
- Mobile-first, bottom navigation with 48x48px touch targets
- `touch-manipulation` on all interactive elements (no 300ms tap delay)
- Safe area insets for notched phones
- Animations: breathe, fade-in, pulse-glow, audio-pulse
- Rounded corners (2xl/3xl), large typography, minimal UI
- Homepage: Isaac's large photo + feeling-based guided navigation

## Spiritual Data
- 6 Quranic reminders (arabic + french + reference + verseKey for audio)
- 4 dhikr items (arabic + transliteration + french meaning)
- References use "Coran" (French) not "Quran"

## Key Decisions
- No backend/database — all data in localStorage
- Audio streams from everyayah.com CDN, local MP3s as offline fallback
- Audio sources: everyayah.com (verses), archive.org (dhikr clips), freesound.org (tondeuse)
- French-only UI, informal "tu" (Isaac speaking to maman)
- Tone: reassuring, grateful — never implying maman was harsh or didn't do enough
- Quotes use French guillemets (laquo/raquo)
- Dates formatted with `fr-FR` locale
- NavBar: 5 items (Accueil, Parcours, Reset, Calme, Isaac)
- EmergencyCalm handles global audio unlock + tondeuse preload via touchstart/click
- Journey evening step auto-saves answers to journal storage (reuses existing JournalEntry)
