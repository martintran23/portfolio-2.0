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
    live: "https://main.d3aftn56t13u83.amplifyapp.com",
    problem:
      "Solar output fluctuates through the day; households don't know when to run high-load appliances, so they underuse renewables and lean on the grid.",
    built: [
      "React, TypeScript, and Vite dashboard (address search / geolocation, forecasts, recommendations).",
      "AWS serverless orchestration: API Gateway, Step Functions, and Lambda (fetch, analyze, format).",
      "Open-Meteo hourly weather and shortwave radiation to solar potential to LLM-structured appliance advice.",
      "Daily automation path for subscribed users. Geocoding via Amazon Location Service. Deploy via AWS Amplify and CI/CD.",
    ],
    role: [
      "Built the frontend and designed the serverless backend workflow.",
      "Optimized the LLM prompt / inference path to cut response time 66% (45s to 15s).",
      "Resilient orchestration with an optimize-first plus fallback recommendation strategy.",
    ],
    outcome: [
      "Hackathon delivery with a working solar recommendation pipeline.",
      "Quantified latency improvement: 45s to 15s.",
    ],
  },
] as const;

export type Repo = (typeof repos)[number];

export function getRepo(slug: string) {
  return repos.find((repo) => repo.slug === slug);
}
