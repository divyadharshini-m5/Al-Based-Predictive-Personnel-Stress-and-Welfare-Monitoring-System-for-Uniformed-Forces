# Sahayak Companion

Build a mobile-first Progressive Web App (PWA) called "Sahayak Wellness" 

for uniformed forces personnel (CAPF/Armed Forces) — a private, supportive 

wellness companion app. NOT a surveillance tool. Personnel are aware the 

system exists for their welfare; they never see risk scores, flags, or 

any "you are stressed" style output — only their own personal trends.

Tech: React (PWA) + Firebase Auth/Firestore structure, with placeholder 

config (.env vars) and a clearly marked DEMO_MODE fallback so it runs 

standalone without real Firebase keys.

DEMO PROFILE

AUTH FLOW

- Splash screen (calming visual, app logo)

- Login: Service ID + Password

- Mock OTP verification screen (demo fallback)

- Firebase Auth wiring present but inactive until real config is added

NAVIGATION

Bottom tab bar, 4 tabs: Home | Assessment | Resources | Profile

SCREENS

1. HOME

- "Good morning, [Name]" greeting

- Quick mood check-in widget (5-emoji tap, one-tap logging) — optional, 

  never mandatory or guilt-inducing

- "My Wellness Trend" card — mini line graph, last 7 self-logged entries, 

  visible only to the user

- Button: "Take Full Assessment"

2. ASSESSMENT (self-assessment form)

- Sliders: sleep hours (0-12), workload feeling (1-5), mood (1-5)

- Optional free-text journal entry (private, never surfaced to officers 

  without the user's own support request)

- Submit → confirmation: "Thank you. This is private to you."

- Saves to checkins/{userId}/entries/{entryId}

3. RESOURCES

- Expandable cards: breathing exercises, sleep hygiene tips, stress-relief 

  techniques

- Helpline numbers (tap-to-call, placeholder numbers)

- "Request Support" button → confidential counseling request form, with 

  an anonymous toggle, saves to supportRequests/{requestId}

4. PROFILE

- Name, Service ID, Role (read-only, demo data: Arjun Mehta)

- Clear privacy statement: "Your check-ins are private and used only to 

  show you your own trends and to help Welfare Officers offer voluntary 

  support — never for discipline, and never shared as an individual 

  score without your own support request."

- Logout button

DATA MODEL (Firestore, shares project with Sahayak Command web dashboard)

- users/{userId}: name, serviceId, role

- checkins/{userId}/entries/{entryId}: date, mood, sleepHours, workload, journalText

- supportRequests/{requestId}: userId (or "anonymous"), timestamp, status

DESIGN

- Soft blue (#3c6e91) and soft green (#4a7c59) palette — no red/alarm colors

- Rounded cards, generous spacing, large tap targets, mobile-first

- Tone: supportive and calm throughout — avoid words like "risk", 

  "flagged", "monitoring", "surveillance" anywhere in the UI copy

- Bottom tab navigation matching: Home, Assessment, Resources, Profile

IMPORTANT ETHICAL CONSTRAINT

- Personnel must always be aware the app is a wellness tool and that they 

  are voluntarily logging data. Do not design any hidden data collection, 

  passive audio/location tracking, or "invisible" behavioral capture 

  within this app — any organizational-data analysis (leave patterns, 

  duty logs) happens on the backend/HR-system side, separate from this 

  app, not disguised within it.

Keep it functional for a hackathon demo: prioritize working core flow 

(login → check-in → view own trend → request support) over extra polish.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4740ae9a-46d8-437e-ae18-c433ac540099).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
