import Link from "next/link";
import { repos } from "@/data/work";

const languageColor: Record<string, string> = {
  Python: "#3572A5",
  TypeScript: "#3178c6",
};

export function WorkRoom() {
  return (
    <div className="min-h-full bg-white text-[#1f2328]">
      <div className="border-b border-[#d1d9e0] px-4 py-5 sm:px-6">
        <p className="text-sm text-[#59636e]">martintran23</p>
        <h1 className="mt-1 text-2xl font-semibold">Repositories</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#59636e]">
          Selected work only. Three pinned repos, each with a README case study.
        </p>
      </div>

      <ul>
        {repos.map((repo) => (
          <li
            key={repo.slug}
            className="border-b border-[#d1d9e0] px-4 py-5 sm:px-6"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/work/${repo.slug}`}
                className="text-lg font-semibold text-[#0969da] hover:underline"
              >
                {repo.name}
              </Link>
              <span className="rounded-full border border-[#d1d9e0] px-2 py-0.5 text-xs text-[#59636e]">
                Public
              </span>
              <span className="rounded-full border border-[#d1d9e0] px-2 py-0.5 text-xs text-[#59636e]">
                Pinned
              </span>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#59636e]">
              {repo.pitch}
            </p>
            <p className="mt-2 text-xs text-[#59636e]">{repo.affiliation}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {repo.tags.slice(0, 6).map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-[#ddf4ff] px-2.5 py-0.5 text-xs font-medium text-[#0969da]"
                >
                  {tag}
                </li>
              ))}
            </ul>
            <p className="mt-3 flex items-center gap-2 text-xs text-[#59636e]">
              <span
                aria-hidden
                className="inline-block h-3 w-3 rounded-full"
                style={{
                  backgroundColor: languageColor[repo.language] ?? "#8b949e",
                }}
              />
              {repo.language}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
