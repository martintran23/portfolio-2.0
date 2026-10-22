export const rooms = [
  {
    id: "profile",
    href: "/",
    label: "Profile",
    hint: "Intro, about, and internships",
  },
  {
    id: "work",
    href: "/work",
    label: "Projects",
    hint: "Selected projects as repos",
  },
  {
    id: "mail",
    href: "/mail",
    label: "Mail",
    hint: "Compose and socials",
  },
] as const;

export type RoomId = (typeof rooms)[number]["id"];

export function getRoomIndex(pathname: string) {
  const path = pathname.replace(/\/$/, "") || "/";
  if (path.startsWith("/work")) return 1;
  if (path.startsWith("/mail")) return 2;
  return 0;
}
