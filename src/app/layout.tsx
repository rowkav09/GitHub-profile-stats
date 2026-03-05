import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GitHub Profile Stats",
  description:
    "Generate beautiful, embeddable GitHub stats cards for your README.",
  icons: {
    icon: "https://github.com/rowkav09.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0d1117] text-[#c9d1d9] antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
