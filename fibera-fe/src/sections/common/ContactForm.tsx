"use client";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import type { ContactMessages } from "@/i18n/dictionary.type";
import { fieldClass } from "@/libs/styles";

export function ContactForm({ t }: { t: ContactMessages["form"] }) {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.currentTarget.reset();
    setSent(true);
  };

  return (
    <form onSubmit={onSubmit} className="glass grid grid-cols-1 gap-4 p-6 shadow-panel sm:p-8">
      <label>
        <span className="micro mb-2 block">{t.nameLabel}</span>
        <input name="name" required autoComplete="name" placeholder={t.namePlaceholder} className={fieldClass} onChange={() => setSent(false)} />
      </label>
      <label>
        <span className="micro mb-2 block">{t.emailLabel}</span>
        <input name="email" type="email" required autoComplete="email" placeholder={t.emailPlaceholder} className={fieldClass} onChange={() => setSent(false)} />
      </label>
      <label>
        <span className="micro mb-2 block">{t.messageLabel}</span>
        <textarea name="message" required rows={5} placeholder={t.messagePlaceholder} className={`${fieldClass} resize-y`} onChange={() => setSent(false)} />
      </label>

      <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-bold text-brand-ink shadow-glow transition hover:bg-brand-deep">
        {t.submit} <Icon name="arrow" className="size-4" />
      </button>

      <p role="status" aria-live="polite" className={`flex items-center gap-2 text-sm text-brand-text ${sent ? "" : "hidden"}`}>
        <Icon name="check" className="size-5 shrink-0" /> {t.success}
      </p>
    </form>
  );
}
