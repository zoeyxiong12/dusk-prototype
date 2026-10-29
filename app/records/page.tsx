"use client";
import { useState } from "react";
import Screen from "@/components/Screen";
import EntryList from "@/components/EntryList";
import { useEntries } from "@/components/EntryStore";
export default function Records() {
  const { entries, projectList, typeList } = useEntries();
  const [q, setQ] = useState("");
  const [project, setProject] = useState("");
  const [type, setType] = useState("");
  const [state, setState] = useState("");
  const filtered = entries
    .filter(
      (e) =>
        (!q ||
          `${e.name} ${e.description}`
            .toLowerCase()
            .includes(q.toLowerCase())) &&
        (!project || e.project === project) &&
        (!type || e.task_type === type) &&
        (!state || (state === "confirmed" ? e.confirmed : !e.confirmed)),
    )
    .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`));
  return (
    <Screen
      title="Records"
      heading="Your work log"
      description="Find and review individual entries across your work."
    >
      <div className="filters">
        <input
          aria-label="Search entries"
          placeholder="Search entries"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          aria-label="Project"
          value={project}
          onChange={(e) => setProject(e.target.value)}
        >
          <option value="">All projects</option>
          {projectList.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <select
          aria-label="Work type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All work types</option>
          {typeList.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <select
          aria-label="Confirmation"
          value={state}
          onChange={(e) => setState(e.target.value)}
        >
          <option value="">All entries</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">To confirm</option>
        </select>
      </div>
      <section className="card">
        <div className="section-heading">
          <h2>{filtered.length} entries</h2>
        </div>
        <EntryList entries={filtered} editable />
      </section>
    </Screen>
  );
}
