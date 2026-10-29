"use client";
import { useState } from "react";
import Screen from "@/components/Screen";
import { useEntries } from "@/components/EntryStore";
export default function Setup() {
  const { projectList, typeList, saveLists, reset, ready } = useEntries();
  const [message, setMessage] = useState("");
  return (
    <Screen
      title="Setup"
      heading="Set up your work log"
      description="Projects describe what you work on. Work types describe the kind of work you do."
    >
      {ready && (
        <form
          className="card setup-form"
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            const list = (key: string) => [
              ...new Set(
                String(data.get(key))
                  .split("\n")
                  .map((v) => v.trim())
                  .filter(Boolean),
              ),
            ];
            const p = list("projects"),
              t = list("types");
            if (!p.length || !t.length) {
              setMessage("Add at least one project and one work type.");
              return;
            }
            saveLists(p, t);
            setMessage(
              "Lists saved in this browser. Existing entries keep their original labels.",
            );
          }}
        >
          <div className="setup-grid">
            <label>
              Projects
              <span className="helper">
                For example: 2D Card Game. One project per line.
              </span>
              <textarea
                name="projects"
                defaultValue={projectList.join("\n")}
                rows={8}
                required
              />
            </label>
            <label>
              Work types
              <span className="helper">
                For example: Spec, Art feedback or QA. One type per line.
              </span>
              <textarea
                name="types"
                defaultValue={typeList.join("\n")}
                rows={8}
                required
              />
            </label>
          </div>
          <button className="primary" type="submit">
            Save lists
          </button>
          {message && (
            <p role="status" className="notice">
              {message}
            </p>
          )}
        </form>
      )}
      <section className="card">
        <h2>Sample data</h2>
        <p>
          Reset the work log to the June 2026 example. This replaces entries
          saved in this browser.
        </p>
        <button
          onClick={() => {
            if (
              window.confirm(
                "Replace this browser’s entries with the original sample data?",
              )
            ) {
              reset();
              setMessage("Sample entries restored.");
            }
          }}
        >
          Reset sample entries
        </button>
      </section>
    </Screen>
  );
}
