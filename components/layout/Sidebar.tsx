"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEntries } from "@/components/EntryStore";
export default function Sidebar() {
  const path = usePathname();
  const { entries } = useEntries();
  const pending = entries.filter((e) => !e.confirmed).length;
  return (
    <aside className="sidebar">
      <Link className="brand" href="/">
        <span className="brand-icon">✦</span>Dusk
      </Link>
      {[
        [
          "WORKLOG",
          [
            ["/capture", "Capture", "✎"],
            ["/records", "Records", "≡"],
            ["/report", "Report", "▤"],
          ],
        ],
        [
          "WORKSPACE",
          [
            ["/calendar", "Calendar", "▦"],
            ["/", "Dashboard", "⊞"],
          ],
        ],
      ].map(([label, items]) => (
        <nav key={label as string} aria-label={label as string}>
          <p className="nav-label">{label as string}</p>
          {(items as string[][]).map(([href, title, icon]) => (
            <Link
              key={href}
              href={href}
              className={path === href ? "nav-link active" : "nav-link"}
            >
              <span aria-hidden="true">{icon}</span>
              {title}
              {href === "/capture" && pending > 0 && (
                <b className="count-badge">{pending}</b>
              )}
            </Link>
          ))}
        </nav>
      ))}
      <div className="sidebar-bottom">
        <Link href="/settings" className="nav-link">
          ⚙ Project & work type setup
        </Link>
        <p>
          Development prototype
          <br />
          Sample data · saved in this browser
        </p>
      </div>
    </aside>
  );
}
