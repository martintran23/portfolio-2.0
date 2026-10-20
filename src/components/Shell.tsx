"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getRoomIndex, rooms } from "@/lib/rooms";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const index = getRoomIndex(pathname);
  const room = rooms[index];
  const startX = useRef<number | null>(null);

  const goPrev = useCallback(() => {
    if (index > 0) router.push(rooms[index - 1].href);
  }, [index, router]);

  const goNext = useCallback(() => {
    if (index < rooms.length - 1) router.push(rooms[index + 1].href);
  }, [index, router]);

  useEffect(() => {
    for (const nextRoom of rooms) {
      router.prefetch(nextRoom.href);
    }
  }, [router]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target;
      if (target instanceof HTMLElement) {
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) {
          return;
        }
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  function onPointerDown(event: React.PointerEvent<HTMLElement>) {
    if (event.pointerType === "mouse") return;
    startX.current = event.clientX;
  }

  function onPointerUp(event: React.PointerEvent<HTMLElement>) {
    if (event.pointerType === "mouse" || startX.current == null) return;
    const delta = event.clientX - startX.current;
    startX.current = null;
    if (Math.abs(delta) < 64) return;
    if (delta < 0) goNext();
    else goPrev();
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-ink text-paper">
      <header className="flex shrink-0 items-center justify-between border-b border-line px-5 py-3">
        <p className="text-sm tracking-wide">Martin Tran</p>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">
          {room.label}
        </p>
      </header>

      <div className="relative flex min-h-0 min-w-0 flex-1 overflow-hidden">
        <button
          type="button"
          onClick={goPrev}
          disabled={index === 0}
          aria-label="Previous room"
          className="absolute left-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-panel text-lg text-paper disabled:opacity-25 sm:flex"
        >
          ←
        </button>

        <main
          className={`mx-auto flex h-full min-h-0 w-full min-w-0 flex-1 flex-col px-3 py-4 sm:px-6 ${
            room.id === "profile" || room.id === "work"
              ? "max-w-5xl"
              : "max-w-4xl sm:px-16 sm:py-6"
          }`}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          <div
            className={`min-w-0 flex-1 shadow-[0_24px_80px_rgba(0,0,0,0.35)] ${
              room.id === "profile"
                ? "overflow-auto rounded-lg bg-li-canvas text-li-text"
                : room.id === "work"
                  ? "overflow-x-hidden overflow-y-auto rounded-lg bg-white text-[#1f2328]"
                  : "overflow-auto rounded-2xl bg-paper text-paper-ink"
            }`}
          >
            {children}
          </div>
        </main>

        <button
          type="button"
          onClick={goNext}
          disabled={index === rooms.length - 1}
          aria-label="Next room"
          className="absolute right-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-panel text-lg text-paper disabled:opacity-25 sm:flex"
        >
          →
        </button>
      </div>

      <nav
        aria-label="Rooms"
        className="shrink-0 border-t border-line bg-ink px-4 py-3"
      >
        <ul className="mx-auto flex max-w-md items-center justify-center gap-2">
          {rooms.map((item) => {
            const active = item.href === room.href;
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    active
                      ? "bg-accent text-ink"
                      : "text-muted hover:bg-panel hover:text-paper"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
