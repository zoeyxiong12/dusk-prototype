# Dusk

An AI-assisted work log for turning everyday notes into entries and reports.

**Status: in development.** This repository contains a working prototype of the core workflow. The portfolio shows the intended product design; some interactions and visual details are still being implemented here.

## The idea

Record work once, then use those entries when you need a report or want to look back at past work.

- **Capture:** write notes, review the suggested entries and confirm them.
- **Report:** choose entries and a date range for a Daily standup or Progress update.
- **Records:** search and filter individual entries.
- **Calendar:** see what was recorded on a particular day.
- **Dashboard:** view counts of confirmed entries by date, project and work type.

## What works in this prototype

The pages share one entry model. You can edit entries, confirm them, select report sources and generate or copy a report. Entries and setup lists are saved locally in the browser. Work status (Done, In progress or On hold) is separate from whether an entry has been confirmed.

Two separate AI requests handle the core tasks:

1. `app/api/parse-entry/route.ts` turns notes into structured suggestions using the configured project and work type lists.
2. `app/api/generate-report/route.ts` generates a report from selected confirmed entries.

Both requests use Groq. Parsing uses a temperature of 0.3; report generation uses 0.7. The prompts and validation limit categories and ask the model to preserve recorded quantities without inventing results. Users still review the output.

The included June 2026 dataset is illustrative: 31 entries, 29 confirmed and 2 awaiting confirmation. **Try sample notes** and **Preview template** demonstrate the workflow without an AI request. These actions are labelled separately from AI generation.

## Still being developed

- First-use onboarding and suggested project/work type lists.
- Final interface styling and mascot interactions from the case study.
- Authentication, database persistence and cross-device sync.
- Further testing and production controls.

The current prototype uses localStorage for the work log and sessionStorage for report selection. Existing Supabase routes are scaffolding for future database work and are not used by the current interface. This is not a hosted service or a production release.

## Run locally

Requires Node.js 20.9+ and npm.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Once the server is running, open `http://localhost:3000` in your browser. This address only works on the computer running the server; it is not an online demo link.

The sample workflow needs no API key. To use real AI generation, add your own `GROQ_API_KEY` to `.env.local` and restart the server. Keep that file private. Supabase variables are optional and only needed for database development.

## Code guide

| Location | Purpose |
| --- | --- |
| `lib/entries.ts` | Entry schema, categories and sample data |
| `components/EntryStore.tsx` | Shared browser-backed work log |
| `components/EntryList.tsx` | Review, edit, confirmation and selection |
| `app/capture`, `app/records`, `app/report` | Core work-log and reporting pages |
| `app/calendar`, `app/page.tsx` | Calendar and Dashboard views |
| `app/api` | Parsing, report generation and database scaffolding |

## Checks

```sh
npm run lint
npx tsc --noEmit
```

Data tests require Node.js 22.6+:

```sh
node --experimental-strip-types --test tests/entries.test.mjs
```

Built with Next.js, React, TypeScript, Tailwind CSS and Groq. The development server uses Webpack.
