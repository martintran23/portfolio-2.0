# Portfolio 2.0

Desktop-style portfolio for [Martin Tran](https://martintranportfolio.vercel.app): a LinkedIn-inspired profile, a GitHub-inspired project browser, and a Gmail-inspired inbox.

Live site: [martintranportfolio.vercel.app](https://martintranportfolio.vercel.app)

This is a rewrite of my first [Pokémon Lab portfolio](https://martintran23.github.io/portfolio/). Structure lives in [CONCEPT.md](./CONCEPT.md). Locked copy lives in [COPY.md](./COPY.md).

## What you see

A first visit can open with a short, skippable intro (a power-on with the name Martin Tran, then a desktop with a Martin Tran folder). After that, three rooms sit on one stage. Each room has its own URL.

- **Profile** (`/`): name, headline, what I am looking for, about, internships at OpenQQuantify and Product Manager Accelerator, CSUF, skills, featured work, and a resume link
- **Projects** (`/work`): RevenueTwin, WeCalendar, and WattTime as selected repos, not a dump of every GitHub repo. Each opens a case-study README. Contribution, repository, and star counts come from public GitHub activity
- **Mail** (`/mail`): compose form that sends through Web3Forms, plus GitHub, LinkedIn, and `mailto:` if you would rather not use the form

Move between rooms with the dock, side arrows, left/right keys, or a swipe on a phone.

## Run locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Mail send needs `WEB3FORMS_ACCESS_KEY` in `.env`. Without it, the form still offers the Gmail / `mailto:` path.

## Stack

Next.js, React, TypeScript, and Tailwind. Hosted on Vercel.

## Links

- Live site: [martintranportfolio.vercel.app](https://martintranportfolio.vercel.app)
- First site: [martintran23.github.io/portfolio](https://martintran23.github.io/portfolio/)
- GitHub: [github.com/martintran23](https://github.com/martintran23)
- LinkedIn: [linkedin.com/in/23martintran](https://www.linkedin.com/in/23martintran)
- Email: [23martintran@gmail.com](mailto:23martintran@gmail.com)
