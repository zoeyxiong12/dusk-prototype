"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Screen from "@/components/Screen";
import EntryList from "@/components/EntryList";
import { useEntries } from "@/components/EntryStore";
import { Entry } from "@/lib/entries";
function initialSelection() {
  const defaults = {
    ids: [] as string[],
    type: "daily_standup",
    start: "2026-06-01",
    end: "2026-06-19",
    project: "",
  };
  try {
    const raw = sessionStorage.getItem("dusk-report-selection");
    const saved = raw ? JSON.parse(raw) : {};
    const ids = new URLSearchParams(window.location.search).get("entries");
    return {
      ...defaults,
      ...saved,
      ids: ids ? ids.split(",") : Array.isArray(saved.ids) ? saved.ids : [],
      ...(ids ? { start: "2026-06-19", end: "2026-06-19" } : {}),
    };
  } catch {
    return defaults;
  }
}
export default function Report() {
  const { entries, ready, projectList } = useEntries();
  const [initial] = useState(initialSelection);
  const [type, setType] = useState<string>(initial.type);
  const [start, setStart] = useState<string>(initial.start);
  const [end, setEnd] = useState<string>(initial.end);
  const [project, setProject] = useState<string>(initial.project);
  const [selected, setSelected] = useState<string[]>(initial.ids);
  const [report, setReport] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [reportKey, setReportKey] = useState("");
  const [instructions, setInstructions] = useState("");
  useEffect(() => {
    if (ready) {
      try {
        sessionStorage.setItem(
          "dusk-report-selection",
          JSON.stringify({ ids: selected, type, start, end, project }),
        );
      } catch {
        /* Report selection remains available for this page session. */
      }
    }
  }, [ready, selected, type, start, end, project]);
  const rows = entries.filter(
    (e) =>
      (!start || e.date >= start) &&
      (!end || e.date <= end) &&
      (!project || e.project === project),
  );
  const eligible = rows.filter((e) => e.confirmed);
  const chosen = eligible.filter((e) => selected.includes(e.id));
  const pending = rows.filter((e) => !e.confirmed).length;
  const currentKey = JSON.stringify({ chosen, type, start, end, instructions });
  async function generate(demo = false) {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          entries: chosen,
          instruction: instructions,
          demo,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw Error(data.error || "Unable to generate report.");
      setReport(data.report);
      setReportKey(currentKey);
      setMessage(
        demo
          ? "Template preview. No AI request was made."
          : "Generated from your selected confirmed entries.",
      );
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Unable to generate report.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen
      title="Report"
      heading={type === "daily_standup" ? "Daily standup" : "Progress update"}
      description="Generate a report when you need it, using the entries you choose."
    >
      <div className="filters">
        <label>
          Report type
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="daily_standup">Daily standup</option>
            <option value="progress_update">Progress update</option>
          </select>
        </label>
        <label>
          From
          <input
            aria-label="Report start date"
            type="date"
            value={start}
            onInput={(e) => setStart(e.currentTarget.value)}
          />
        </label>
        <label>
          To
          <input
            aria-label="Report end date"
            type="date"
            value={end}
            onInput={(e) => setEnd(e.currentTarget.value)}
          />
        </label>
        <label>
          Project
          <select value={project} onChange={(e) => setProject(e.target.value)}>
            <option value="">All projects</option>
            {projectList.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
      </div>
      {start && end && start > end && (
        <p role="alert">Choose an end date after the start date.</p>
      )}
      <div className="report-grid">
        <section className="card">
          <h2>Report</h2>
          <p className="helper">
            {type === "daily_standup"
              ? "A short team update. Only recorded plans are included."
              : "A project summary for your selected period."}
          </p>
          <label>
            Additional instructions
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Optional: what should this report focus on?"
            />
          </label>
          <div className="toolbar">
            <button
              disabled={
                !chosen.length || busy || !!(start && end && start > end)
              }
              onClick={() => generate(true)}
            >
              Preview template
            </button>
            <button
              className="primary"
              disabled={
                !chosen.length || busy || !!(start && end && start > end)
              }
              onClick={() => generate()}
            >
              {busy ? "Generating…" : "Generate with AI"}
            </button>
          </div>
          {message && (
            <p role="status" className="notice">
              {message}
            </p>
          )}
          {report && reportKey !== currentKey && (
            <p className="notice">
              Selection or entries changed. Generate again to update this
              report.
            </p>
          )}
          <textarea
            aria-label="Report text"
            className="report-output"
            rows={14}
            value={report}
            onChange={(e) => setReport(e.target.value)}
            placeholder="Select confirmed entries, then generate a report."
          />
          <button
            disabled={!report}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(report);
                setMessage("Report copied.");
              } catch {
                setMessage(
                  "Copy is unavailable. Select the report text to copy it manually.",
                );
              }
            }}
          >
            Copy report
          </button>
        </section>
        <section className="card">
          <div className="section-heading">
            <h2>Source entries</h2>
            <span>{chosen.length} selected</span>
          </div>
          {pending > 0 && (
            <p className="notice">
              {pending} more to confirm.{" "}
              <Link href="/capture">Review in Capture ↗</Link>
            </p>
          )}
          <button onClick={() => setSelected(eligible.map((e: Entry) => e.id))}>
            Select all confirmed
          </button>
          <button onClick={() => setSelected([])}>Clear</button>
          <EntryList
            entries={rows}
            selected={selected}
            onSelect={(id) =>
              setSelected((s) =>
                s.includes(id) ? s.filter((i) => i !== id) : [...s, id],
              )
            }
          />
        </section>
      </div>
    </Screen>
  );
}
