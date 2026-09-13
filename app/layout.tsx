import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HVAC Follow-Up Board",
  description: "Open quotes and unconfirmed appointments, in one morning view.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
