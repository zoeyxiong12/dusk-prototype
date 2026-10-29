"use client";
import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  ReactNode,
} from "react";
import {
  Entry,
  isEntry,
  seedEntries,
  projects,
  workTypes,
} from "@/lib/entries";
type Data = { entries: Entry[]; projects: string[]; types: string[] };
type Store = {
  entries: Entry[];
  ready: boolean;
  notice: string;
  add: (e: Entry[]) => void;
  update: (id: string, patch: Partial<Entry>) => void;
  reset: () => void;
  projectList: string[];
  typeList: string[];
  saveLists: (p: string[], t: string[]) => void;
};
const Context = createContext<Store | null>(null);
const key = "dusk-prototype-v2";
const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
function load(): Data {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const d = JSON.parse(raw);
      if (
        Array.isArray(d.entries) &&
        d.entries.every(isEntry) &&
        Array.isArray(d.projects) &&
        d.projects.every((p: unknown) => typeof p === "string") &&
        Array.isArray(d.types) &&
        d.types.every((t: unknown) => typeof t === "string")
      )
        return d;
    }
  } catch {}
  return {
    entries: seedEntries(),
    projects: [...projects],
    types: [...workTypes],
  };
}
function BrowserStore({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Data>(load);
  const [notice, setNotice] = useState("");
  function change(next: Data) {
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      setNotice(
        "Browser storage is unavailable. Changes will only last for this session.",
      );
    }
    setData(next);
  }
  return (
    <Context.Provider
      value={{
        entries: data.entries,
        ready: true,
        notice,
        projectList: data.projects,
        typeList: data.types,
        add: (rows) => change({ ...data, entries: [...data.entries, ...rows] }),
        update: (id, patch) =>
          change({
            ...data,
            entries: data.entries.map((e) =>
              e.id === id ? { ...e, ...patch, id: e.id } : e,
            ),
          }),
        reset: () => change({ ...data, entries: seedEntries() }),
        saveLists: (p, t) => change({ ...data, projects: p, types: t }),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function EntryProvider({ children }: { children: ReactNode }) {
  const mounted = useSyncExternalStore(
    subscribe,
    clientSnapshot,
    serverSnapshot,
  );
  return mounted ? (
    <BrowserStore>{children}</BrowserStore>
  ) : (
    <p className="notice" role="status">
      Loading Dusk…
    </p>
  );
}
export function useEntries() {
  const store = useContext(Context);
  if (!store) throw Error("EntryProvider is missing");
  return store;
}
