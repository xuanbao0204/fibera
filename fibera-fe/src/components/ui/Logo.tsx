export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-xl bg-brand text-brand-ink shadow-glow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
          <path d="M4 11 12 4l8 7v9H4z" />
          <path d="M9 20v-5h6v5" />
        </svg>
      </span>
      <span className="text-lg font-bold tracking-tight text-fg">Fibera</span>
    </span>
  );
}
