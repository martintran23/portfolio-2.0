import Link from "next/link";
import { AboutSection } from "@/components/AboutSection";
import { profile } from "@/data/profile";

function Card({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-li-border bg-li-card">
      {title ? (
        <h2 className="px-4 pt-4 text-xl font-semibold text-li-text sm:px-6">
          {title}
        </h2>
      ) : null}
      <div className={title ? "px-4 pb-4 pt-3 sm:px-6" : undefined}>{children}</div>
    </section>
  );
}

function CompanyMark({ name }: { name: string }) {
  return (
    <div
      aria-hidden
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-[#e9e5df] text-lg font-semibold text-[#5e5e5e]"
    >
      {name[0]}
    </div>
  );
}

export function ProfileRoom() {
  return (
    <div className="min-h-full bg-li-canvas p-2 sm:p-3">
      <div className="space-y-2">
        <section className="overflow-hidden rounded-lg border border-li-border bg-li-card">
          <div className="h-28 bg-[linear-gradient(90deg,#004182_0%,#0a66c2_42%,#70b5f9_100%)] sm:h-40" />
          <div className="px-4 pb-5 sm:px-6">
            <div className="-mt-12 sm:-mt-16">
              <div className="relative h-28 w-28 sm:h-36 sm:w-36">
                <div className="absolute inset-0 rounded-full border-[5px] border-li-green" />
                <div className="absolute inset-[5px] flex items-center justify-center rounded-full border-4 border-white bg-li-blue text-3xl font-semibold text-white sm:text-4xl">
                  MT
                </div>
              </div>
            </div>

            <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h1 className="text-2xl font-semibold tracking-tight text-li-text">
                  {profile.name}
                </h1>
                <p className="mt-1 text-[15px] leading-6 text-li-text">
                  {profile.headline}
                </p>
                <p className="mt-1 text-sm text-li-muted">
                  {profile.education.school}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-li-open px-4 py-3">
              <p className="text-sm font-semibold text-li-green">Open to work</p>
              <p className="mt-1 text-sm leading-6 text-li-text">
                Software Engineer / Backend / Applied AI internships
              </p>
              <p className="mt-1 text-sm leading-6 text-li-muted">
                {profile.lookingFor}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/mail"
                className="rounded-full bg-li-blue px-4 py-1.5 text-sm font-semibold text-white hover:bg-li-blue-hover"
              >
                Message
              </Link>
              <Link
                href="/work"
                className="rounded-full border border-li-blue px-4 py-1.5 text-sm font-semibold text-li-blue hover:bg-[#eaf3fb]"
              >
                View projects
              </Link>
            </div>
          </div>
        </section>

        <Card title="Featured">
          <ul className="grid gap-3 sm:grid-cols-3">
            {profile.featuredWork.map((project) => (
              <li key={project.name}>
                <Link
                  href={project.href}
                  className="block h-full overflow-hidden rounded-lg border border-li-border hover:bg-[#f3f2ef]"
                >
                  <div className="h-16 bg-[linear-gradient(135deg,#0a66c2,#70b5f9)]" />
                  <div className="p-3">
                    <p className="text-sm font-semibold text-li-text">
                      {project.name}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-li-muted">
                      {project.pitch}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="About">
          <AboutSection
            preview={profile.aboutPreview}
            more={profile.aboutMore}
            labHref={profile.labHref}
            labPhrase={profile.labPhrase}
          />
        </Card>

        <Card title="Experience">
          <ol>
            {profile.experience.map((job, index) => (
              <li
                key={job.company}
                className={`flex gap-3 ${
                  index > 0 ? "mt-4 border-t border-li-border pt-4" : ""
                }`}
              >
                <CompanyMark name={job.company} />
                <div className="min-w-0">
                  <h3 className="text-[15px] font-semibold text-li-text">
                    {job.role}
                  </h3>
                  <p className="text-sm text-li-text">{job.company} · Internship</p>
                  <p className="text-sm text-li-muted">{job.dates}</p>
                  <p className="text-sm text-li-muted">{job.location}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-li-text">
                    {job.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </Card>

        <Card title="Education">
          <div className="flex gap-3">
            <CompanyMark name={profile.education.school} />
            <div>
              <h3 className="text-[15px] font-semibold text-li-text">
                {profile.education.school}
              </h3>
              <p className="text-sm text-li-text">{profile.education.degree}</p>
              <p className="text-sm text-li-muted">{profile.education.dates}</p>
            </div>
          </div>
        </Card>

        <Card title="Skills">
          <div className="space-y-4">
            {profile.skills.map((group, index) => (
              <div
                key={group.label}
                className={index > 0 ? "border-t border-li-border pt-4" : ""}
              >
                <p className="text-sm font-semibold text-li-text">{group.label}</p>
                <p className="mt-1 text-sm leading-6 text-li-muted">
                  {group.items.join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
