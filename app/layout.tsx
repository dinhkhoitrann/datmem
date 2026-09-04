import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "One lovely day, with you",
  description: "A small keepsake from our first date.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
