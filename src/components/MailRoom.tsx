import { Suspense } from "react";
import { MailCompose } from "@/components/MailCompose";
import { mail } from "@/data/mail";

function ComposeFallback() {
  return (
    <section className="min-h-[28rem] rounded-xl border border-gm-border bg-gm-card" />
  );
}

export function MailRoom({ accessKey = "" }: { accessKey?: string }) {
  return (
    <div className="flex min-h-full min-w-0 flex-col bg-gm-canvas text-gm-text">
      <header className="border-b border-gm-border px-4 py-4 sm:px-6">
        <h1 className="text-xl font-normal">Mail</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gm-muted">{mail.cta}</p>
      </header>

      <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 p-3 sm:p-4 lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:gap-6">
        <aside className="min-w-0">
          <a
            href="#mail-name"
            title="Start a new message"
            className="inline-flex items-center gap-3 rounded-2xl bg-gm-compose px-5 py-3 text-sm font-medium text-gm-text shadow-sm hover:brightness-95"
          >
            <PencilIcon />
            Compose
          </a>

          <nav aria-label="Socials" className="mt-4">
            <p className="px-3 text-xs font-medium uppercase tracking-wide text-gm-muted">
              Labels
            </p>
            <ul className="mt-2 space-y-1">
              {mail.labels.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noreferrer" : undefined}
                    className="flex min-w-0 items-center justify-between gap-2 rounded-full px-3 py-2 text-sm hover:bg-gm-rail"
                  >
                    <span className="font-medium">{item.label}</span>
                    <span className="truncate text-xs text-gm-muted">{item.detail}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <Suspense fallback={<ComposeFallback />}>
          <MailCompose accessKey={accessKey} />
        </Suspense>
      </div>
    </div>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="currentColor"
        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm17.71-10.21a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z"
      />
    </svg>
  );
}
