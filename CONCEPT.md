# Portfolio 2.0 concept

High-level reference for the site. The public README stays short; this file is the source of truth for structure, constraints, and build order.

## Pitch

A small desktop of three rooms, reached after a short boot.

Not a game, and not pixel clones of LinkedIn, GitHub, or Gmail. Steal those products' information architecture, then restyle them as one OS: profile, work, mail. Hiring managers can scan. Engineers can dig.

The old Pokémon Lab site stays a linked extra, not a required screen.

## Principles

- Default path is fast and readable. Interaction is optional.
- Inspired by, not clones. No official logos, hex dumps of those UIs, or fake-phishing compose windows.
- Experience lives on the profile screen. Do not add a fourth room for it.
- Every room has a URL (`/`, `/work`, `/mail`) so a screen can be sent as a link.
- Navigation is redundant: arrows, swipe, keyboard left/right, and a dock or dots.
- Boot is a beat, not a gate. Short on first visit, skippable, skipped on return visits.
- Contact must work without the form (`mailto`, GitHub, LinkedIn in the mail rail).

## Shell

```
[boot, skippable]
        ↓
┌──── Profile  /     ────┐  →  ┌──── Work  /work ────┐  →  ┌──── Mail  /mail ────┐
│ photo, headline        │     │ pinned repos        │     │ compose form        │
│ about                  │     │ README case study   │     │ socials rail        │
│ experience timeline    │     │ narrative file tree │     │                     │
└────────────────────────┘     └─────────────────────┘     └─────────────────────┘
              ← arrows / swipe / keys / dock →
```

Optional later: a dock icon to `/lab` (Pokémon Lab or other experiments). Not in v1.

## Rooms

### Profile (`/`)

LinkedIn-inspired: who I am, what I want, who I have been.

- Header: name, headline, location, "open to" line
- About: short, specific, not a bio dump
- Experience: roles, internships, programs as a timeline on this same screen
- Optional: featured work that routes to `/work`

This is the land-and-understand page. If someone never clicks an arrow, they still get intro, about, and experience.

### Work (`/work`)

GitHub-inspired: selected projects as repos, not a dump of every public repo.

List view:

- Name, one-line description, stack tags
- Pins for the few that matter (ZotWatt, Playscape Spatial, and similar)

Repo view (click in):

- README-style case study: problem, what I built, my role, outcome
- Link out to the real GitHub repo and live demo when they exist

Deeper view:

- A **narrative file tree**, not a clone of the real repo. Files exist to explain the system (`architecture.md`, `api/`, `what-id-redo.md`, a couple of highlighted source files).
- GitHub API can supply freshness (language, updated at). It should not be the whole UI.

### Mail (`/mail`)

Gmail-inspired compose, plus a labels-style rail for socials.

- Compose: name, email, message, send
- Rail: GitHub, LinkedIn, `mailto:` so the form is optional
- If send fails, fall back to `mailto:`

## Boot

- First visit only, ~1s, always skippable
- No content hidden behind it on repeat visits
- Can feel like an OS login/boot; keep it quiet

## Out of scope for v1

- Full GitHub/LinkedIn/Gmail visual clones
- WASD exploration or a 3D world on the main path
- A separate Experience room
- Pokémon Lab as a required room
- Showing every GitHub repo unfiltered

## Build order

1. **App shell**: three routes, dock/arrows/keyboard, no real content yet. Prove navigation and deep links.
2. **Profile**: copy + experience timeline. This is the page someone can send tomorrow.
3. **Work list + README drill-in**: static project data in the repo. No API yet.
4. **Mail**: form + social rail. Wire email later if needed; `mailto:` is enough at first.
5. **Polish**: boot screen, motion between rooms, narrative file trees, then GitHub freshness if it still feels worth it.

## Content to gather before UI polish

- One headline and one "what I am looking for" sentence
- About paragraph (5–8 lines)
- Experience bullets per role (not full LinkedIn paste)
- 3–5 projects with: one-liner, problem, role, stack, links
- For each featured project, a few "files" to show in the tree
