export const repos = [
  {
    slug: "revenuetwin",
    name: "RevenueTwin",
    language: "Python",
    tags: [
      "Python",
      "Streamlit",
      "Amazon Bedrock",
      "boto3",
      "AWS S3",
      "Deterministic fee engine",
      "unittest",
    ],
    kind: "Hackathon Winner",
    affiliation: "LPL Financial Hackathon 2026 · 1st Place Track Winner",
    pitch:
      "AI revenue audit that checks whether advisory agreements and actual billing stay aligned, with deterministic math for fees and Bedrock for evidence-grounded investigation.",
    github: "https://github.com/martintran23/RevenueTwin",
    live: null,
    problem:
      "Fee, agreement, exception, and billing misalignment is hard to explain manually and can create underbilling or overbilling risk for advisory practices.",
    built: [
      "Streamlit demo UI to a ui.services boundary, then revenue_engine (Decimal fee math), investigation (Bedrock tool-use agent), and integration (S3 evidence/reviews, AWS mode).",
      "Local vs AWS backends (REVENUE_BACKEND=local|aws) without silent mock success in AWS mode.",
      "Humans decide actions; AI recommends; agent tools are read-only (get_revenue_case, get_case_evidence).",
    ],
    role: [
      "Built the Amazon Bedrock Converse tool-use investigation scaffold (boto3) wired to the deterministic fee engine.",
      "Hardened the Morgan conflicting-evidence path against cross-case bleed and overconfident statuses (prompts, acceptance checks, normalize_morgan_result, unit tests).",
      "Merged AI/Bedrock investigation work into main and enforced service boundaries so Bedrock cannot own fee arithmetic or record_review.",
    ],
    outcome: [
      "1st Place Track Winner, Startup We'd Buy Tomorrow (LPL Financial Hackathon 2026).",
      "Working Anderson vertical slice and investigation package on main. Demo cases are synthetic, not production SaaS metrics.",
    ],
    tree: `revenuetwin/
├── architecture.md          # Streamlit → services → engine / investigation / AWS
├── investigation/
│   ├── investigate.py       # Bedrock Converse tool loop + structured Investigation
│   └── morgan.py            # Conflicting-evidence hardening + normalization
├── revenue_engine/
│   └── calculations.py      # Decimal fee math (LLM never owns arithmetic)
├── integration/             # S3 evidence, reviews, paced Bedrock (team AWS path)
└── what-id-redo.md          # Stronger CI, clearer ownership of agent steps, production auth`,
  },
  {
    slug: "wecalendar",
    name: "WeCalendar",
    language: "TypeScript",
    tags: [
      "Next.js",
      "React",
      "TypeScript",
      "Supabase",
      "Postgres",
      "RLS",
      "Realtime",
      "TipTap",
      "Leaflet",
      "Vitest",
      "GitHub Actions",
      "Vercel",
    ],
    kind: "Personal",
    badges: ["Live Demo"],
    affiliation: "Personal Project · Aug 2026",
    pitch:
      "Shared calendar, notes, and map for invite-code workspaces, with realtime sync, RSVPs, in-app notifications, and ICS import.",
    github: "https://github.com/martintran23/WeCalendar",
    live: "https://we-calendar.vercel.app",
    problem:
      "Shared schedules and lists get stuck in texts and screenshots; groups need one workspace for events, conflicts, places, and collaborative notes.",
    built: [
      "Next.js App Router plus Supabase (Auth, Postgres, RLS, Realtime, Storage for avatars).",
      "Invite-code workspaces; day/week/month/year calendar; UI conflict highlighting; event tags.",
      "TipTap Notes (folders, private/shared, event and place linking, trash, sort, drag-and-drop).",
      "Shared Map pins linked to events/notes, geolocation, and nearby place search.",
      "Going / Maybe / Declined RSVPs; notification bell and availability nudges.",
      "One-way ICS subscribe, upload, and export with SSRF-safe fetch (not OAuth).",
      "Account leave / export / delete; Vercel plus GitHub Actions (typecheck, lint, 184 unit tests, production build).",
    ],
    role: [
      "End-to-end ownership of product, schema, RLS, and UI.",
      "14 public tables, 20 SQL migrations; Realtime on 11 tables, app subscribed to 9.",
      "Replaced the old exclusive-time write reject with overlap-tolerant conflict UX.",
      "Notes is the writing surface; lists tables remain but have no product UI.",
      "Map, RSVP, notifications, and ICS sync designed and shipped as later phases.",
    ],
    outcome: [
      "Live multi-user shared calendar, notes, and map product.",
      "CI runs typecheck, lint, Vitest (14 files / 184 tests), and a production build on every PR.",
    ],
    tree: `wecalendar/
├── architecture.md          # AppShell, workspace invites, Supabase clients
├── supabase/migrations/     # RLS, places, RSVPs, notifications, ICS sync
├── notes/
│   ├── editor.tsx           # TipTap + debounced autosave
│   └── folders.ts           # Shared/private folders, DnD, trash
├── calendar/                # Month/week/day/year + conflict UX + RSVPs
├── map/                     # Leaflet pins, geolocation, place search
├── notifications/           # Bell, prefs, availability nudges
└── ics/                     # Subscribe, upload, export (SSRF-safe fetch)`,
  },
  {
    slug: "watttime",
    name: "WattTime",
    language: "TypeScript",
    tags: [
      "React",
      "TypeScript",
      "Vite",
      "AWS Lambda",
      "Step Functions",
      "API Gateway",
      "Amplify",
      "Open-Meteo",
      "LLM recommendations",
    ],
    kind: "Hackathon",
    affiliation: "AWS Cloudhacks 2026 at UCI · Apr 2026",
    pitch:
      "Solar usage optimizer that recommends the best times to run household appliances from forecasted solar availability.",
    github: "https://github.com/martintran23/zotwatt",
    live: null,
    problem:
      "Solar output fluctuates through the day; households don't know when to run high-load appliances, so they underuse renewables and lean on the grid.",
    built: [
      "React, TypeScript, and Vite dashboard with address search, forecast, impact, schedule, and SMS / notification flows.",
      "AWS serverless pipeline: API Gateway and Step Functions orchestrating fetch, analyze, and format Lambdas.",
      "Open-Meteo weather and shortwave radiation into a solar potential model, then LLM JSON recommendations per appliance.",
      "Amazon Location Service / Places for geocoding. Amplify hosting. A separate daily orchestrator path for subscribed users.",
    ],
    role: [
      "Built the frontend dashboard and designed the Step Functions plus Lambda workflow.",
      "Tuned the analyze-path LLM prompts to cut end-to-end response time about 66% (45s to 15s).",
      "Added an optimize-first path with a fallback recommendation strategy when the primary pass was slow or incomplete.",
    ],
    outcome: [
      "AWS Cloudhacks 2026 delivery with a working solar recommendation pipeline.",
      "Quantified latency improvement: 45s to 15s on the recommendation path.",
      "Amplify demo hosting is expired; source remains on GitHub.",
    ],
    tree: `watttime/
├── architecture.md          # Vite app + Step Functions pipeline
├── src/
│   ├── dashboard/           # Forecast, impact, schedule, SMS, notifications
│   └── lib/                 # Open-Meteo, Places, solar model, optimize API
├── backend/
│   ├── lambdas/
│   │   ├── fetch-data/      # Open-Meteo weather + radiation (Python)
│   │   ├── analyze-data/    # Solar potential + LLM prompts
│   │   └── formatter/       # User-facing advice payload
│   └── step-functions/      # Optimize workflow + daily orchestrator
└── what-id-redo.md          # Usage learning, confidence scores, utility rates`,
  },
] as const;

export type Repo = (typeof repos)[number];

export function getRepo(slug: string) {
  return repos.find((repo) => repo.slug === slug);
}
