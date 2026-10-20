"use client";

import { useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { sendPortfolioMail } from "@/app/mail/actions";
import { gmailComposeUrl, mail, mailtoUrl } from "@/data/mail";

const emojis = ["👋", "🙂", "👍", "📌", "✨"];

async function sendViaWeb3Forms({
  accessKey,
  name,
  email,
  topic,
  body,
}: {
  accessKey: string;
  name: string;
  email: string;
  topic: string;
  body: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: accessKey,
      name,
      email,
      subject: topic,
      from_name: name,
      message: body,
    }),
  });

  const result = (await response.json().catch(() => null)) as {
    success?: boolean;
    message?: string;
  } | null;

  if (!response.ok || !result?.success) {
    return {
      ok: false,
      error: "Could not send right now. Try again or use Open in Gmail.",
    };
  }

  return { ok: true };
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full text-[#444746] hover:bg-[#f1f3f4]"
    >
      {children}
    </button>
  );
}

export function MailCompose({ accessKey = "" }: { accessKey?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [showFormat, setShowFormat] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showSendMenu, setShowSendMenu] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "failed" | "opened" | "blocked" | "invalid"
  >("idle");
  const [error, setError] = useState("");
  const [openedHref, setOpenedHref] = useState<string | null>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const attachRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const draft = useMemo(() => {
    const topic =
      subject.trim() || `Note from ${name.trim() || "portfolio visitor"}`;
    const lines = [
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      "",
      message.trim(),
    ];

    if (files.length > 0) {
      lines.push(
        "",
        `Files noted: ${files.map((file) => file.name).join(", ")}`,
      );
    }

    return {
      topic,
      body: lines.join("\n"),
    };
  }, [name, email, subject, message, files]);

  const gmailHref = gmailComposeUrl(mail.to, draft.topic, draft.body);
  const mailtoHref = mailtoUrl(mail.to, draft.topic, draft.body);

  function openHref(href: string) {
    setShowSendMenu(false);
    const popup = window.open(href, "_blank", "noopener,noreferrer");
    if (!popup) {
      setOpenedHref(href);
      setStatus("blocked");
      return;
    }
    setOpenedHref(null);
    setStatus("opened");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("invalid");
      setError("");
      return;
    }

    setStatus("sending");
    setError("");
    setOpenedHref(null);
    setShowSendMenu(false);

    try {
      const result = accessKey
        ? await sendViaWeb3Forms({
            accessKey,
            name: name.trim(),
            email: email.trim(),
            topic: draft.topic,
            body: draft.body,
          })
        : await sendPortfolioMail(buildMailPayload());
      if (result.ok) {
        setStatus("sent");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setFiles([]);
        return;
      }
      setStatus("failed");
      setError(result.error);
    } catch {
      setStatus("failed");
      setError("Could not send right now. Try again or use Open in Gmail.");
    }
  }

  function buildMailPayload() {
    const payload = new FormData();
    payload.set("name", name.trim());
    payload.set("email", email.trim());
    payload.set("subject", subject.trim());
    payload.set("message", message.trim());
    payload.set("company", "");
    for (const file of files) {
      payload.append("files", file, file.name);
    }
    return payload;
  }

  function wrapSelection(before: string, after = before) {
    const field = messageRef.current;
    if (!field) return;
    const start = field.selectionStart;
    const end = field.selectionEnd;
    const selected = message.slice(start, end) || "text";
    const next = message.slice(0, start) + before + selected + after + message.slice(end);
    setMessage(next);
    requestAnimationFrame(() => {
      field.focus();
      const cursor = start + before.length + selected.length + after.length;
      field.setSelectionRange(cursor, cursor);
    });
  }

  function insertText(text: string) {
    const field = messageRef.current;
    if (!field) return;
    const start = field.selectionStart;
    const end = field.selectionEnd;
    const next = message.slice(0, start) + text + message.slice(end);
    setMessage(next);
    requestAnimationFrame(() => {
      field.focus();
      const cursor = start + text.length;
      field.setSelectionRange(cursor, cursor);
    });
  }

  function insertLink() {
    const url = window.prompt("Link URL");
    if (!url) return;
    wrapSelection("[", `](${url})`);
  }

  function addFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    setFiles((current) => [...current, ...Array.from(list)]);
  }

  function clearDraft() {
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setFiles([]);
    setShowFormat(false);
    setShowEmoji(false);
    setStatus("idle");
    setError("");
    setOpenedHref(null);
  }

  return (
    <section className="min-w-0">
      <form
        id="mail-compose"
        onSubmit={onSubmit}
        className="flex min-h-[28rem] flex-col overflow-hidden rounded-xl border border-gm-border bg-gm-card shadow-[0_8px_28px_rgba(32,33,36,0.12)]"
      >
        <div className="border-b border-gm-border bg-[#f2f2f2] px-4 py-2.5 text-sm">
          New message
        </div>
        <input
          name="company"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden
        />

        <label className="flex items-center gap-3 border-b border-gm-border px-4 py-2">
          <span className="w-14 shrink-0 text-sm text-gm-muted">To</span>
          <input
            readOnly
            value={mail.to}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </label>

        <label className="flex items-center gap-3 border-b border-gm-border px-4 py-2">
          <span className="w-14 shrink-0 text-sm text-gm-muted">Name</span>
          <input
            required
            id="mail-name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </label>

        <label className="flex items-center gap-3 border-b border-gm-border px-4 py-2">
          <span className="w-14 shrink-0 text-sm text-gm-muted">From</span>
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </label>

        <label className="flex items-center gap-3 border-b border-gm-border px-4 py-2">
          <span className="w-14 shrink-0 text-sm text-gm-muted">Subject</span>
          <input
            name="subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Internship / backend / applied AI"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gm-muted"
          />
        </label>

        <label className="flex min-h-0 flex-1 flex-col px-4 py-3">
          <span className="sr-only">Message</span>
          <textarea
            required
            ref={messageRef}
            id="mail-message"
            name="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="What should we talk about?"
            className="min-h-40 flex-1 resize-y bg-transparent text-sm leading-6 outline-none placeholder:text-gm-muted"
          />
        </label>

        {files.length > 0 ? (
          <ul className="flex flex-wrap gap-2 px-4 pb-2">
            {files.map((file) => (
              <li
                key={`${file.name}-${file.size}`}
                className="rounded-full bg-[#f1f3f4] px-3 py-1 text-xs text-gm-text"
              >
                {file.name}
              </li>
            ))}
          </ul>
        ) : null}

        {showFormat ? (
          <div className="flex flex-wrap gap-1 border-t border-gm-border px-3 py-1">
            <IconButton label="Bold" onClick={() => wrapSelection("**")}>
              <span className="text-sm font-bold">B</span>
            </IconButton>
            <IconButton label="Italic" onClick={() => wrapSelection("*")}>
              <span className="text-sm italic">I</span>
            </IconButton>
            <IconButton label="Underline" onClick={() => wrapSelection("<u>", "</u>")}>
              <span className="text-sm underline">U</span>
            </IconButton>
          </div>
        ) : null}

        {showEmoji ? (
          <div className="flex flex-wrap gap-1 border-t border-gm-border px-3 py-1">
            {emojis.map((emoji) => (
              <IconButton
                key={emoji}
                label={`Insert ${emoji}`}
                onClick={() => insertText(emoji)}
              >
                <span>{emoji}</span>
              </IconButton>
            ))}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-1 px-3 py-3">
          <div className="relative mr-1 flex">
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-l-full bg-gm-send px-5 py-2 text-sm font-medium text-white hover:bg-gm-send-hover disabled:opacity-60"
            >
              {status === "sending" ? "Sending..." : "Send"}
            </button>
            <button
              type="button"
              aria-label="More send options"
              aria-expanded={showSendMenu}
              onClick={() => setShowSendMenu((open) => !open)}
              className="rounded-r-full border-l border-white/30 bg-gm-send px-2 text-white hover:bg-gm-send-hover"
            >
              ▾
            </button>
            {showSendMenu ? (
              <div className="absolute bottom-full left-0 z-10 mb-2 min-w-48 overflow-hidden rounded-lg border border-gm-border bg-white py-1 shadow-lg">
                <a
                  href={gmailHref}
                  target="_blank"
                  rel="noreferrer"
                  className="block px-3 py-2 text-sm hover:bg-[#f1f3f4]"
                  onClick={() => setShowSendMenu(false)}
                >
                  Open in Gmail
                </a>
                <a
                  href={mailtoHref}
                  className="block px-3 py-2 text-sm hover:bg-[#f1f3f4]"
                  onClick={() => setShowSendMenu(false)}
                >
                  Open in email app
                </a>
              </div>
            ) : null}
          </div>

          <IconButton
            label="Formatting options"
            onClick={() => {
              setShowEmoji(false);
              setShowFormat((open) => !open);
            }}
          >
            <span className="text-sm font-medium">Aa</span>
          </IconButton>
          <IconButton label="Attach files" onClick={() => attachRef.current?.click()}>
            <PaperclipIcon />
          </IconButton>
          <IconButton label="Insert link" onClick={insertLink}>
            <LinkIcon />
          </IconButton>
          <IconButton
            label="Insert emoji"
            onClick={() => {
              setShowFormat(false);
              setShowEmoji((open) => !open);
            }}
          >
            <EmojiIcon />
          </IconButton>
          <IconButton label="Insert image" onClick={() => imageRef.current?.click()}>
            <ImageIcon />
          </IconButton>
          <span className="ml-auto">
            <IconButton label="Discard draft" onClick={clearDraft}>
              <TrashIcon />
            </IconButton>
          </span>
        </div>

        <input
          ref={attachRef}
          type="file"
          multiple
          className="hidden"
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
        />
        <input
          ref={imageRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </form>

      <p className="mt-3 text-sm leading-6 text-gm-muted" aria-live="polite">
        {status === "sending"
          ? "Sending your note..."
          : status === "sent"
            ? "Sent. I will get back to you at the address you used."
            : status === "failed"
              ? error
              : status === "opened"
                ? "Gmail should open in a new tab with this note filled in."
                : status === "blocked"
                  ? "The browser blocked the new tab."
                  : status === "invalid"
                    ? "Add your name, email, and a message before sending."
                    : "Send delivers this note to my inbox. Open in Gmail stays in the arrow menu if you prefer."}
        {status === "failed" || status === "blocked" ? (
          <>
            {" "}
            <a
              href={openedHref ?? gmailHref}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-gm-send hover:underline"
            >
              Open in Gmail
            </a>
          </>
        ) : null}
      </p>
    </section>
  );
}

function PaperclipIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="currentColor"
        d="M16.5 6.75v10.1a4.25 4.25 0 1 1-8.5 0V6.2a2.7 2.7 0 1 1 5.4 0v10.1a1.15 1.15 0 1 1-2.3 0V7.5h-1.5v8.8a2.65 2.65 0 1 0 5.3 0V6.2a4.2 4.2 0 1 0-8.4 0v10.65a5.75 5.75 0 1 0 11.5 0V6.75h-1.5Z"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="currentColor"
        d="M10.6 13.4a4 4 0 0 1 0-5.66l3.18-3.18a4 4 0 0 1 5.66 5.66l-1.45 1.45-1.06-1.06 1.45-1.45a2.5 2.5 0 0 0-3.54-3.54L11.66 8.8a2.5 2.5 0 0 0 0 3.54l.7.7-1.06 1.06-.7-.7Zm2.8-2.8a4 4 0 0 1 0 5.66l-3.18 3.18a4 4 0 1 1-5.66-5.66l1.45-1.45 1.06 1.06-1.45 1.45a2.5 2.5 0 0 0 3.54 3.54l3.18-3.18a2.5 2.5 0 0 0 0-3.54l-.7-.7 1.06-1.06.7.7Z"
      />
    </svg>
  );
}

function EmojiIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Zm-3.2-8.7a1.1 1.1 0 1 0-1.1-1.1 1.1 1.1 0 0 0 1.1 1.1Zm6.4 0a1.1 1.1 0 1 0-1.1-1.1 1.1 1.1 0 0 0 1.1 1.1ZM12 17.3A4.3 4.3 0 0 0 16 15h-1.2a3.1 3.1 0 0 1-5.6 0H8a4.3 4.3 0 0 0 4 2.3Z"
      />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="currentColor"
        d="M19 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 12H5l4.5-6 3.2 4.2 2.3-3L19 17Zm-8.2-8.2A1.3 1.3 0 1 1 9.5 7.5a1.3 1.3 0 0 1 1.3 1.3Z"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="currentColor"
        d="M15.5 4 14.8 3H9.2L8.5 4H5v1.5h14V4ZM7 19.5A1.5 1.5 0 0 0 8.5 21h7a1.5 1.5 0 0 0 1.5-1.5V7H7ZM9 9h1.5v9H9Zm4.5 0H15v9h-1.5Z"
      />
    </svg>
  );
}
