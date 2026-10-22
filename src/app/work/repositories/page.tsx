import { WorkRoom } from "@/components/WorkRoom";
import { loadGithubRoom } from "@/lib/github";

export const instant = false;

export default async function WorkRepositoriesPage() {
  const github = await loadGithubRoom();
  return <WorkRoom tab="repositories" {...github} />;
}
