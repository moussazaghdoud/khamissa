# Cognitive Reset - Project Context

## Overview
Web app combining CBT (Cognitive Behavioral Therapy), neuroscience-based rumination interruption, and Islamic spiritual reflection to help break destructive thought loops. All UI in **French** (simple, short sentences, gentle tone — user may have low concentration). Spiritual content in Arabic + French translation.

**App Name:** Cognitive Reset
**Subtitle:** Retrouver la paix interieure, une etape a la fois

## Tech Stack
- **Framework:** Next.js 15.5.12 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (using `@tailwindcss/postcss`)
- **Storage:** LocalStorage (no backend database)
- **Audio:** Streams from everyayah.com CDN (40+ calming verses) + local MP3 fallback + HTML5 Audio API
- **Deployment:** Railway (from GitHub)
- **Repo:** https://github.com/moussazaghdoud/khamissa

## Project Structure
```
src/
  app/
    layout.tsx          # Root layout (lang="fr", Inter font, includes EmergencyCalm)
    page.tsx            # Home - feeling-based guided navigation ("Comment vous sentez-vous?")
    globals.css         # Custom CSS vars, animations (breathe, fade-in, pulse-glow)
    interrupt/page.tsx  # 5-step guided CBT reset process
    journal/page.tsx    # Daily Reality Journal (3 prompts)
    journey/page.tsx    # Guided Daily Journey (Matin/Midi/Soir/Nuit)
    calm/page.tsx       # 2-min breathing animation + dhikr audio
    compassion/page.tsx # Self-compassion letter to past self
    isaac/page.tsx      # "Pour mon fils Isaac" - 5 guided guilt exercises
    timer/page.tsx      # Rumination timer (schedule worry time)
  components/
    NavBar.tsx          # Bottom nav (5 items: Accueil, Parcours, Reset, Calme, Isaac)
    SpiritualReminder.tsx # Quranic verse card with audio play/loop buttons
    EmergencyCalm.tsx   # Floating "Je suis mal" button + 4-step calming protocol (always visible)
  lib/
    audio.ts            # Streams from everyayah.com CDN, local MP3 fallback, mobile unlock
    spiritual-data.ts   # Quranic verses (arabic + french + verseKey), dhikr items
    storage.ts          # LocalStorage: journal, thoughts, compassion, timer, isaac, journey
public/
  audio/
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

## 9 Core Features
1. **Rumination Interrupt** (`/interrupt`) - 5-step CBT: write thought > fact vs fear > evidence > friend advice > alternative thought. Includes thought pattern detection (warns if same thought appears 3+ times).
2. **Daily Reality Journal** (`/journal`) - 3 daily prompts: what I did, what went well, negative thought. Shows "Alhamdulillah" on save.
3. **Guided Daily Journey** (`/journey`) - Structured daily flow in 4 time slots:
   - Matin (2min): breathing + dhikr + intention question
   - Midi (1min): mental check — links to /interrupt if stuck
   - Soir (3min): 3 journal questions (auto-saves to journal storage)
   - Nuit (2min): breathing + dhikr + calming verse
   Suggests the right step based on current hour. Tracks daily completion.
4. **Rumination Timer** (`/timer`) - Schedule specific "thinking time" (time + duration). Outside window shows "Vous pouvez laisser cette pensee se reposer."
5. **Self-Compassion** (`/compassion`) - Write a letter to past self. Saves history.
6. **Calm Mode** (`/calm`) - 2-min session: breathing animation (inhale 4s/hold 4s/exhale 6s) + selectable dhikr + looping audio.
7. **Thought Pattern Detection** - Built into interrupt flow, detects recurring thoughts via word matching.
8. **Emergency Calm Button** - Floating "Je suis mal" button visible on every screen. Launches a 4-step calming protocol: breathing, dhikr audio, cognitive grounding, Quranic reminder (Quran 65:3).
9. **Isaac Module** (`/isaac`) - "Pour mon fils Isaac" — 5 guided CBT exercises for parental guilt:
   1. Reconnaitre la realite (what you still did for him)
   2. Repenser la culpabilite (would you judge a sick mother?)
   3. Message pour Isaac (what do you want him to feel?)
   4. Petites actions presentes (suggestions: read, hug, talk, spend time)
   5. Lacher le passe (Isaac lives with you today)
   Progress bar, therapeutic messages, Quranic verses at each step.

## Audio System
### CDN Streaming (primary)
- 40+ calming Quranic verses streamed from everyayah.com (Mishary Alafasy, 128kbps)
- Verses categorized: mercy, ease, remembrance, trust, gentleness, patience, forgiveness
- Single play: random verse. Loop: shuffles through all verses.
- Each SpiritualReminder has a `verseKey` mapping to specific verse audio

### Local Fallback
- 4 dhikr clips (~10s each, calm tasbih from archive.org, gentle fade in/out)
- 7 verse MP3s as offline fallback

### Mobile Compatibility
- Audio unlock on first touch/click (silent audio trick for iOS/Android)
- Pure HTML5 Audio — no Web Audio API dependency

## Design
- Warm calming palette: sage greens, warm neutrals, soft accents
- CSS variables: --primary (#7c9a8e), --accent (#d4a574), --surface-warm (#f5f0eb)
- Breathing animation: color transitions between inhale (sage green) and exhale (warm amber), smooth 2s transition
- Mobile-first, bottom navigation with 48x48px touch targets
- `touch-manipulation` on all interactive elements (no 300ms tap delay)
- Safe area insets for notched phones
- Animations: breathe, fade-in, pulse-glow, audio-pulse
- Rounded corners (2xl/3xl), large typography, minimal UI
- Homepage: feeling-based guided navigation ("Comment vous sentez-vous?")

## Spiritual Data
- 6 Quranic reminders (arabic + french + reference + verseKey for audio)
- 4 dhikr items (arabic + transliteration + french meaning)
- References use "Coran" (French) not "Quran"

## Key Decisions
- No backend/database — all data in localStorage
- Audio streams from everyayah.com CDN, local MP3s as offline fallback
- Audio sources: everyayah.com (verses), archive.org (dhikr clips)
- French-only UI (user requirement, simple language for low concentration)
- Quotes use French guillemets (laquo/raquo)
- Dates formatted with `fr-FR` locale
- NavBar: 5 items (Accueil, Parcours, Reset, Calme, Isaac)
- EmergencyCalm component handles global audio unlock via touchstart/click
- Journey evening step auto-saves answers to journal storage (reuses existing JournalEntry)
