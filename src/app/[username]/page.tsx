import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanitizeUsername } from "@/lib/sanitize";
import { SITE, SITE_ROUTES } from "@/lib/site";
import SocialCardBuilder from "@/components/ProfilePage/SocialCardBuilder";
import LinkedEmbed from "@/components/ProfilePage/LinkedEmbed";

type ProfilePageProps = {
  params: { username: string };
};

function getUsername(rawUsername: string): string {
  try {
    return sanitizeUsername(decodeURIComponent(rawUsername)) ?? "";
  } catch {
    return "";
  }
}

export function generateMetadata({ params }: ProfilePageProps): Metadata {
  const username = getUsername(params.username);

  if (!username) {
    return {
      title: "Invalid GitHub profile",
      robots: { index: false, follow: false },
    };
  }

  const title = `${username}'s GitHub profile card`;
  const description = `View ${username}'s live GitHub stats card, language breakdown, and ready-to-copy README embeds.`;
  const canonical = new URL(`/${username}`, SITE.url).href;
  const cardImage = `${SITE.url}/api/profile/png?username=${encodeURIComponent(username)}&type=profile&theme=dark`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "profile",
      images: [{ url: cardImage, alt: `${username}'s GitHub stats card` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [cardImage],
    },
  };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const username = getUsername(params.username);
  if (!username) notFound();

  const encodedUsername = encodeURIComponent(username);
  const profileUrl = `https://github.com/${encodedUsername}`;
  const cardUrl = `${SITE_ROUTES.apiCard}?username=${encodedUsername}`;
  const languagesUrl = `${SITE_ROUTES.apiLangs}?username=${encodedUsername}`;

  return (
    <main className="min-h-screen bg-[#0d1117]">
      <header className="border-b border-[#21262d] bg-[#010409]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <Link href={SITE_ROUTES.home} className="text-lg font-bold tracking-tight">
            <span className="text-[#58a6ff]">GitHub</span> Profile Stats
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link
              href={SITE_ROUTES.status}
              className="text-[#8b949e] transition-colors hover:text-[#c9d1d9]"
            >
              Status
            </Link>
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#58a6ff] transition-colors hover:text-[#79c0ff]"
            >
              @{username} on GitHub
            </a>
          </div>
        </div>
      </header>

      <section className="border-b border-[#21262d] bg-gradient-to-b from-[#010409] to-[#0d1117]">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b949e]">
            Live GitHub profile
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            {username}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[#8b949e]">
            A live snapshot generated from public GitHub activity. The cards update automatically as the profile changes.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl space-y-8 px-6 py-12">
        <SocialCardBuilder username={username} />

        <details className="group rounded-2xl border border-[#30363d] bg-[#010409]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-[#c9d1d9] sm:p-6">
            <span><span className="block text-lg">See more card options</span><span className="mt-1 block text-sm font-normal text-[#8b949e]">Detailed stats and language cards</span></span>
            <span className="text-[#58a6ff] transition-transform group-open:rotate-180">⌄</span>
          </summary>
          <div className="grid gap-8 border-t border-[#21262d] p-5 lg:grid-cols-2 sm:p-6">
          <article className="rounded-2xl border border-[#30363d] bg-[#010409] p-5 sm:p-8">
            <div className="flex items-start justify-between gap-3">
              <div><h2 className="text-xl font-semibold">Detailed stats</h2><p className="mt-1 text-sm text-[#8b949e]">The original README stats card.</p></div>
              <a href={cardUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-lg border border-[#30363d] px-3 py-2 text-xs font-semibold text-[#c9d1d9] transition-colors hover:border-[#58a6ff]">Open SVG</a>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cardUrl} alt={`${username}'s detailed GitHub stats`} className="mx-auto mt-5 h-auto w-full" />
            <LinkedEmbed label={`${username}'s detailed GitHub stats`} imageUrl={cardUrl} />
          </article>

          <article className="rounded-2xl border border-[#30363d] bg-[#010409] p-5 sm:p-8">
            <div><h2 className="text-xl font-semibold">Top languages</h2><p className="mt-1 text-sm text-[#8b949e]">Calculated across public, non-fork repositories.</p></div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={languagesUrl} alt={`${username}'s top programming languages`} className="mx-auto mt-5 h-auto w-full" />
            <LinkedEmbed label={`${username}'s top programming languages`} imageUrl={languagesUrl} />
          </article>
          </div>
        </details>

        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#30363d] bg-[#161b22] p-6 text-center sm:flex-row">
          <Link href={`${SITE_ROUTES.home}#try`} className="rounded-lg bg-[#238636] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2ea043]">Open the full generator</Link>
          <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-[#30363d] px-4 py-2.5 text-sm font-semibold text-[#c9d1d9] transition-colors hover:border-[#8b949e]">View GitHub profile</a>
        </div>

        <p className="text-center text-sm text-[#484f58]">
          Try another profile by replacing <code className="text-[#8b949e]">{username}</code> in the URL.
        </p>
      </section>
    </main>
  );
}
