import { WorkRoom } from "@/components/WorkRoom";
import { loadGithubRoom } from "@/lib/github";

export const instant = false;

export default async function WorkPage() {
  const github = await loadGithubRoom();
  return <WorkRoom tab="overview" {...github} />;
}
