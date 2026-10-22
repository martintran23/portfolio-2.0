import { connection } from "next/server";
import { MailRoom } from "@/components/MailRoom";
import { ProfileRoom } from "@/components/ProfileRoom";
import { Shell } from "@/components/Shell";
import { WorkRoom } from "@/components/WorkRoom";
import { loadGithubRoom } from "@/lib/github";

export async function AppShell({ children }: { children: React.ReactNode }) {
  await connection();
  const github = await loadGithubRoom();
  const accessKey =
    process.env.WEB3FORMS_ACCESS_KEY ??
    process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ??
    "";

  return (
    <Shell
      previews={{
        profile: <ProfileRoom />,
        work: <WorkRoom tab="overview" {...github} />,
        mail: <MailRoom accessKey={accessKey} />,
      }}
    >
      {children}
    </Shell>
  );
}
