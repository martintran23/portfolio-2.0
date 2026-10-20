import { profile } from "./profile";

export function gmailComposeUrl(to: string, subject?: string, body?: string) {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to,
  });

  if (subject) params.set("su", subject);
  if (body) params.set("body", body);

  return `https://mail.google.com/mail/?${params.toString()}`;
}

export function mailtoUrl(to: string, subject?: string, body?: string) {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString();
  return query ? `mailto:${to}?${query}` : `mailto:${to}`;
}

export const mail = {
  cta: "Want to talk about internships, backend systems, or applied AI? Email me at 23martintran@gmail.com or reach out on LinkedIn.",
  to: profile.contacts.email,
  labels: [
    {
      id: "email",
      label: "Email",
      href: gmailComposeUrl(profile.contacts.email),
      detail: profile.contacts.email,
      external: true,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: profile.contacts.linkedin,
      detail: "23martintran",
      external: true,
    },
    {
      id: "github",
      label: "GitHub",
      href: profile.contacts.github,
      detail: "martintran23",
      external: true,
    },
  ],
} as const;
