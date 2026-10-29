"use client";
import { useState } from "react";
import Link from "next/link";
import Screen from "@/components/Screen";
import { useEntries } from "@/components/EntryStore";
import { projectColors } from "@/lib/entries";
export default function Dashboard() {
  const { entries, projectList, typeList } = useEntries();
  const [start, setStart] = useState("2026-06-01");
  const [end, setEnd] = useState("2026-06-19");
  const [project, setProject] = useState("");
  const range = entries.filter(
    (e) => (!start || e.date >= start) && (!end || e.date <= end),
  );
  const confirmed = range.filter((e) => e.confirmed);
  const typeEntries = confirmed.filter(
    (e) => !project || e.project === project,
  );
  const counts = typeList
    .map((t) => ({
      name: t,
      count: typeEntries.filter((e) => e.task_type === t).length,
    }))
    .sort((a, b) => b.count - a.count);
  const dates = [...new Set(range.map((e) => e.date))].sort();
  return (
    <Screen
      title="Dashboard"
      heading="Work Overview"
      description="A visual overview of your confirmed work entries."
      actions={
        <div className="filters">
          <label>
            From
            <input
              type="date"
              value={start}
              onInput={(e) => setStart(e.currentTarget.value)}
            />
          </label>
          <label>
            To
            <input
              type="date"
              value={end}
              onInput={(e) => setEnd(e.currentTarget.value)}
            />
          </label>
        </div>
      }
    >
      <div className="metrics">
        {[
          ["Confirmed entries", confirmed.length],
          ["Projects logged", new Set(confirmed.map((e) => e.project)).size],
          ["Most logged type", counts.find((c) => c.count)?.name || "—"],
          ["To confirm", range.filter((e) => !e.confirmed).length],
        ].map(([label, value]) => (
          <div className="card metric" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className="dashboard-grid">
        <section className="card">
          <h2>Daily entries</h2>
          <div className="daily-chart">
            {dates.map((d) => {
              const n = confirmed.filter((e) => e.date === d).length;
              return (
                <div key={d}>
                  <span>{n}</span>
                  <i style={{ height: `${n * 25}px` }} />
                  <small>{Number(d.slice(-2))}</small>
                </div>
              );
            })}
          </div>
          <p className="helper">
            Confirmed entries per logged date in the selected period.
          </p>
        </section>
        <section className="card">
          <h2>Entries by project</h2>
          <div className="project-counts">
            {projectList.map((p) => (
              <div key={p}>
                <span>
                  <i
                    className="project-dot"
                    style={{ background: projectColors[p] || "#aaa" }}
                  />
                  {p}
                </span>
                <strong>
                  {confirmed.filter((e) => e.project === p).length}
                </strong>
              </div>
            ))}
          </div>
          <Link href="/records">View entries ↗</Link>
        </section>
      </div>
      <section className="card">
        <div className="section-heading">
          <h2>Entries by work type</h2>
          <select
            aria-label="Work type project filter"
            value={project}
            onChange={(e) => setProject(e.target.value)}
          >
            <option value="">All projects</option>
            {projectList.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="type-chart">
          {counts.map((c) => (
            <div key={c.name}>
              <span>{c.name}</span>
              <div>
                <i
                  style={{
                    width: `${(c.count / Math.max(1, ...counts.map((c) => c.count))) * 100}%`,
                  }}
                />
              </div>
              <b>{c.count}</b>
            </div>
          ))}
        </div>
        <p className="helper">
          Entry counts describe recorded activity, not performance or impact.
        </p>
      </section>
    </Screen>
  );
}
