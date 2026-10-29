# Dusk — work-in-progress prototype

Dusk turns everyday work notes into structured entries and reports. This English prototype follows the latest case-study navigation and entry model. It is still under development, with simplified visuals and browser-local storage.

## Try the workflow

1. **Capture:** write notes and organise them with AI, or use **Try sample notes** without making an API request.
2. Review or edit the entry’s project, work type, description and work status, then confirm it. Work status (Done / In progress / On hold) is separate from confirmation.
3. Select confirmed entries and open **Report**. Choose Daily standup or Progress update, a date range and source entries. Generate with AI, or preview a deterministic template without an API request. Copy or edit the result.
4. **Records** searches and filters the shared work log. **Calendar** shows all entries on a chosen date. **Dashboard** counts confirmed entries only.
5. **Setup** lets you maintain the project and work type lists supplied to the parsing request.

Entries and setup lists are saved in this browser’s localStorage. Report selection is retained in sessionStorage when switching pages. No account is required. Sample data starts in June 2026: 31 entries, 29 confirmed, 2 awaiting confirmation. The confirmed project counts are 13 / 10 / 6. Calendar includes pending entries; reports and Dashboard exclude them.

## Run locally

Requires Node.js 20.9+ and npm.

```sh
npm ci
cp .env.example .env.local
# Optional: set GROQ_API_KEY for real AI generation.
npm run dev
```

Then open http://localhost:3000 **on the computer running the development server**. This is a local development address, not a hosted public demo. The sample-note and template-preview actions work without a key. AI actions make real requests using your server-side Groq key.

`npm run dev` uses Webpack. The original dependency directory was copied from another platform; run `npm ci` to install the correct native packages for your own machine.

## Two separate API calls

- `POST /api/parse-entry` converts notes into structured entry suggestions. It receives the configured project and work type lists; unmatched values become Uncategorised. Temperature: 0.3.
- `POST /api/generate-report` accepts selected confirmed entries and a report type. Its instructions preserve recorded quantities and avoid unsupported claims. Temperature: 0.7.

Both routes validate their input. Parsing output is checked and remains unconfirmed until reviewed. Demo/template responses are explicitly labelled and never silently replace a failed AI request.

## Development status

Implemented: English navigation and prompts, shared entry model, browser persistence, review/edit/confirm, report selection and generation, date-based Calendar, Dashboard filters/counts and editable setup lists.

Still in progress:

- Full first-use onboarding and suggested setup lists.
- The final visual details and mascot motion from the case study.
- Authentication, server persistence, cross-device sync and production controls.
- Broader automated and usability testing.

Legacy daily/weekly/monthly and Today URLs redirect to the revised Report and Capture views. The old Supabase entries route/helpers are retained for future database work; the current UI does not use them. Supabase configuration is optional. No database schema or hosted deployment is included.

## Checks

The data tests use Node.js 22.6+ for TypeScript stripping.

```sh
npx tsc --noEmit
node --experimental-strip-types --test tests/entries.test.mjs
```

## Stack

Next.js, React, TypeScript, Tailwind CSS and Groq. Supabase scaffolding is not connected to the current browser-backed UI.

This repository demonstrates development progress. It is not a production-ready service or a claim that the final case-study interface is fully implemented.
