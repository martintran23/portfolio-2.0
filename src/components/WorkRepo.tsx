import Link from "next/link";
import type { Repo } from "@/data/work";

function ReadmeSection({
  title,
  items,
}: {
  title: string;
  items: readonly string[];
}) {
  return (
    <section className="mt-8">
      <h3 className="border-b border-[#d1d9e0] pb-2 text-xl font-semibold">
        {title}
      </h3>
      {items.length === 1 ? (
        <p className="mt-3 text-sm leading-7 text-[#1f2328]">{items[0]}</p>
      ) : (
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-[#1f2328]">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function WorkRepo({ repo }: { repo: Repo }) {
  return (
    <div className="min-h-full w-full min-w-0 overflow-x-hidden bg-white text-[#1f2328]">
      <div className="border-b border-[#d1d9e0] px-4 py-4 sm:px-6">
        <p className="text-sm text-[#59636e]">
          <Link href="/work/repositories" className="text-[#0969da] hover:underline">
            repositories
          </Link>
          <span className="px-1">/</span>
          <span className="font-semibold text-[#1f2328]">{repo.name}</span>
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-semibold text-[#0969da]">{repo.name}</h1>
          <span className="rounded-full border border-[#d1d9e0] px-2 py-0.5 text-xs text-[#59636e]">
            Public
          </span>
        </div>
        <p className="mt-2 text-sm text-[#59636e]">{repo.affiliation}</p>
      </div>

      <div className="flex min-w-0 flex-col gap-6 p-4 sm:p-6 xl:flex-row">
        <article className="min-w-0 flex-1 rounded-md border border-[#d1d9e0]">
          <div className="border-b border-[#d1d9e0] bg-[#f6f8fa] px-4 py-2 text-sm font-semibold">
            README.md
          </div>
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-2xl font-semibold">{repo.name}</h2>
            <p className="mt-3 text-sm leading-7 text-[#1f2328]">{repo.pitch}</p>
            <ReadmeSection title="Problem" items={[repo.problem]} />
            <ReadmeSection title="What was built" items={repo.built} />
            <ReadmeSection title="My role" items={repo.role} />
            <ReadmeSection title="Outcome" items={repo.outcome} />
          </div>
        </article>

        <aside className="w-full shrink-0 space-y-4 lg:w-64">
          <section>
            <h2 className="text-sm font-semibold">About</h2>
            <p className="mt-2 text-sm leading-6 text-[#59636e]">{repo.pitch}</p>
            <div className="mt-3 space-y-2 text-sm">
              <a
                href={repo.github}
                target="_blank"
                rel="noreferrer"
                className="block font-semibold text-[#0969da] hover:underline"
              >
                View on GitHub
              </a>
              {repo.live ? (
                <a
                  href={repo.live}
                  target="_blank"
                  rel="noreferrer"
                  className="block font-semibold text-[#0969da] hover:underline"
                >
                  Live demo
                </a>
              ) : null}
            </div>
          </section>
          <section>
            <h2 className="text-sm font-semibold">Topics</h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {repo.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-[#ddf4ff] px-2.5 py-0.5 text-xs font-medium text-[#0969da]"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
