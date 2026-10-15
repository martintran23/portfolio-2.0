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
    label: "Work",
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
  const index = rooms.findIndex((room) => room.href === path);
  return index === -1 ? 0 : index;
}
