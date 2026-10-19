import Link from "next/link";
import {
  contributionMonths,
  contributionTotal,
  contributionWeeks,
} from "@/data/contributions";
import {
  githubProfile,
  languageColor,
  listedRepos,
  pinnedRepos,
  type ListedRepo,
} from "@/data/github";

const levelColor = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];

function RepoLink({
  repo,
  className,
  children,
}: {
  repo: ListedRepo;
  className?: string;
  children: React.ReactNode;
}) {
  if (repo.external) {
    return (
      <a
        href={repo.href}
        target="_blank"
        rel="noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={repo.href} className={className}>
      {children}
    </Link>
  );
}

function LanguageDot({ language }: { language: string | null }) {
  if (!language) return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs text-[#59636e]">
      <span
        aria-hidden
        className="inline-block h-3 w-3 rounded-full"
        style={{ backgroundColor: languageColor[language] ?? "#8b949e" }}
      />
      {language}
    </span>
  );
}

function ContributionGraph() {
  const cell = 11;
  const gap = 3;
  const step = cell + gap;
  const labelWidth = 26;
  const monthHeight = 16;
  const width = labelWidth + contributionWeeks.length * step - gap;
  const height = monthHeight + 7 * step - gap;

  return (
    <section className="w-full min-w-0 rounded-md border border-[#d1d9e0] p-3 sm:p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-sm font-normal text-[#1f2328]">
          {contributionTotal} contributions in the last year
        </h2>
        <p className="text-xs text-[#0969da]">2026</p>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-3 block h-auto w-full"
        role="img"
        aria-label={`${contributionTotal} contributions in the last year`}
      >
        {contributionMonths.map((month) => (
          <text
            key={`${month.label}-${month.index}`}
            x={labelWidth + month.index * step}
            y={11}
            fill="#59636e"
            fontSize="9"
          >
            {month.label}
          </text>
        ))}
        {["Mon", "Wed", "Fri"].map((label, index) => (
          <text
            key={label}
            x={0}
            y={monthHeight + (index * 2 + 1) * step + cell - 1}
            fill="#59636e"
            fontSize="9"
          >
            {label}
          </text>
        ))}
        {contributionWeeks.map((week, weekIndex) =>
          week.map((level, dayIndex) => (
            <rect
              key={`${weekIndex}-${dayIndex}`}
              x={labelWidth + weekIndex * step}
              y={monthHeight + dayIndex * step}
              width={cell}
              height={cell}
              rx={2}
              fill={levelColor[level] ?? levelColor[0]}
            />
          )),
        )}
      </svg>
      <div className="mt-2 flex flex-wrap items-center justify-end gap-1 text-[10px] text-[#59636e]">
        <span>Less</span>
        {levelColor.map((color) => (
          <span
            key={color}
            className="h-2.5 w-2.5 rounded-[2px]"
            style={{ backgroundColor: color }}
          />
        ))}
        <span>More</span>
      </div>
    </section>
  );
}

function Overview() {
  return (
    <div className="w-full min-w-0 space-y-6">
      <section className="w-full min-w-0">
        <h2 className="mb-3 text-sm font-normal text-[#1f2328]">Pinned</h2>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {pinnedRepos.map((repo) => (
            <li
              key={repo.name}
              className="min-w-0 rounded-md border border-[#d1d9e0] p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <RepoLink
                  repo={repo}
                  className="break-all text-sm font-semibold text-[#0969da] hover:underline"
                >
                  {githubProfile.login}/{repo.name}
                </RepoLink>
                <span className="rounded-full border border-[#d1d9e0] px-2 py-0.5 text-[11px] text-[#59636e]">
                  Public
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-[#59636e]">
                {repo.description}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <LanguageDot language={repo.language} />
                <span className="text-xs text-[#59636e]">★ {repo.stars}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <ContributionGraph />

      <section>
        <h2 className="mb-2 text-sm font-normal text-[#1f2328]">
          Activity overview
        </h2>
        <p className="text-sm leading-6 text-[#59636e]">
          Contributed to {pinnedRepos.map((repo) => repo.name).join(", ")}.
          Counts come from public GitHub activity.
        </p>
      </section>
    </div>
  );
}

function RepositoryList() {
  return (
    <ul>
      {listedRepos.map((repo) => (
        <li key={repo.name} className="border-b border-[#d1d9e0] py-5">
          <div className="flex flex-wrap items-center gap-2">
            <RepoLink
              repo={repo}
              className="text-lg font-semibold text-[#0969da] hover:underline"
            >
              {repo.name}
            </RepoLink>
            <span className="rounded-full border border-[#d1d9e0] px-2 py-0.5 text-xs text-[#59636e]">
              Public
            </span>
            {repo.pinned ? (
              <span className="rounded-full border border-[#d1d9e0] px-2 py-0.5 text-xs text-[#59636e]">
                Pinned
              </span>
            ) : null}
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#59636e]">
            {repo.description}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <LanguageDot language={repo.language} />
            <span className="text-xs text-[#59636e]">★ {repo.stars}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function WorkRoom({
  tab,
}: {
  tab: "overview" | "repositories";
}) {
  return (
    <div className="min-h-full w-full min-w-0 overflow-x-hidden bg-white text-[#1f2328]">
      <div className="border-b border-[#d1d9e0] px-4 sm:px-6">
        <nav aria-label="GitHub profile" className="flex gap-6 text-sm">
          <Link
            href="/work"
            aria-current={tab === "overview" ? "page" : undefined}
            className={`border-b-2 py-3 ${
              tab === "overview"
                ? "border-[#fd8c73] font-semibold"
                : "border-transparent text-[#59636e] hover:border-[#d1d9e0]"
            }`}
          >
            Overview
          </Link>
          <Link
            href="/work/repositories"
            aria-current={tab === "repositories" ? "page" : undefined}
            className={`border-b-2 py-3 ${
              tab === "repositories"
                ? "border-[#fd8c73] font-semibold"
                : "border-transparent text-[#59636e] hover:border-[#d1d9e0]"
            }`}
          >
            Repositories
            <span className="ml-2 rounded-full bg-[#eaeef2] px-2 py-0.5 text-xs text-[#59636e]">
              {listedRepos.length}
            </span>
          </Link>
        </nav>
      </div>

      <div className="grid w-full min-w-0 grid-cols-1 gap-6 px-4 py-6 sm:px-6 xl:grid-cols-[11rem_minmax(0,1fr)] xl:gap-8">
        <aside className="flex w-full min-w-0 items-start gap-4 xl:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={githubProfile.avatar}
            alt={`${githubProfile.name} GitHub avatar`}
            width={200}
            height={200}
            className="aspect-square w-24 max-w-full shrink-0 rounded-full border border-[#d1d9e0] object-cover sm:w-32 xl:w-full"
          />
          <div className="min-w-0 flex-1 xl:mt-4">
            <h1 className="text-2xl font-semibold leading-7">
              {githubProfile.name}
            </h1>
            <p className="text-xl font-light text-[#59636e]">
              {githubProfile.login}
            </p>
            <a
              href={githubProfile.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 block max-w-xs rounded-md border border-[#d1d9e0] bg-[#f6f8fa] py-1.5 text-center text-sm font-semibold hover:bg-[#eaeef2] xl:max-w-none"
            >
              Follow
            </a>
            <p className="mt-3 text-sm text-[#59636e]">
              {githubProfile.followers} follower · {githubProfile.following}{" "}
              following
            </p>
            <p className="mt-2 text-sm text-[#59636e]">Pacific Time</p>
          </div>
        </aside>

        <div className="w-full min-w-0">
          {tab === "overview" ? <Overview /> : <RepositoryList />}
        </div>
      </div>
    </div>
  );
}
