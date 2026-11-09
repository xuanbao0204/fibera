import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Nunito, Nunito_Sans } from "next/font/google";
import { I18nProvider } from "@/i18n/context";
import { getDictionary } from "@/i18n/dictionary";
import {
  isValidLocale,
  locales,
} from "@/i18n/config";

import "../globals.css";
import { NavigationBar } from "@/components/layout/NavBar";
import { StarBackground } from "@/components/layout/StarBackground";

const nunito = Nunito({
  variable: "--font-nunito-family",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans-family",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Fibera",
    template: "%s | Fibera",
  },
  description: "Fibera - Your digital experience.",
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang?: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang;

  if (!lang || !isValidLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang} data-theme="dark" suppressHydrationWarning>
      <body
        className={`${nunito.variable} ${nunitoSans.variable} min-h-full flex flex-col antialiased`}
      >
        <I18nProvider locale={lang} dictionary={dictionary}>

          <div className="fixed inset-0 -z-10 pointer-events-none">
            <StarBackground />
          </div>

          <NavigationBar lang={lang} t={dictionary.navbar} />

          {children}
          
        </I18nProvider>
      </body>
    </html>
  );
}