"use client";
import { ReactNode } from "react";
import { useEntries } from "./EntryStore";
export default function Screen({
  title,
  heading,
  description,
  actions,
  children,
}: {
  title: string;
  heading: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { ready, notice } = useEntries();
  return (
    <>
      <header className="topbar">
        <strong>{title}</strong>
        <span>Prototype · June 2026</span>
      </header>
      <div className="content">
        <div className="page-heading">
          <div>
            <h1>{heading}</h1>
            {description && <p>{description}</p>}
          </div>
          {actions}
        </div>
        {notice && (
          <p role="status" className="notice">
            {notice}
          </p>
        )}
        {ready ? children : <p role="status">Loading your work log…</p>}
      </div>
    </>
  );
}
