import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanitizeUsername } from "@/lib/sanitize";
import { SITE, SITE_ROUTES } from "@/lib/site";

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
  const socialCardUrl = `/api/profile?username=${encodedUsername}&type=profile&theme=dark`;
  const contributionUrl = `/api/profile?username=${encodedUsername}&type=contributions&theme=dark`;
  const cardUrl = `${SITE_ROUTES.apiCard}?username=${encodedUsername}`;
  const languagesUrl = `${SITE_ROUTES.apiLangs}?username=${encodedUsername}`;
  const absoluteSocialCardUrl = `${SITE.url}${socialCardUrl}`;
  const markdown = `![${username}'s GitHub profile](${absoluteSocialCardUrl})`;

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
        <article className="rounded-2xl border border-[#30363d] bg-[#010409] p-4 shadow-2xl shadow-black/20 sm:p-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Profile showcase</h2>
              <p className="mt-1 text-sm text-[#8b949e]">A shareable, live profile card built for posts and portfolios.</p>
            </div>
            <div className="flex gap-2">
              <a href={socialCardUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-[#30363d] px-3 py-2 text-xs font-semibold text-[#c9d1d9] transition-colors hover:border-[#58a6ff]">Open SVG</a>
              <a href={`/api/profile/png?username=${encodedUsername}&type=profile&theme=dark&download=true`} className="rounded-lg bg-[#238636] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#2ea043]">Download PNG</a>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={socialCardUrl} alt={`${username}'s social GitHub profile card`} className="mx-auto h-auto w-full rounded-xl" />
        </article>

        <article className="rounded-2xl border border-[#30363d] bg-[#010409] p-4 sm:p-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Contribution graph</h2>
              <p className="mt-1 text-sm text-[#8b949e]">A year of public GitHub activity, fitted to a social-card canvas.</p>
            </div>
            <a href={contributionUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-[#30363d] px-3 py-2 text-xs font-semibold text-[#c9d1d9] transition-colors hover:border-[#58a6ff]">Open SVG</a>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={contributionUrl} alt={`${username}'s GitHub contribution graph`} className="mx-auto h-auto w-full rounded-xl" />
        </article>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.72fr)]">
          <article className="rounded-2xl border border-[#30363d] bg-[#010409] p-5 sm:p-8">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div><h2 className="text-xl font-semibold">Detailed stats</h2><p className="mt-1 text-sm text-[#8b949e]">The original README stats card is still available.</p></div>
              <a href={cardUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-lg border border-[#30363d] px-3 py-2 text-xs font-semibold text-[#c9d1d9] transition-colors hover:border-[#58a6ff]">Open SVG</a>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cardUrl} alt={`${username}'s detailed GitHub stats`} className="mx-auto h-auto w-full max-w-xl" />
          </article>

          <aside className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5 sm:p-8">
            <h2 className="text-xl font-semibold">Use this card</h2>
            <p className="mt-2 text-sm text-[#8b949e]">Paste this line into a README, or download the PNG for LinkedIn.</p>
            <pre className="mt-5 overflow-x-auto whitespace-pre-wrap break-all rounded-lg border border-[#30363d] bg-[#0d1117] p-4 text-xs leading-6 text-[#79c0ff]">{markdown}</pre>
            <div className="mt-5 flex flex-col gap-3">
              <Link href={`${SITE_ROUTES.home}#try`} className="rounded-lg bg-[#238636] px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#2ea043]">Customise a card</Link>
              <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-[#30363d] px-4 py-2.5 text-center text-sm font-semibold text-[#c9d1d9] transition-colors hover:border-[#8b949e]">View GitHub profile</a>
            </div>
          </aside>
        </div>

        <article className="rounded-2xl border border-[#30363d] bg-[#010409] p-5 sm:p-8">
          <div className="mb-5"><h2 className="text-xl font-semibold">Top languages</h2><p className="mt-1 text-sm text-[#8b949e]">Calculated across public, non-fork repositories.</p></div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={languagesUrl} alt={`${username}'s top programming languages`} className="mx-auto h-auto w-full max-w-xl" />
        </article>

        <p className="text-center text-sm text-[#484f58]">
          Try another profile by replacing <code className="text-[#8b949e]">{username}</code> in the URL.
        </p>
      </section>
    </main>
  );
}
