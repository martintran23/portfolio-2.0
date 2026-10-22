"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
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
                  {active ? children : previews[item.id]}
                </div>
                {active ? null : (
                  <Link
                    href={item.href}
                    aria-label={`Open ${item.label}`}
                    className="absolute inset-0 z-20"
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
