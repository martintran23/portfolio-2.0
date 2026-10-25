"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { IntroDesktopBackground } from "./IntroDesktopBackground";

const storageKey = "mt-intro-seen";

type Phase = "wait" | "boot" | "desktop" | "done";

export function Intro({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("wait");

  const finish = useCallback(() => {
    sessionStorage.setItem(storageKey, "1");
    setPhase("done");
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem(storageKey)) {
      setPhase("done");
      return;
    }
    setPhase("boot");
  }, []);

  useEffect(() => {
    if (phase !== "boot") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setPhase("desktop"), reduce ? 700 : 2400);
    return () => window.clearTimeout(timer);
  }, [phase]);

  return (
    <>
      {phase !== "done" ? (
        <div className="fixed inset-0 z-50">
          {phase === "desktop" ? <Desktop onOpen={finish} /> : <Boot />}
          <button
            type="button"
            onClick={finish}
            className="absolute right-4 top-4 z-20 rounded-full bg-white/80 px-3 py-1.5 text-sm text-[#3d4654] shadow-sm backdrop-blur hover:bg-white"
          >
            Skip
          </button>
        </div>
      ) : null}
      <div
        aria-hidden={phase !== "done"}
        className={
          phase === "done"
            ? "h-full"
            : "pointer-events-none invisible absolute inset-0"
        }
      >
        {children}
      </div>
    </>
  );
}

function Boot() {
  return (
    <div className="relative flex h-full flex-col items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-md font-mono text-sm text-white/65">
        <p className="intro-boot-line intro-boot-line-a">Starting system</p>
        <p className="intro-boot-line intro-boot-line-b">
          Memory check .............. ok
        </p>
        <p className="intro-boot-line intro-boot-line-c">Loading desktop</p>
      </div>
      <div className="mt-8 h-px w-full max-w-xs overflow-hidden bg-white/15">
        <span className="intro-boot-bar block h-full bg-white" />
      </div>
      <h1 className="intro-boot-name mt-14 text-center text-5xl font-semibold tracking-tight sm:text-6xl">
        Martin Tran
      </h1>
    </div>
  );
}

function Desktop({ onOpen }: { onOpen: () => void }) {
  const folderRef = useRef<HTMLButtonElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const folder = folderRef.current;
    const cursor = cursorRef.current;
    if (!folder || !cursor) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rect = folder.getBoundingClientRect();
    const fromX = window.innerWidth / 2;
    const fromY = window.innerHeight / 2;
    const toX = rect.left + rect.width / 2;
    const toY = rect.top + 26;

    cursor.style.setProperty("--intro-from-x", `${fromX}px`);
    cursor.style.setProperty("--intro-from-y", `${fromY}px`);
    cursor.style.setProperty("--intro-to-x", `${toX}px`);
    cursor.style.setProperty("--intro-to-y", `${toY}px`);

    if (reduce) {
      const timer = window.setTimeout(onOpen, 900);
      return () => window.clearTimeout(timer);
    }

    const onAnimEnd = (event: AnimationEvent) => {
      if (event.animationName === "intro-cursor-move") {
        setPressed(true);
        cursor.classList.add("intro-cursor-click");
        return;
      }
      if (event.animationName === "intro-cursor-click") {
        onOpen();
      }
    };

    cursor.addEventListener("animationend", onAnimEnd);
    cursor.classList.add("intro-cursor-move");

    return () => {
      cursor.removeEventListener("animationend", onAnimEnd);
    };
  }, [onOpen]);

  return (
    <div className="relative h-full cursor-none">
      <IntroDesktopBackground />
      <button
        ref={folderRef}
        type="button"
        onClick={onOpen}
        className={`absolute left-6 top-6 flex w-24 flex-col items-center gap-1 rounded-md p-2 text-center hover:bg-[#0b61d6]/35 ${
          pressed ? "bg-[#0b61d6]/70" : ""
        }`}
      >
        <FolderIcon />
        <span className="px-1 text-center text-xs font-medium leading-tight text-white [text-shadow:1px_1px_1px_rgba(0,0,0,0.85)]">
          Martin Tran
        </span>
      </button>
      <div
        ref={cursorRef}
        className="intro-cursor pointer-events-none absolute left-0 top-0 z-10"
        aria-hidden
      >
        <CursorIcon />
      </div>
    </div>
  );
}

function CursorIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7 drop-shadow" aria-hidden>
      <path
        fill="#fff"
        stroke="#111"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M6 3v22l6.2-6.4 3.6 8.6 3.4-1.4-3.6-8.6H26L6 3z"
      />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 64 52" className="h-12 w-14 drop-shadow" aria-hidden>
      <path
        fill="#f5d36b"
        d="M2 12c0-2.2 1.8-4 4-4h16l4 5h32c2.2 0 4 1.8 4 4v27c0 2.2-1.8 4-4 4H6c-2.2 0-4-1.8-4-4V12Z"
      />
      <path
        fill="#ffe08a"
        d="M2 20h60v20c0 2.2-1.8 4-4 4H6c-2.2 0-4-1.8-4-4V20Z"
      />
    </svg>
  );
}
