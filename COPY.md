# Portfolio 2.0 copy deck

Content source of truth. Structure and constraints stay in [CONCEPT.md](./CONCEPT.md).

Sourced from the [Pokémon Lab portfolio](https://martintran23.github.io/portfolio) and `assets/resume.pdf`.

**Person:** Martin Long Hoang Tran (Martin Tran)

## Display defaults

Use these on the site unless a later note overrides them.

- **Headline:** Software engineer building backend systems, cloud workflows, and applied AI.
- **Name on Profile:** Martin Tran
- **Featured projects (order):** RevenueTwin, WeCalendar, WattTime
- **WeCalendar GitHub:** `https://github.com/martintran23/WeCalendar`
- **WattTime live demo:** include `https://main.d3aftn56t13u83.amplifyapp.com`
- **Pokémon Lab:** not on the site; not a featured Projects card
- **Phone:** keep off Mail unless you later choose to show it
- **Audience:** SWE intern recruiting. Do not present as a full-time engineer.
- **Never on site:** Pairnrd, H15DEN, NASA L'SPACE

---

## Profile (`/`)

### Headline

Software engineer building backend systems, cloud workflows, and applied AI.

Alt options (not default):

- CS student @ CSUF building full-stack products with AWS and applied AI
- Backend-minded software engineer focused on reliable systems and AI tooling

### Looking for

Spring 2027 internships and co-ops · Software Engineering / AI Engineering

Looking for a Spring 2027 Software Engineering or AI Engineering internship or co-op with real ownership: backend systems I can take end to end, and applied AI I can own the same way.

### About

I'm Martin Tran, a Computer Science student at Cal State Fullerton and software engineer specializing in resilient backend systems, cloud architectures, and applied AI tooling.

Most of my work is centered around AI and ML applications, but I love exploring new tech and picking up whatever a project needs. I am open to learning new tools and fields along the way.

Right now, I'm working towards finishing my bachelor's degree, participating in hackathons, developing personal projects, and collaborating on an industry capstone with RTX. Outside of that, I'm usually building something small to try a new idea or clean up how a system fits together.

I'm currently looking for teams where I can own a real slice of the product, from how the data moves around to how people actually use it. I learn fastest when the work is concrete and I can see what breaks.

Profile can show the first two paragraphs by default and the rest behind "see more."

### Experience

#### Software Development Intern · OpenQQuantify · Remote / Vienna, VA

May 2025 - Oct 2025

Worked on an AI health assistant that answered questions from FDA drug label data, spanning the data pipeline, APIs, and chat interface.

#### AI Engineer Intern · Product Manager Accelerator · Remote

Jun 2025 - Sep 2025

On the Pokémon site as "AI Engineer Intern". LinkedIn: Software Engineer Intern - AI/ML. Use **AI Engineer Intern** here.

Worked on the backend for Kyrah AI, an emotional support and journaling product, including how journal entries and chat history were stored and served.

Do not add Pairnrd, H15DEN, or NASA L'SPACE here.

### Education

B.S. Computer Science, Concentration in Artificial Intelligence and Machine Learning  
Cal State University, Fullerton · Expected Dec 2027

Education is CSUF only. No programs block.

### Skills

Use as compact chips, not a resume dump.

- **Languages:** Python, TypeScript, JavaScript, SQL
- **Frameworks and tools:** Next.js, React, Node.js, FastAPI, Flask, Tailwind, Vitest, Streamlit, boto3, Postman, Git
- **Databases:** MongoDB, PostgreSQL, Supabase
- **Cloud and DevOps:** AWS (Bedrock, S3, API Gateway, Step Functions, Amplify), Vercel, REST APIs, CI/CD, Docker, Linux/Unix

### Optional Profile flavor (not required)

From the lab clipboard:

- Travel to Japan => This summer + Korea!! [Done!]
- See the giant redwood trees at Redwood National Park => ???
- Going back to Seattle => ???
- Grading some cards from my personal collection => Taking forever... [In Progress]

AFK easter egg (game): "Time to go job searching..."

---

## Projects (`/work`)

Three featured repos. Strongest signal first. Pokémon Lab is not in this list.

### Activity overview

Contribution, repository, and star counts come from public GitHub activity.

### 1. RevenueTwin

- **Tags:** Python, Streamlit, Amazon Bedrock, boto3, AWS S3, Deterministic fee engine, unittest
- **Affiliation:** LPL Financial Hackathon 2026 · 1st Place Track Winner, Startup We'd Buy Tomorrow · Oct 2026
- **Pitch:** AI revenue audit that checks whether advisory agreements and actual billing stay aligned, with deterministic math for fees and Bedrock for evidence-grounded investigation.
- **GitHub:** https://github.com/martintran23/RevenueTwin
- **Live demo:** none listed

#### Case study

**Problem**  
Fee / agreement / exception / billing misalignment is hard to explain manually and can create underbilling or overbilling risk for advisory practices.

**What was built**

- Streamlit demo UI → `ui.services` boundary → `revenue_engine` (Decimal fee math) + investigation (Bedrock tool-use agent) + integration (S3 evidence/reviews, AWS mode).
- Local vs AWS backends (`REVENUE_BACKEND=local|aws`) without silent mock success in AWS mode.
- Humans decide actions; AI recommends; agent tools are read-only (`get_revenue_case`, `get_case_evidence`).

**Role**

- Built the Amazon Bedrock Converse tool-use investigation scaffold (boto3) wired to the deterministic fee engine.
- Hardened the Morgan conflicting-evidence path against cross-case bleed / overconfident statuses (prompts, acceptance checks, `normalize_morgan_result`, unit tests).
- Merged AI/Bedrock investigation work into main; enforced service boundaries so Bedrock cannot own fee arithmetic or `record_review`.

**Outcome**

- 1st Place Track Winner, Startup We'd Buy Tomorrow (LPL Financial Hackathon 2026).
- Working Anderson vertical slice + investigation package on main; synthetic demo cases, not production SaaS metrics.
- Do not invent recovered-cash KPIs. Synthetic Anderson figures ($12k expected / $9k actual / $3k potential underbilling) stay labeled synthetic if shown.

#### Narrative file tree

```
revenuetwin/
├── architecture.md          # Streamlit → services → engine / investigation / AWS
├── investigation/
│   ├── investigate.py       # Bedrock Converse tool loop + structured Investigation
│   └── morgan.py            # Conflicting-evidence hardening + normalization
├── revenue_engine/
│   └── calculations.py      # Decimal fee math (LLM never owns arithmetic)
├── integration/             # S3 evidence, reviews, paced Bedrock (team AWS path)
└── what-id-redo.md          # Stronger CI, clearer ownership of agent steps, production auth
```

### 2. WeCalendar

- **Tags:** Next.js, React, TypeScript, Supabase, Postgres, RLS, Realtime, TipTap, Leaflet, Vitest, GitHub Actions, Vercel
- **Affiliation:** Personal Project · Aug 2026
- **Pitch:** Shared calendar, notes, and map for invite-code workspaces, with realtime sync, RSVPs, in-app notifications, and ICS import.
- **GitHub:** https://github.com/martintran23/WeCalendar
- **Alternate org (resume only, not default):** https://github.com/WeCalendar1/WeCalendar
- **Live:** https://we-calendar.vercel.app

#### Case study

**Problem**  
Shared schedules and lists get stuck in texts and screenshots; groups need one workspace for events, conflicts, places, and collaborative notes.

**What was built**

- Next.js App Router + Supabase (Auth, Postgres, RLS, Realtime, Storage for avatars).
- Invite-code workspaces; day/week/month/year calendar; UI conflict highlighting; event tags.
- TipTap Notes (folders, private/shared, event and place linking, trash, sort, drag-and-drop).
- Shared Map pins linked to events/notes, geolocation, nearby place search.
- Going / Maybe / Declined RSVPs; notification bell and availability nudges.
- One-way ICS subscribe, upload, and export with SSRF-safe fetch (not OAuth).
- Account leave / export / delete; Vercel + GitHub Actions (typecheck, lint, 184 unit tests, production build).

**Role**

- End-to-end ownership of product, schema, RLS, and UI.
- 14 public tables, 20 SQL migrations; Realtime on 11 tables, app subscribed to 9.
- Replaced the old exclusive-time write reject with overlap-tolerant conflict UX.
- Notes is the writing surface; lists tables remain but have no product UI.
- Map, RSVP, notifications, and ICS sync designed and shipped as later phases.

**Outcome**

- Live multi-user shared calendar, notes, and map product.
- CI runs typecheck, lint, Vitest (14 files / 184 tests), and a production build on every PR.

#### Narrative file tree

```
wecalendar/
├── architecture.md          # AppShell, workspace invites, Supabase clients
├── supabase/migrations/     # RLS, places, RSVPs, notifications, ICS sync
├── notes/
│   ├── editor.tsx           # TipTap + debounced autosave
│   └── folders.ts           # Shared/private folders, DnD, trash
├── calendar/                # Month/week/day/year + conflict UX + RSVPs
├── map/                     # Leaflet pins, geolocation, place search
├── notifications/           # Bell, prefs, availability nudges
└── ics/                     # Subscribe, upload, export (SSRF-safe fetch)
```

### 3. WattTime (repo: ZotWatt)

- **Tags:** React, TypeScript, Vite, AWS Lambda, Step Functions, API Gateway, Amplify, Open-Meteo, LLM recommendations
- **Affiliation:** AWS Cloudhacks 2026 at UCI · Apr 2026
- **Pitch:** Solar usage optimizer that recommends the best times to run household appliances from forecasted solar availability.
- **GitHub:** https://github.com/martintran23/zotwatt
- **Live:** https://main.d3aftn56t13u83.amplifyapp.com

#### Case study

**Problem**  
Solar output fluctuates through the day; households don't know when to run high-load appliances, so they underuse renewables and lean on the grid.

**What was built**

- React + TypeScript + Vite dashboard (address search / geolocation, forecasts, recommendations).
- AWS serverless orchestration: API Gateway + Step Functions + Lambda (fetch → analyze → format).
- Open-Meteo hourly weather + shortwave radiation → solar potential → LLM-structured appliance advice.
- Daily automation path for subscribed users / email-style recommendations.
- Geocoding via Amazon Location Service; deploy via AWS Amplify + CI/CD.

**Role**

- Built frontend + designed serverless backend workflow.
- Optimized LLM prompt / inference path to cut response time 66% (45s → 15s).
- Resilient orchestration, optimize-first + fallback recommendation strategy.

**Outcome**

- Hackathon delivery with a working solar recommendation pipeline.
- Quantified latency improvement: 45s → 15s.

#### Narrative file tree

```
watttime/
├── architecture.md          # Vite app + Step Functions pipeline
├── pipeline/
│   ├── fetch/               # Open-Meteo weather + radiation
│   ├── analyze/             # Solar potential + LLM recommendations
│   └── format/              # User-facing advice + daily automation
├── frontend/dashboard/      # Geo search, forecast views, impact flows
└── what-id-redo.md          # Usage learning, confidence scores, utility rates
```

### Not a featured Projects card

**Pokémon Lab Portfolio** · HTML/CSS/JS · https://martintran23.github.io/portfolio

Interactive FireRed/LeafGreen-style lab. Use as About personality / a dock extra, not as an engineering case study.

---

## Mail (`/mail`)

**CTA:** Email me at 23martintran@gmail.com or reach out on LinkedIn.

| Channel | Value | Show |
| --- | --- | --- |
| Email | 23martintran@gmail.com | Yes |
| LinkedIn | https://www.linkedin.com/in/23martintran/ | Yes |
| GitHub | https://github.com/martintran23 | Yes |
| Current portfolio | https://martintran23.github.io/portfolio | Optional |
| Phone | (714) 400-1091 | No (resume only unless you opt in) |

---

## Excluded

- **Pairnrd** and **H15DEN:** not on the site. Intern-targeting Profile should not read as a full-time SWE role.
- **NASA L'SPACE:** not on the site. Not Experience, not Education.
