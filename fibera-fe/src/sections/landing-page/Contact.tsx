import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ContactMessages } from "@/i18n/dictionary.type";
import { ContactForm } from "../common/ContactForm";

export function Contact({ t }: { t: ContactMessages }) {
  const info: { icon: IconName; label: string; value: string; href?: string }[] = [
    { icon: "mail", label: t.info.emailLabel, value: t.info.email, href: `mailto:${t.info.email}` },
    { icon: "phone", label: t.info.phoneLabel, value: t.info.phone, href: `tel:${t.info.phone.replace(/\s/g, "")}` },
    { icon: "pin", label: t.info.addressLabel, value: t.info.address },
  ];

  return (
    <section id="contact" className="scroll-mt-24 px-6 py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <Reveal>
            <SectionHeading eyebrow={t.eyebrow} title={t.title} desc={t.description} />
          </Reveal>

          <ul className="mt-10 space-y-5">
            {info.map((item, i) => (
              <Reveal key={item.label} delay={i * 80}>
                <li className="flex items-center gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand/10 text-brand-text">
                    <Icon name={item.icon} />
                  </span>
                  <div>
                    <p className="micro">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="font-semibold transition hover:text-brand-text">{item.value}</a>
                    ) : (
                      <p className="font-semibold">{item.value}</p>
                    )}
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal delay={150}>
          <ContactForm t={t.form} />
        </Reveal>
      </div>
    </section>
  );
}
