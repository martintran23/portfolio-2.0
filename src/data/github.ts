export type GithubProfile = {
  name: string;
  login: string;
  avatar: string;
  profileUrl: string;
  followers: number;
  following: number;
  publicRepos: number;
};

export const githubProfile: GithubProfile = {
  name: "Martin Tran",
  login: "martintran23",
  avatar: "https://avatars.githubusercontent.com/u/190976810?v=4",
  profileUrl: "https://github.com/martintran23",
  followers: 1,
  following: 0,
  publicRepos: 23,
};

export type ListedRepo = {
  name: string;
  description: string;
  language: string | null;
  stars: number;
  href: string;
  external: boolean;
  pinned: boolean;
};

export const listedRepos: ListedRepo[] = [
  {
    name: "RevenueTwin",
    description:
      "AI revenue audit that checks whether advisory agreements and actual billing stay aligned, with deterministic math for fees and Bedrock for evidence-grounded investigation.",
    language: "Python",
    stars: 2,
    href: "/work/revenuetwin",
    external: false,
    pinned: true,
  },
  {
    name: "WeCalendar",
    description:
      "Shared calendar and notes for invite-code workspaces, with realtime sync, conflict-aware scheduling, and a full collaborative Notes system.",
    language: "TypeScript",
    stars: 0,
    href: "/work/wecalendar",
    external: false,
    pinned: true,
  },
  {
    name: "zotwatt",
    description:
      "Solar usage optimizer that recommends the best times to run household appliances from forecasted solar availability.",
    language: "TypeScript",
    stars: 2,
    href: "/work/watttime",
    external: false,
    pinned: true,
  },
];

export const pinnedRepos = listedRepos.filter((repo) => repo.pinned);
export const languageColor: Record<string, string> = {
  Python: "#3572A5",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  HTML: "#e34c26",
  Kotlin: "#A97BFF",
};
