import {
  contributionMonths,
  contributionTotal,
  contributionWeeks,
} from "@/data/contributions";
import {
  githubProfile,
  listedRepos,
  type GithubProfile,
  type ListedRepo,
} from "@/data/github";

const login = githubProfile.login;
const revalidate = 3600;
const userAgent =
  "portfolio-2.0 (https://github.com/martintran23/portfolio-2.0)";

export type ContributionMonth = {
  index: number;
  label: string;
};

export type ContributionCalendar = {
  total: number;
  year: number;
  weeks: number[][];
  months: ContributionMonth[];
};

export type GithubRoomData = {
  profile: GithubProfile;
  calendar: ContributionCalendar;
  repos: ListedRepo[];
};

const fallbackCalendar: ContributionCalendar = {
  total: contributionTotal,
  year: 2026,
  weeks: contributionWeeks.map((week) => [...week]),
  months: contributionMonths.map((month) => ({ ...month })),
};

function requestHeaders(json = false) {
  const token = process.env.GITHUB_TOKEN;
  return {
    "User-Agent": userAgent,
    ...(json ? { Accept: "application/vnd.github+json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function fetchGithubJson(url: string) {
  const response = await fetch(url, {
    headers: requestHeaders(true),
    next: { revalidate },
  });
  if (!response.ok) return null;
  return response.json();
}

function parseCalendar(html: string): ContributionCalendar | null {
  const days: { date: string; level: number }[] = [];

  for (const match of html.matchAll(
    /<td\b[^>]*\bContributionCalendar-day\b[^>]*>/gi,
  )) {
    const tag = match[0];
    const date = tag.match(/data-date="(\d{4}-\d{2}-\d{2})"/)?.[1];
    const level = Number(tag.match(/data-level="(\d+)"/)?.[1]);
    if (!date || Number.isNaN(level)) continue;
    days.push({ date, level: Math.min(4, Math.max(0, level)) });
  }

  if (days.length < 28) return null;
  days.sort((a, b) => a.date.localeCompare(b.date));

  const weeks: number[][] = [];
  for (let index = 0; index < days.length; index += 7) {
    const chunk = days.slice(index, index + 7).map((day) => day.level);
    while (chunk.length < 7) chunk.push(0);
    weeks.push(chunk);
  }

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const months: ContributionMonth[] = [];
  let lastMonth = -1;
  weeks.forEach((_, weekIndex) => {
    const start = days[weekIndex * 7];
    if (!start) return;
    const month = Number(start.date.slice(5, 7)) - 1;
    if (month === lastMonth) return;
    months.push({ index: weekIndex, label: monthNames[month] ?? "" });
    lastMonth = month;
  });

  const heading = html.match(
    /(\d[\d,]*)\s+contributions\s+in the last year/i,
  )?.[1];
  const total = heading
    ? Number(heading.replace(/,/g, ""))
    : days.filter((day) => day.level > 0).length;
  const lastDate = days[days.length - 1]?.date ?? "";
  const year = Number(lastDate.slice(0, 4)) || new Date().getUTCFullYear();

  if (!Number.isFinite(total)) return null;
  return { total, year, weeks, months };
}

export async function loadGithubRoom(): Promise<GithubRoomData> {
  const [user, html, stars] = await Promise.all([
    fetchGithubJson(`https://api.github.com/users/${login}`),
    fetch(`https://github.com/users/${login}/contributions`, {
      headers: requestHeaders(),
      next: { revalidate },
    })
      .then((response) => (response.ok ? response.text() : null))
      .catch(() => null),
    Promise.all(
      listedRepos.map(async (repo) => {
        const data = await fetchGithubJson(
          `https://api.github.com/repos/${login}/${repo.name}`,
        );
        return {
          name: repo.name,
          stars:
            typeof data?.stargazers_count === "number"
              ? data.stargazers_count
              : repo.stars,
        };
      }),
    ),
  ]);

  const calendar = html ? (parseCalendar(html) ?? fallbackCalendar) : fallbackCalendar;
  const starMap = new Map(stars.map((item) => [item.name, item.stars]));

  return {
    profile: {
      ...githubProfile,
      avatar:
        typeof user?.avatar_url === "string"
          ? user.avatar_url
          : githubProfile.avatar,
      followers:
        typeof user?.followers === "number"
          ? user.followers
          : githubProfile.followers,
      following:
        typeof user?.following === "number"
          ? user.following
          : githubProfile.following,
      publicRepos:
        typeof user?.public_repos === "number"
          ? user.public_repos
          : githubProfile.publicRepos,
    },
    calendar,
    repos: listedRepos.map((repo) => ({
      ...repo,
      stars: starMap.get(repo.name) ?? repo.stars,
    })),
  };
}
