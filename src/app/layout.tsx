import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ghstats.dev"),
  title: {
    default:
      "GitHub Profile Stats — Beautiful Stats Cards for Your README",
    template: "%s | GitHub Profile Stats",
  },
  description:
    "Generate beautiful, dynamically generated GitHub stats cards for your profile README. 13 stats, 12 themes, fully customizable SVG cards — just paste one line. No tokens, no setup, no deployment needed. Free and open source.",
  keywords: [
    "github stats",
    "github profile stats",
    "github readme stats",
    "github stats card",
    "github profile readme",
    "readme stats generator",
    "github contribution stats",
    "github streak stats",
    "svg stats card",
    "developer stats",
    "github activity",
    "open source",
    "github readme generator",
    "profile readme",
    "github stats badge",
  ],
  authors: [{ name: "rowkav09", url: "https://github.com/rowkav09" }],
  creator: "rowkav09",
  publisher: "rowkav09",
  openGraph: {
    title:
      "GitHub Profile Stats — Beautiful Stats Cards for Your README",
    description:
      "Generate beautiful, dynamically generated GitHub stats cards for your profile README. 13 stats, 12 themes, fully customizable SVG cards — just paste one line. No tokens, no setup, no deployment needed. Free and open source.",
    url: "https://ghstats.dev",
    siteName: "GitHub Profile Stats",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "GitHub Profile Stats — Beautiful Stats Cards for Your README",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "GitHub Profile Stats — Beautiful Stats Cards for Your README",
    description:
      "Generate beautiful, dynamically generated GitHub stats cards for your profile README. 13 stats, 12 themes, fully customizable SVG cards — just paste one line. No tokens, no setup, no deployment needed. Free and open source.",
    images: ["/opengraph-image"],
    creator: "@rowkav09",
  },
  alternates: {
    canonical: "https://ghstats.dev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GitHub Profile Stats",
  description:
    "Generate beautiful, dynamically generated GitHub stats cards for your profile README. 13 stats, 12 themes, fully customizable SVG cards — just paste one line. No tokens, no setup, no deployment needed. Free and open source.",
  url: "https://ghstats.dev",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "rowkav09",
    url: "https://github.com/rowkav09",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#0d1117] text-[#c9d1d9] antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
