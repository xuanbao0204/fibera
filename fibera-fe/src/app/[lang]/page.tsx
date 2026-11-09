import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/config";
import { LandingPageHeroSection } from "@/sections/landing-page/Hero";
import { Metadata } from "next";
import { Analysis } from "@/sections/landing-page/Analysis";

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

  return (
    <main className="w-full h-screen px-3">
      <LandingPageHeroSection t={dict["landing-page"].hero} />
      <Analysis t={dict["landing-page"].stats}/>
    </main>
  );
}