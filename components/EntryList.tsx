"use client";
import { useState } from "react";
import { Entry, projectColors, WorkStatus } from "@/lib/entries";
import { useEntries } from "./EntryStore";
export default function EntryList({
  entries,
  editable = false,
  selected,
  onSelect,
}: {
  entries: Entry[];
  editable?: boolean;
  selected?: string[];
  onSelect?: (id: string) => void;
}) {
  const { update, projectList, typeList } = useEntries();
  const [editing, setEditing] = useState<string | null>(null);
  if (!entries.length)
    return <p className="empty">No entries for this selection.</p>;
  return (
    <div className="entry-list">
      {entries.map((e) => (
        <article className="entry-row" key={e.id}>
          {onSelect && (
            <input
              aria-label={`Select ${e.name}`}
              type="checkbox"
              disabled={!e.confirmed}
              checked={selected?.includes(e.id) || false}
              onChange={() => onSelect(e.id)}
            />
          )}
          <span
            className="project-dot"
            style={{ background: projectColors[e.project] || "#aaa" }}
          />
          <div className="entry-details">
            {editing === e.id ? (
              <form
                className="edit-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  const data = new FormData(event.currentTarget);
                  update(e.id, {
                    name: String(data.get("name")).trim(),
                    description: String(data.get("description")),
                    project: String(data.get("project")),
                    task_type: String(data.get("type")),
                    status: String(data.get("status")) as WorkStatus,
                  });
                  setEditing(null);
                }}
              >
                <label>
                  Title
                  <input
                    name="name"
                    defaultValue={e.name}
                    required
                    maxLength={160}
                  />
                </label>
                <label>
                  Description
                  <input
                    name="description"
                    defaultValue={e.description}
                    maxLength={1000}
                  />
                </label>
                <div className="edit-fields">
                  <label>
                    Project
                    <select name="project" defaultValue={e.project}>
                      {[...new Set([...projectList, e.project])].map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Work type
                    <select name="type" defaultValue={e.task_type}>
                      {[...new Set([...typeList, e.task_type])].map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Work status
                    <select name="status" defaultValue={e.status}>
                      {["Done", "In progress", "On hold"].map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <button type="submit" className="primary">
                  Save changes
                </button>
                <button type="button" onClick={() => setEditing(null)}>
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <strong>{e.name}</strong>
                <p>{e.description}</p>
                <div className="entry-meta">
                  <span className="tag">{e.task_type}</span>
                  <span>{e.project}</span>
                  {e.status !== "Done" && <span>{e.status}</span>}
                  <time>
                    {e.date} · {e.time}
                  </time>
                </div>
              </>
            )}
          </div>
          {editable && editing !== e.id && (
            <div className="entry-actions">
              <span className={e.confirmed ? "state confirmed" : "state"}>
                {e.confirmed ? "Confirmed" : "To confirm"}
              </span>
              <button onClick={() => setEditing(e.id)}>
                {e.confirmed ? "Edit" : "Review"}
              </button>
              {!e.confirmed && (
                <button
                  className="primary"
                  onClick={() => update(e.id, { confirmed: true })}
                >
                  Confirm
                </button>
              )}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
