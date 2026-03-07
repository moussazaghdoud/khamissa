# Cognitive Reset - Project Context

## Overview
Web app combining CBT (Cognitive Behavioral Therapy), neuroscience-based rumination interruption, and Islamic spiritual reflection to help break destructive thought loops. All UI in **French**, spiritual content in Arabic + French translation.

**App Name:** Cognitive Reset
**Subtitle:** Guerir l'esprit par la reflexion et le rappel

## Tech Stack
- **Framework:** Next.js 15.5.12 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (using `@tailwindcss/postcss`)
- **Storage:** LocalStorage (no backend database)
- **Audio:** Real MP3 recitations (human voice) + HTML5 Audio API
- **Deployment:** Railway (from GitHub)
- **Repo:** https://github.com/moussazaghdoud/khamissa

## Project Structure
```
src/
  app/
    layout.tsx          # Root layout (lang="fr", Inter font, includes EmergencyCalm)
    page.tsx            # Home - main CTA "Je suis bloque dans une pensee"
    globals.css         # Custom CSS vars, animations (breathe, fade-in, pulse-glow)
    interrupt/page.tsx  # 5-step guided CBT reset process
    journal/page.tsx    # Daily Reality Journal (3 prompts)
    calm/page.tsx       # 2-min breathing animation + dhikr audio
    compassion/page.tsx # Self-compassion letter to past self
    timer/page.tsx      # Rumination timer (schedule worry time)
  components/
    NavBar.tsx          # Bottom nav (6 items: Accueil, Reset, Journal, Calme, Lettre, Minuteur)
    SpiritualReminder.tsx # Quranic verse card with audio play/loop buttons
    EmergencyCalm.tsx   # Floating "Je suis mal" button + 4-step calming protocol (always visible)
  lib/
    audio.ts            # HTML5 Audio playback for MP3 files, mobile unlock
    spiritual-data.ts   # Quranic verses (arabic + french + verseKey), dhikr items
    storage.ts          # LocalStorage helpers for journal, thoughts, compassion, timer
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

## 7 Core Features
1. **Rumination Interrupt** (`/interrupt`) - 5-step CBT: write thought > fact vs fear > evidence > friend advice > alternative thought. Includes thought pattern detection (warns if same thought appears 3+ times).
2. **Daily Reality Journal** (`/journal`) - 3 daily prompts: what I did, what went well, negative thought. Shows "Alhamdulillah" on save.
3. **Rumination Timer** (`/timer`) - Schedule specific "thinking time" (time + duration). Outside window shows "Vous pouvez laisser cette pensee se reposer."
4. **Self-Compassion** (`/compassion`) - Write a letter to past self. Saves history.
5. **Calm Mode** (`/calm`) - 2-min session: breathing animation (inhale 4s/hold 4s/exhale 6s) + selectable dhikr + looping audio.
6. **Thought Pattern Detection** - Built into interrupt flow, detects recurring thoughts via word matching.
7. **Emergency Calm Button** - Floating "Je suis mal" button visible on every screen. Launches a 4-step calming protocol: breathing (4s inhale/6s exhale, 30s auto-advance), dhikr audio playback, cognitive grounding prompt ("Quelle pensee vous fait mal?"), and final Quranic reminder (Quran 65:3) with reassurance.

## Audio System
### Dhikr (human voice recitations)
- 4 clips (~10s each, 128kbps MP3) extracted from calm tasbih recording (archive.org)
- Gentle fade in (1.5s) and fade out (2.5s) for peaceful feel
- Mapped by index: 0=SubhanAllah, 1=Alhamdulillah, 2=Allahu Akbar, 3=Hasbiya Allah

### Quranic Verses (Mishary Alafasy)
- 7 individual ayah recitations from everyayah.com (free, high quality)
- Each SpiritualReminder has a `verseKey` (e.g. "013028") mapping to its audio file
- Played via HTML5 Audio element

### Mobile Compatibility
- Audio unlock on first touch/click (silent audio trick for iOS/Android)
- No Web Audio API dependency — pure HTML5 Audio for reliability

## Design
- Warm calming palette: sage greens, warm neutrals, soft accents
- CSS variables: --primary (#7c9a8e), --accent (#d4a574), --surface-warm (#f5f0eb)
- Mobile-first, bottom navigation with 48x48px touch targets
- `touch-manipulation` on all interactive elements (no 300ms tap delay)
- Safe area insets for notched phones
- Animations: breathe, fade-in, pulse-glow, audio-pulse
- Rounded corners (2xl/3xl), large typography, minimal UI

## Spiritual Data
- 6 Quranic reminders (arabic + french + reference + verseKey for audio)
- 4 dhikr items (arabic + transliteration + french meaning)
- References use "Coran" (French) not "Quran"

## Key Decisions
- No backend/database — all data in localStorage
- Real MP3 audio files (human voice) instead of synthesized tones
- Audio sources: everyayah.com (Quranic verses), archive.org (dhikr clips)
- French-only UI (user requirement)
- Quotes use French guillemets (laquo/raquo)
- Dates formatted with `fr-FR` locale
- Nav label "Compassion" shortened to "Lettre" for mobile space
- EmergencyCalm component handles global audio unlock via touchstart/click
