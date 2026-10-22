"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getRoomIndex, rooms, visualRoomOffset } from "@/lib/rooms";

const roomTone: Record<(typeof rooms)[number]["id"], string> = {
  profile: "bg-li-canvas text-li-text",
  work: "bg-white text-[#1f2328]",
  mail: "bg-gm-canvas text-gm-text",
};

export function Shell({
  children,
  previews,
}: {
  children: ReactNode;
  previews: Record<(typeof rooms)[number]["id"], ReactNode>;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const routeIndex = getRoomIndex(pathname);
  const [displayIndex, setDisplayIndex] = useState(routeIndex);
  const intendedIndex = useRef(routeIndex);
  const index = displayIndex;
  const room = rooms[index];
  const startX = useRef<number | null>(null);

  useEffect(() => {
    if (routeIndex === intendedIndex.current) {
      setDisplayIndex(routeIndex);
      return;
    }

    intendedIndex.current = routeIndex;
    setDisplayIndex(routeIndex);
  }, [routeIndex]);

  const showRoom = useCallback((nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= rooms.length) return;
    intendedIndex.current = nextIndex;
    setDisplayIndex(nextIndex);
  }, []);

  const goTo = useCallback(
    (nextIndex: number) => {
      showRoom(nextIndex);
      if (nextIndex !== routeIndex) {
        router.push(rooms[nextIndex].href);
      }
    },
    [routeIndex, router, showRoom],
  );

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== "_self") return;

      const url = new URL(anchor.href, window.location.origin);
      if (url.origin !== window.location.origin) return;

      const nextIndex = getRoomIndex(url.pathname);
      if (nextIndex === intendedIndex.current) return;
      showRoom(nextIndex);
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [showRoom]);

  const goPrev = useCallback(() => {
    goTo(index - 1);
  }, [goTo, index]);

  const goNext = useCallback(() => {
    goTo(index + 1);
  }, [goTo, index]);

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
    <div className="flex h-dvh flex-col overflow-hidden bg-stage text-stage-ink">
      <header className="flex shrink-0 items-center justify-between border-b border-stage-line bg-stage-chrome px-5 py-3">
        <p className="text-sm tracking-wide">Martin Tran</p>
        <p className="text-xs uppercase tracking-[0.18em] text-stage-muted">
          {room.label}
        </p>
      </header>

      <div
        className="relative min-h-0 min-w-0 flex-1 overflow-hidden"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <div className="pointer-events-none absolute inset-0 bg-[#f3f5f8] blur-3xl" />

        <div className="room-stage absolute inset-0">
          {rooms.map((item, itemIndex) => {
            const offset = visualRoomOffset(itemIndex, index);
            const active = offset === 0;
            const routeReady = itemIndex === routeIndex;

            return (
              <section
                key={item.id}
                aria-hidden={!active}
                data-offset={offset}
                className={`room-panel absolute top-3 bottom-3 left-1/2 w-[min(76vw,28rem)] sm:top-5 sm:bottom-5 sm:w-[min(68vw,54rem)] lg:w-[min(62vw,62rem)] ${
                  active ? "z-20" : "z-10"
                }`}
              >
                <div
                  inert={active ? undefined : true}
                  className={`room-face h-full min-w-0 overflow-x-hidden overflow-y-auto rounded-xl shadow-[0_24px_80px_rgba(32,36,48,0.18)] ${
                    roomTone[item.id]
                  }`}
                >
                  {active && routeReady ? children : previews[item.id]}
                </div>
                {active ? null : (
                  <Link
                    href={item.href}
                    aria-label={`Open ${item.label}`}
                    className="absolute inset-0 z-20"
                    onClick={() => goTo(itemIndex)}
                  />
                )}
              </section>
            );
          })}
        </div>
      </div>

      <nav
        aria-label="Rooms"
        className="shrink-0 border-t border-stage-line bg-stage-chrome px-4 py-3"
      >
        <ul className="mx-auto flex max-w-md items-center justify-center gap-2">
          {rooms.map((item, itemIndex) => {
            const active = item.href === room.href;
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => goTo(itemIndex)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    active
                      ? "bg-accent text-white"
                      : "text-stage-muted hover:bg-white hover:text-stage-ink"
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
