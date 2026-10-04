import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Codies | Digital with impact",
  description: "Development, creative design, and search marketing. Codies builds distinctive digital experiences for ambitious brands.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
