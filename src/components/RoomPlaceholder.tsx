type RoomPlaceholderProps = {
  title: string;
  hint: string;
};

export function RoomPlaceholder({ title, hint }: RoomPlaceholderProps) {
  return (
    <div className="flex h-full flex-col justify-between p-6 sm:p-10">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted">Room</p>
        <h1 className="mt-3 font-serif text-4xl text-paper-ink sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-paper-ink/70">
          {hint}
        </p>
      </div>
      <p className="text-sm text-muted">Content from COPY.md comes next.</p>
    </div>
  );
}
