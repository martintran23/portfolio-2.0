"use server";

import { mail } from "@/data/mail";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 80;
const MAX_EMAIL = 120;
const MAX_SUBJECT = 160;
const MAX_MESSAGE = 5000;
const MAX_FILES = 3;
const MAX_FILE_BYTES = 2 * 1024 * 1024;
const ALLOWED_FILE =
  /^(image\/|application\/pdf|text\/plain|application\/msword|application\/vnd\.openxmlformats-officedocument)/;

type SendResult = { ok: true } | { ok: false; error: string };

const recentByEmail = new Map<string, number[]>();

function tooMany(email: string) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const stamps = (recentByEmail.get(email) ?? []).filter((time) => now - time < windowMs);
  if (stamps.length >= 5) {
    recentByEmail.set(email, stamps);
    return true;
  }
  stamps.push(now);
  recentByEmail.set(email, stamps);
  return false;
}

function asText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function sendPortfolioMail(formData: FormData): Promise<SendResult> {
  if (asText(formData.get("company"))) {
    return { ok: true };
  }

  const name = asText(formData.get("name"));
  const email = asText(formData.get("email"));
  const subject = asText(formData.get("subject"));
  const message = asText(formData.get("message"));
  const files = formData
    .getAll("files")
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (!name || name.length > MAX_NAME) {
    return { ok: false, error: "Enter a valid name." };
  }
  if (!EMAIL.test(email) || email.length > MAX_EMAIL) {
    return { ok: false, error: "Enter a valid email." };
  }
  if (subject.length > MAX_SUBJECT || /[\r\n]/.test(subject)) {
    return { ok: false, error: "Enter a valid subject." };
  }
  if (!message || message.length > MAX_MESSAGE) {
    return { ok: false, error: "Enter a message." };
  }
  if (files.length > MAX_FILES) {
    return { ok: false, error: "You can attach up to 3 files." };
  }
  for (const file of files) {
    if (file.size > MAX_FILE_BYTES) {
      return { ok: false, error: `${file.name} is over 2MB.` };
    }
    if (file.type && !ALLOWED_FILE.test(file.type)) {
      return { ok: false, error: `${file.name} is not an allowed file type.` };
    }
  }

  const visitor = email.toLowerCase();
  if (tooMany(visitor)) {
    return { ok: false, error: "Too many notes from this address. Try again later." };
  }

  const topic = subject || `Note from ${name}`;
  const body = [`Name: ${name}`, `Email: ${email}`, "", message].join("\n");
  const to = process.env.MAIL_TO?.trim() || mail.to;

  if (process.env.RESEND_API_KEY) {
    return sendWithResend({ to, email, topic, body, files });
  }

  return {
    ok: false,
    error:
      "Sending is not configured yet. Add WEB3FORMS_ACCESS_KEY or RESEND_API_KEY, then restart the app.",
  };
}

async function sendWithResend({
  to,
  email,
  topic,
  body,
  files,
}: {
  to: string;
  email: string;
  topic: string;
  body: string;
  files: File[];
}): Promise<SendResult> {
  const attachments = await Promise.all(
    files.map(async (file) => ({
      filename: file.name,
      content: Buffer.from(await file.arrayBuffer()).toString("base64"),
    })),
  );

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM?.trim() || "Portfolio <beth.t@example.com>",
      to: [to],
      reply_to: email,
      subject: topic,
      text: body,
      attachments,
    }),
  });

  if (!response.ok) {
    console.error("Resend rejected a portfolio note", response.status);
    return {
      ok: false,
      error: "Could not send right now. Try again or use Open in Gmail.",
    };
  }

  return { ok: true };
}
