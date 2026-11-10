export function SectionHeading({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs text-fg-2">
        <span className="size-1.5 rounded-full bg-brand" /> {eyebrow}
      </span>
      <h2 className="mt-5 text-4xl font-medium leading-[1.1] tracking-[-0.03em] md:text-5xl">{title}</h2>
      {desc && <p className="mt-4 text-fg-2">{desc}</p>}
    </div>
  );
}
