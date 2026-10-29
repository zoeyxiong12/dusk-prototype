import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import { EntryProvider } from "@/components/EntryStore";
export const metadata: Metadata = {
  title: "Dusk · Development prototype",
  description:
    "An early interactive prototype for recording work and generating reports.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <EntryProvider>
          <div className="app-shell">
            <Sidebar />
            <main className="main">{children}</main>
          </div>
        </EntryProvider>
      </body>
    </html>
  );
}
