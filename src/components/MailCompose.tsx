"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { sendPortfolioMail } from "@/app/mail/actions";
import { gmailComposeUrl, mail, mailtoUrl } from "@/data/mail";

const emojis = ["👋", "🙂", "👍", "📌", "✨"];

type Attachment = {
  id: string;
  file: File;
};

type DraftImage = {
  id: string;
  file: File;
  url: string;
};

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

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileLabel(file: File) {
  const name = file.name;
  const dot = name.lastIndexOf(".");
  const ext = dot >= 0 ? name.slice(dot + 1).toUpperCase() : "FILE";
  return ext.slice(0, 4);
}

function safeUrl(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const withProtocol =
    /^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    if (
      url.protocol !== "http:" &&
      url.protocol !== "https:" &&
      url.protocol !== "mailto:"
    ) {
      return null;
    }
    return url.href;
  } catch {
    return null;
  }
}

function editorText(editor: HTMLDivElement | null) {
  return (editor?.innerText ?? "").replace(/\u00a0/g, " ").trim();
}

export function MailCompose({ accessKey = "" }: { accessKey?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [images, setImages] = useState<DraftImage[]>([]);
  const [editorEmpty, setEditorEmpty] = useState(true);
  const [showFormat, setShowFormat] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showSendMenu, setShowSendMenu] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "failed" | "opened" | "blocked" | "invalid"
  >("idle");
  const [error, setError] = useState("");
  const [openedHref, setOpenedHref] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const attachRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const linkPopoverRef = useRef<HTMLDivElement>(null);
  const savedRange = useRef<Range | null>(null);

  const draft = useMemo(() => {
    const topic =
      subject.trim() || `Note from ${name.trim() || "portfolio visitor"}`;
    const lines = [`Name: ${name.trim()}`, `Email: ${email.trim()}`, "", message.trim()];

    return {
      topic,
      body: lines.join("\n"),
    };
  }, [name, email, subject, message]);

  const gmailHref = gmailComposeUrl(mail.to, draft.topic, draft.body);
  const mailtoHref = mailtoUrl(mail.to, draft.topic, draft.body);
  const hasDraftContent = Boolean(message.trim()) || images.length > 0;

  const imagesRef = useRef<DraftImage[]>([]);
  imagesRef.current = images;

  useEffect(() => {
    return () => {
      for (const image of imagesRef.current) {
        URL.revokeObjectURL(image.url);
      }
    };
  }, []);

  useEffect(() => {
    if (!linkOpen) return;

    function onPointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (linkPopoverRef.current?.contains(target)) return;
      setLinkOpen(false);
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setLinkOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [linkOpen]);

  function syncMessage() {
    const text = editorText(editorRef.current);
    setMessage(text);
    setEditorEmpty(!text && images.length === 0);
  }

  function focusEditor() {
    editorRef.current?.focus();
  }

  function rememberSelection() {
    const selection = window.getSelection();
    if (
      selection &&
      selection.rangeCount > 0 &&
      editorRef.current?.contains(selection.anchorNode)
    ) {
      savedRange.current = selection.getRangeAt(0).cloneRange();
      return selection.toString();
    }
    savedRange.current = null;
    return "";
  }

  function restoreSelection() {
    const selection = window.getSelection();
    if (!selection || !savedRange.current) return false;
    selection.removeAllRanges();
    selection.addRange(savedRange.current);
    return true;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    syncMessage();
    const text = editorText(editorRef.current);
    if (!name.trim() || !email.trim() || (!text && images.length === 0)) {
      setStatus("invalid");
      setError("");
      return;
    }

    setStatus("sending");
    setError("");
    setOpenedHref(null);
    setShowSendMenu(false);
    setLinkOpen(false);

    try {
      const result = accessKey
        ? await sendViaWeb3Forms({
            accessKey,
            name: name.trim(),
            email: email.trim(),
            topic: draft.topic,
            body: [`Name: ${name.trim()}`, `Email: ${email.trim()}`, "", text].join(
              "\n",
            ),
          })
        : await sendPortfolioMail(buildMailPayload(text));
      if (result.ok) {
        setStatus("sent");
        resetDraft();
        return;
      }
      setStatus("failed");
      setError(result.error);
    } catch {
      setStatus("failed");
      setError("Could not send right now. Try again or use Open in Gmail.");
    }
  }

  function buildMailPayload(text: string) {
    const payload = new FormData();
    payload.set("name", name.trim());
    payload.set("email", email.trim());
    payload.set("subject", subject.trim());
    payload.set("message", text);
    payload.set("company", "");
    for (const item of attachments) {
      payload.append("files", item.file, item.file.name);
    }
    return payload;
  }

  function applyFormat(command: "bold" | "italic" | "underline") {
    focusEditor();
    restoreSelection();
    document.execCommand(command);
    syncMessage();
  }

  function insertText(text: string) {
    focusEditor();
    restoreSelection();
    document.execCommand("insertText", false, text);
    syncMessage();
  }

  function openLinkPopover() {
    const selected = rememberSelection();
    setShowEmoji(false);
    setShowFormat(false);
    setShowSendMenu(false);
    setLinkText(selected);
    setLinkUrl("");
    setLinkOpen(true);
  }

  function applyLink() {
    const href = safeUrl(linkUrl);
    const label = linkText.trim() || href;
    if (!href || !label) return;

    focusEditor();
    const editor = editorRef.current;
    if (!editor) return;

    const link = document.createElement("a");
    link.href = href;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.className = "text-gm-send underline";
    link.textContent = label;

    if (restoreSelection() && savedRange.current) {
      savedRange.current.deleteContents();
      savedRange.current.insertNode(link);
    } else if (editorText(editor)) {
      editor.append(" ");
      editor.appendChild(link);
    } else {
      editor.appendChild(link);
    }

    const selection = window.getSelection();
    selection?.collapseToEnd();
    savedRange.current = null;
    setLinkOpen(false);
    syncMessage();
  }

  function addAttachments(list: FileList | File[] | null) {
    const files = list ? Array.from(list) : [];
    if (files.length === 0) return;
    setAttachments((current) => [
      ...current,
      ...files.map((file) => ({
        id: crypto.randomUUID(),
        file,
      })),
    ]);
  }

  function addImages(list: FileList | File[] | null) {
    const files = list ? Array.from(list) : [];
    const next = files
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
      }));
    if (next.length === 0) return;
    setImages((current) => [...current, ...next]);
    setEditorEmpty(false);
  }

  function removeAttachment(id: string) {
    setAttachments((current) => current.filter((item) => item.id !== id));
  }

  function removeImage(id: string) {
    setImages((current) => {
      const match = current.find((item) => item.id === id);
      if (match) URL.revokeObjectURL(match.url);
      const next = current.filter((item) => item.id !== id);
      setEditorEmpty(!editorText(editorRef.current) && next.length === 0);
      return next;
    });
  }

  function resetDraft() {
    if (editorRef.current) editorRef.current.innerHTML = "";
    for (const image of images) {
      URL.revokeObjectURL(image.url);
    }
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setAttachments([]);
    setImages([]);
    setEditorEmpty(true);
    setShowFormat(false);
    setShowEmoji(false);
    setLinkOpen(false);
    setError("");
    setOpenedHref(null);
  }

  function clearDraft() {
    resetDraft();
    setStatus("idle");
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
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </label>

        <div className="flex min-h-0 flex-1 flex-col px-4 py-3">
          <div className="relative min-h-40 flex-1">
            {editorEmpty ? (
              <p className="pointer-events-none absolute text-sm leading-6 text-gm-muted">
                What should we talk about?
              </p>
            ) : null}
            <div
              ref={editorRef}
              id="mail-message"
              role="textbox"
              aria-multiline="true"
              aria-label="Message"
              contentEditable
              suppressContentEditableWarning
              className="min-h-40 text-sm leading-6 outline-none [&_a]:text-gm-send [&_a]:underline"
              onInput={syncMessage}
            />
          </div>

          {images.length > 0 ? (
            <ul className="mt-3 space-y-3">
              {images.map((image) => (
                <li key={image.id}>
                  <figure className="relative max-w-md overflow-hidden rounded-lg border border-gm-border bg-[#f8f9fa]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.url}
                      alt={image.file.name}
                      className="max-h-64 w-full object-contain"
                    />
                    <button
                      type="button"
                      aria-label={`Remove ${image.file.name}`}
                      onClick={() => removeImage(image.id)}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-lg leading-none text-gm-muted shadow hover:bg-white"
                    >
                      ×
                    </button>
                    <figcaption className="truncate px-3 py-1.5 text-xs text-gm-muted">
                      {image.file.name}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          ) : null}

          {attachments.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {attachments.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg border border-gm-border bg-white px-3 py-2"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#e8f0fe] text-[11px] font-semibold text-gm-send">
                    {fileLabel(item.file)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{item.file.name}</p>
                    <p className="text-xs text-gm-muted">
                      {fileLabel(item.file)} · {formatSize(item.file.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${item.file.name}`}
                    onClick={() => removeAttachment(item.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-lg leading-none text-gm-muted hover:bg-[#f1f3f4]"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {showFormat ? (
          <div className="flex flex-wrap gap-1 border-t border-gm-border px-3 py-1">
            <IconButton label="Bold" onClick={() => applyFormat("bold")}>
              <span className="text-sm font-bold">B</span>
            </IconButton>
            <IconButton label="Italic" onClick={() => applyFormat("italic")}>
              <span className="text-sm italic">I</span>
            </IconButton>
            <IconButton label="Underline" onClick={() => applyFormat("underline")}>
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
              disabled={status === "sending" || !hasDraftContent}
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
              setLinkOpen(false);
              setShowFormat((open) => !open);
            }}
          >
            <span className="text-sm font-medium">Aa</span>
          </IconButton>
          <IconButton
            label="Attach files"
            onClick={() => {
              setLinkOpen(false);
              attachRef.current?.click();
            }}
          >
            <PaperclipIcon />
          </IconButton>
          <div className="relative">
            <IconButton label="Insert link" onClick={openLinkPopover}>
              <LinkIcon />
            </IconButton>
            {linkOpen ? (
              <div
                ref={linkPopoverRef}
                className="absolute bottom-full left-0 z-20 mb-2 w-[min(18rem,calc(100vw-3rem))] rounded-lg border border-gm-border bg-white p-3 shadow-lg"
              >
                <label className="block text-xs text-gm-muted">
                  Text
                  <input
                    value={linkText}
                    onChange={(event) => setLinkText(event.target.value)}
                    className="mt-1 w-full rounded border border-gm-border px-2 py-1.5 text-sm text-gm-text outline-none focus:border-gm-send"
                  />
                </label>
                <label className="mt-2 block text-xs text-gm-muted">
                  URL
                  <input
                    value={linkUrl}
                    onChange={(event) => setLinkUrl(event.target.value)}
                    placeholder="https://"
                    className="mt-1 w-full rounded border border-gm-border px-2 py-1.5 text-sm text-gm-text outline-none focus:border-gm-send"
                  />
                </label>
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setLinkOpen(false)}
                    className="rounded-full px-3 py-1.5 text-sm text-gm-muted hover:bg-[#f1f3f4]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={applyLink}
                    className="rounded-full bg-gm-send px-3 py-1.5 text-sm font-medium text-white hover:bg-gm-send-hover"
                  >
                    Apply
                  </button>
                </div>
              </div>
            ) : null}
          </div>
          <IconButton
            label="Insert emoji"
            onClick={() => {
              setShowFormat(false);
              setLinkOpen(false);
              setShowEmoji((open) => !open);
            }}
          >
            <EmojiIcon />
          </IconButton>
          <IconButton
            label="Insert image"
            onClick={() => {
              setLinkOpen(false);
              imageRef.current?.click();
            }}
          >
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
          id="mail-attachments"
          name="attachments"
          type="file"
          multiple
          className="hidden"
          aria-hidden
          tabIndex={-1}
          onChange={(event) => {
            const files = event.target.files ? Array.from(event.target.files) : [];
            event.target.value = "";
            addAttachments(files);
          }}
        />
        <input
          ref={imageRef}
          id="mail-images"
          name="images"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          aria-hidden
          tabIndex={-1}
          onChange={(event) => {
            const files = event.target.files ? Array.from(event.target.files) : [];
            event.target.value = "";
            addImages(files);
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
                    ? "Add your name, email, and a message or image before sending."
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
