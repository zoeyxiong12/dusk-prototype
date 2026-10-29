import test from "node:test";
import assert from "node:assert/strict";
import { seedEntries, isEntry } from "../lib/entries.ts";
test("shared sample data matches the case-study totals and pending entries", () => {
  const entries = seedEntries();
  assert.equal(entries.length, 31);
  assert.ok(entries.every(isEntry));
  const confirmed = entries.filter((e) => e.confirmed);
  assert.equal(confirmed.length, 29);
  assert.deepEqual(
    ["2D Card Game", "3D RPG", "Open World"].map(
      (p) => confirmed.filter((e) => e.project === p).length,
    ),
    [13, 10, 6],
  );
  const june19 = entries.filter((e) => e.date === "2026-06-19");
  assert.equal(june19.length, 6);
  assert.equal(june19.filter((e) => e.confirmed).length, 4);
  assert.equal(new Set(entries.map((e) => e.id)).size, 31);
});
test("work status does not substitute for user confirmation", () => {
  const entries = seedEntries();
  assert.ok(entries.some((e) => e.status === "Done" && !e.confirmed));
  assert.ok(entries.some((e) => e.status === "In progress" && e.confirmed));
  assert.equal(isEntry({ ...entries[0], confirmed: "Done" }), false);
});
