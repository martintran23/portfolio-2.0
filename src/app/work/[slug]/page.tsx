import { notFound } from "next/navigation";
import { WorkRepo } from "@/components/WorkRepo";
import { getRepo, repos } from "@/data/work";

export const instant = false;

export function generateStaticParams() {
  return repos.map((repo) => ({ slug: repo.slug }));
}

export default async function WorkRepoPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const repo = getRepo(slug);

  if (!repo) {
    notFound();
  }

  return <WorkRepo repo={repo} />;
}
