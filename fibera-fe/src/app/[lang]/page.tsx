import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/config";
import { LandingPageHeroSection } from "@/sections/landing-page/Hero";
import { Metadata } from "next";
import { Analysis } from "@/sections/landing-page/Analysis";
import { Features } from "@/sections/landing-page/Features";
import { HowItWorks } from "@/sections/landing-page/HowItWorks";
import { Audience } from "@/sections/landing-page/Audience";
import { Faq } from "@/sections/landing-page/Faq";
import { CallToAction } from "@/sections/landing-page/CallToAction";
import { Contact } from "@/sections/landing-page/Contact";

export async function generateMetadata({ params, }: { params: Promise<{ lang: Locale }>; }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: dict["landing-page"].metadata.title,
    description: dict["landing-page"].metadata.description,
  };
}

export default async function LandingPage({ params, }: { params: Promise<{ lang: Locale }>; }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const page = dict["landing-page"];

  return (
    <main className="w-full flex-1">
      <LandingPageHeroSection t={page.hero} />
      <Analysis t={page.stats} />
      <Features t={page.features} />
      <HowItWorks t={page.howItWorks} />
      <Audience t={page.audience} lang={lang} />
      <Faq t={page.faq} />
      <CallToAction t={page.cta} lang={lang} />
      <Contact t={page.contact} />
    </main>
  );
}