import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import RepositoryCardBuilder from "@/components/RepositoryPage/RepositoryCardBuilder";
import { sanitizeUsername } from "@/lib/sanitize";
import { SITE, SITE_ROUTES } from "@/lib/site";

type Props = { params: { username: string; repo: string } };

function values(params: Props["params"]) {
  try {
    const owner = sanitizeUsername(decodeURIComponent(params.username)) ?? "";
    const repo = decodeURIComponent(params.repo);
    return { owner, repo: /^[A-Za-z0-9._-]{1,100}$/.test(repo) ? repo : "" };
  } catch { return { owner: "", repo: "" }; }
}

export function generateMetadata({ params }: Props): Metadata {
  const { owner, repo } = values(params);
  if (!owner || !repo) return { title: "Invalid GitHub repository", robots: { index: false, follow: false } };
  const title = `${owner}/${repo} GitHub repository card`;
  const description = `Build and download a live GitHub repository card for ${owner}/${repo}.`;
  const canonical = new URL(`/${owner}/${repo}`, SITE.url).href;
  return { title, description, alternates: { canonical }, openGraph: { title, description, url: canonical, type: "website", images: [`${SITE.url}/api/profile/png?repo=${encodeURIComponent(`${owner}/${repo}`)}&theme=dark`] } };
}

export default function RepositoryPage({ params }: Props) {
  const { owner, repo } = values(params);
  if (!owner || !repo) notFound();
  const githubUrl = `https://github.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
  return <main className="min-h-screen bg-[#0d1117]">
    <header className="border-b border-[#21262d] bg-[#010409]"><div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4"><Link href={SITE_ROUTES.home} className="text-lg font-bold tracking-tight"><span className="text-[#58a6ff]">GitHub</span> Profile Stats</Link><a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[#58a6ff] hover:text-[#79c0ff]">{owner}/{repo} on GitHub</a></div></header>
    <section className="border-b border-[#21262d] bg-gradient-to-b from-[#010409] to-[#0d1117]"><div className="mx-auto max-w-5xl px-6 py-16 text-center"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b949e]">Live GitHub repository</p><h1 className="mt-3 break-words text-4xl font-bold tracking-tight sm:text-5xl">{owner}/{repo}</h1><p className="mx-auto mt-4 max-w-xl text-[#8b949e]">A live repository card generated from public GitHub data.</p></div></section>
    <section className="mx-auto max-w-5xl space-y-8 px-6 py-12"><RepositoryCardBuilder owner={owner} repo={repo} /><div className="flex justify-center"><a href={githubUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-[#30363d] px-4 py-2.5 text-sm font-semibold text-[#c9d1d9] hover:border-[#8b949e]">View GitHub repository</a></div></section>
  </main>;
}
