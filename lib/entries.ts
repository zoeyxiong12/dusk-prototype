export const projects = ["2D Card Game", "3D RPG", "Open World"] as const;
export const workTypes = [
  "Spec",
  "Art feedback",
  "Data config",
  "QA",
  "Meeting",
  "AI tooling",
  "Competitor research",
] as const;
export const projectColors: Record<string, string> = {
  "2D Card Game": "#5836db",
  "3D RPG": "#9780e8",
  "Open World": "#c8b8f5",
  Uncategorised: "#a5a6b2",
};
export type WorkStatus = "Done" | "In progress" | "On hold";
export type Entry = {
  id: string;
  name: string;
  description: string;
  project: string;
  task_type: string;
  status: WorkStatus;
  confirmed: boolean;
  date: string;
  time: string;
};
export const demoDate = "2026-06-19";
export const sampleNote =
  "2D Card Game: finished the Jörmungandr character spec draft. 3D RPG: sent illustration feedback to the art team.";
const allocation: Record<number, number[]> = {
  1: [2, 0, 0],
  2: [0, 2, 0],
  3: [2, 1, 0],
  4: [2, 0, 0],
  5: [1, 2, 0],
  8: [0, 0, 2],
  9: [2, 0, 0],
  10: [1, 0, 2],
  11: [0, 1, 0],
  12: [1, 2, 0],
  17: [0, 0, 1],
  18: [0, 0, 1],
};
export function seedEntries(): Entry[] {
  const types = [
    ...Array(6).fill("Spec"),
    ...Array(6).fill("Art feedback"),
    ...Array(4).fill("Data config"),
    ...Array(4).fill("QA"),
    ...Array(3).fill("Meeting"),
    ...Array(2).fill("AI tooling"),
  ];
  const entries: Entry[] = [];
  let n = 0;
  for (const [day, counts] of Object.entries(allocation))
    counts.forEach((count, p) => {
      for (let i = 0; i < count; i++) {
        const type = types[n++];
        entries.push({
          id: `sample-${day}-${p}-${i}`,
          name: `${projects[p]} · ${type}`,
          description:
            {
              Spec: "Wrote and shared a design specification.",
              "Art feedback": "Sent feedback to the art team.",
              "Data config": "Updated the configuration table.",
              QA: "Tested the build and recorded issues.",
              Meeting: "Agreed next steps with the team.",
              "AI tooling": "Updated the AI-assisted workflow.",
            }[type as string] || "Recorded work progress.",
          project: projects[p],
          task_type: type,
          status: "Done",
          confirmed: true,
          date: `2026-06-${day.padStart(2, "0")}`,
          time: `${10 + i}:00`,
        });
      }
    });
  const today: Omit<Entry, "id" | "date">[] = [
    {
      name: "Athena dialogue data",
      description: "Added 138 lines to the config table",
      project: projects[0],
      task_type: "Data config",
      status: "Done",
      confirmed: true,
      time: "10:12",
    },
    {
      name: "Competitor analysis",
      description: "Put on hold, priorities changed",
      project: projects[1],
      task_type: "Competitor research",
      status: "On hold",
      confirmed: false,
      time: "10:42",
    },
    {
      name: "Jörmungandr character spec",
      description: "First draft sent to the lead designer",
      project: projects[0],
      task_type: "Spec",
      status: "Done",
      confirmed: true,
      time: "11:30",
    },
    {
      name: "Apollo illustration review",
      description: "Sent feedback to the art team",
      project: projects[1],
      task_type: "Art feedback",
      status: "Done",
      confirmed: true,
      time: "15:05",
    },
    {
      name: "Build playtest",
      description: "Played the latest build, logged 6 bugs",
      project: projects[2],
      task_type: "QA",
      status: "Done",
      confirmed: false,
      time: "16:00",
    },
    {
      name: "Onboarding flow",
      description: "Flowchart done, document still in progress",
      project: projects[1],
      task_type: "Spec",
      status: "In progress",
      confirmed: true,
      time: "16:40",
    },
  ];
  return [
    ...entries,
    ...today.map((e, i) => ({ ...e, id: `sample-19-${i}`, date: demoDate })),
  ];
}
export function isEntry(value: unknown): value is Entry {
  if (!value || typeof value !== "object") return false;
  const e = value as Record<string, unknown>;
  return (
    ["id", "name", "description", "project", "task_type", "date", "time"].every(
      (k) => typeof e[k] === "string",
    ) &&
    typeof e.confirmed === "boolean" &&
    ["Done", "In progress", "On hold"].includes(String(e.status))
  );
}
