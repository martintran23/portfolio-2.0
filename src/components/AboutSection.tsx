"use client";

import { useState } from "react";

type AboutSectionProps = {
  preview: readonly string[];
  more: readonly string[];
  labHref: string;
  labPhrase: string;
};

function AboutParagraph({
  text,
  labHref,
  labPhrase,
}: {
  text: string;
  labHref: string;
  labPhrase: string;
}) {
  if (!text.includes(labPhrase)) {
    return <p>{text}</p>;
  }

  const [before, after] = text.split(labPhrase);

  return (
    <p>
      {before}
      <a
        href={labHref}
        target="_blank"
        rel="noreferrer"
        className="font-semibold text-li-blue hover:underline"
      >
        {labPhrase}
      </a>
      {after}
    </p>
  );
}

export function AboutSection({
  preview,
  more,
  labHref,
  labPhrase,
}: AboutSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="space-y-2 text-sm leading-6 text-li-text">
        {preview.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {open
          ? more.map((paragraph) => (
              <AboutParagraph
                key={paragraph}
                text={paragraph}
                labHref={labHref}
                labPhrase={labPhrase}
              />
            ))
          : null}
      </div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="mt-2 text-sm font-semibold text-li-muted hover:text-li-blue"
      >
        {open ? "...see less" : "...see more"}
      </button>
    </div>
  );
}
