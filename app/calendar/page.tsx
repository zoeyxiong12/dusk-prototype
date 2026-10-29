"use client";
import { useState } from "react";
import Screen from "@/components/Screen";
import EntryList from "@/components/EntryList";
import { useEntries } from "@/components/EntryStore";
import { projectColors } from "@/lib/entries";
export default function Calendar() {
  const { entries } = useEntries();
  const [month, setMonth] = useState("2026-06");
  const [selected, setSelected] = useState("2026-06-19");
  const [year, m] = month.split("-").map(Number);
  const days = new Date(year, m, 0).getDate();
  const offset = (new Date(year, m - 1, 1).getDay() + 6) % 7;
  const rows = entries.filter((e) => e.date === selected);
  const today = new Date().toLocaleDateString("en-CA");
  function move(delta: number) {
    const d = new Date(year, m - 1 + delta, 1);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return (
    <Screen
      title="Calendar"
      heading="Look back on your work"
      description={new Date(year, m - 1, 1).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      })}
      actions={
        <div className="filters">
          <button
            onClick={() => {
              setMonth(today.slice(0, 7));
              setSelected(today);
            }}
          >
            Today
          </button>
          <button aria-label="Previous month" onClick={() => move(-1)}>
            ‹
          </button>
          <button aria-label="Next month" onClick={() => move(1)}>
            ›
          </button>
          <input
            aria-label="Choose month"
            type="month"
            value={month}
            onChange={(e) => {
              if (e.target.value) setMonth(e.target.value);
            }}
          />
        </div>
      }
    >
      <div className="calendar-layout">
        <section className="card">
          <div className="calendar-grid">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <span className="weekday" key={d}>
                {d}
              </span>
            ))}
            {Array.from({ length: offset }, (_, i) => (
              <span key={`empty-${i}`} />
            ))}
            {Array.from({ length: days }, (_, i) => {
              const date = `${month}-${String(i + 1).padStart(2, "0")}`;
              const projects = [
                ...new Set(
                  entries.filter((e) => e.date === date).map((e) => e.project),
                ),
              ];
              return (
                <button
                  key={date}
                  aria-label={`View ${date}`}
                  aria-pressed={date === selected}
                  className={`calendar-day ${date === selected ? "selected" : ""} ${date === today ? "today" : ""}`}
                  onClick={() => setSelected(date)}
                >
                  <span>{i + 1}</span>
                  <div className="day-dots">
                    {projects.map((p) => (
                      <i
                        key={p}
                        className="project-dot"
                        style={{ background: projectColors[p] || "#aaa" }}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="legend">
            {Object.entries(projectColors)
              .filter(([p]) => p !== "Uncategorised")
              .map(([p, c]) => (
                <span key={p}>
                  <i className="project-dot" style={{ background: c }} />
                  {p}
                </span>
              ))}
          </div>
          <p className="helper">
            One dot means this project has entries that day, including entries
            awaiting confirmation.
          </p>
        </section>
        <section className="card">
          <h2>
            {new Date(selected + "T12:00:00").toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </h2>
          <p className="helper">
            {rows.length} entries · {new Set(rows.map((e) => e.project)).size}{" "}
            projects
          </p>
          <EntryList entries={rows} />
        </section>
      </div>
    </Screen>
  );
}
