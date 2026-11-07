"use client";

import { useState } from "react";

type AboutSectionProps = {
  preview: readonly string[];
  more: readonly string[];
};

export function AboutSection({ preview, more }: AboutSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="space-y-2 text-sm leading-6 text-li-text">
        {preview.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {open
          ? more.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))
          : null}
      </div>
      {more.length > 0 ? (
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="mt-2 text-sm font-semibold text-li-muted hover:text-li-blue"
        >
          {open ? "...see less" : "...see more"}
        </button>
      ) : null}
    </div>
  );
}
