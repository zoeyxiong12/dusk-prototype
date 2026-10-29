"use client";
import { useState } from "react";
import Link from "next/link";
import Screen from "@/components/Screen";
import EntryList from "@/components/EntryList";
import { useEntries } from "@/components/EntryStore";
import { demoDate, Entry, sampleNote } from "@/lib/entries";
export default function Capture() {
  const { entries, add, projectList, typeList } = useEntries();
  const [text, setText] = useState("");
  const [date, setDate] = useState(demoDate);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  async function organise(sample = false) {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/parse-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: sample ? sampleNote : text,
          projects: projectList,
          task_types: typeList,
          date,
          demo: sample,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw Error(data.error || "Unable to organise notes.");
      add(
        data.entries.map((e: Entry) => ({
          ...e,
          id: crypto.randomUUID(),
          date,
          time: new Date().toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          confirmed: false,
        })),
      );
      setText("");
      setMessage(
        sample
          ? "Sample entries added. No AI request was made."
          : "AI suggestions added. Review the details before confirming.",
      );
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }
  const rows = entries
    .filter((e) => e.date === date)
    .sort((a, b) => a.time.localeCompare(b.time));
  const confirmed = rows.filter((e) => e.confirmed && selected.includes(e.id));
  return (
    <Screen
      title="Capture"
      heading="What did you work on today?"
      description="Write a quick note. Check the suggested entries before confirming."
      actions={
        <label>
          Date
          <input
            type="date"
            aria-label="Entry date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setSelected([]);
            }}
          />
        </label>
      }
    >
      <section className="card capture-box">
        <label className="field-label" htmlFor="work-note">
          Your work notes
        </label>
        <textarea
          id="work-note"
          placeholder={sampleNote}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
        />
        <div className="toolbar">
          <Link href="/settings">Manage projects & work types ↗</Link>
          <div>
            <button disabled={busy} onClick={() => organise(true)}>
              Try sample notes
            </button>
            <button
              className="primary"
              disabled={busy || !text.trim()}
              onClick={() => organise()}
            >
              {busy ? "Organising…" : "Organise with AI"}
            </button>
          </div>
        </div>
        <p className="helper">
          AI requires a configured server key. Sample notes demonstrate the flow
          without an API request.
        </p>
      </section>
      {message && (
        <p role="status" className="notice">
          {message}
        </p>
      )}
      <section className="card">
        <div className="section-heading">
          <h2>Today’s log</h2>
          <span>
            {rows.length} entries · {rows.filter((e) => !e.confirmed).length} to
            confirm
          </span>
        </div>
        <EntryList
          entries={rows}
          editable
          selected={selected}
          onSelect={(id) =>
            setSelected((s) =>
              s.includes(id) ? s.filter((i) => i !== id) : [...s, id],
            )
          }
        />
        <div className="toolbar">
          <button
            onClick={() =>
              setSelected(rows.filter((e) => e.confirmed).map((e) => e.id))
            }
          >
            Select confirmed entries
          </button>
          <Link
            className={confirmed.length ? "button primary" : "button disabled"}
            aria-disabled={!confirmed.length}
            href={
              confirmed.length
                ? `/report?entries=${confirmed.map((e) => encodeURIComponent(e.id)).join(",")}`
                : "#"
            }
          >
            Generate report ({confirmed.length})
          </Link>
        </div>
      </section>
    </Screen>
  );
}
