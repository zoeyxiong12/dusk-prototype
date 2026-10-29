# Dusk — work-in-progress prototype

Dusk turns everyday work notes into structured entries and work reports. This repository contains an early functional prototype; the portfolio presents a later design that is still being implemented.

## Current implementation

- Work notes are parsed into entries through a Groq API call.
- Entries can be reviewed and confirmed in the Today view. Confirmed entries currently remain in page state and reset on refresh.
- A separate Groq API call generates daily, weekly or monthly reports.
- Dashboard, Calendar and report pages include sample data. Reports currently use their own sample entries rather than a shared saved work log.
- Settings can be edited locally in the page; persistence is not connected.
- Supabase entry routes are present, but a complete authenticated storage flow is not yet connected to the interface.

The current interface and prompts are primarily in Chinese. The newer portfolio design uses Daily standup and Progress update formats; those formats are not yet implemented here.

## Run locally

Requires Node.js 20.9 or later and npm.

```sh
npm ci
cp .env.example .env.local
# Add your Groq API key to .env.local.
npm run dev
```

Open http://localhost:3000. Try the Today page to parse a work note and confirm the resulting entries. Try a report page to generate a report from its sample entries. AI features require your own Groq key and make real API requests.

Supabase variables are only needed to work on the database routes. No database schema or production deployment is included in this prototype.

## In progress

- Connect confirmed entries, Records and reports to a shared persistent work log.
- Implement the revised report formats and date selection.
- Add first-use onboarding for project and work type lists.
- Bring the interface in line with the latest case-study designs.

## Stack

Next.js, React, TypeScript, Tailwind CSS, Groq and Supabase.

This is a development prototype, not a production-ready service.
