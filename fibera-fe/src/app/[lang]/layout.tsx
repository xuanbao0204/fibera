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
import { THEME_STORAGE_KEY } from "@/libs/theme";
import { Footer } from "@/components/layout/Footer";
import Script from "next/script";

const themeScript = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

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
  description: "Fibera - The smart room rental platform.",
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
      <head>
        <Script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${nunito.variable} ${nunitoSans.variable} min-h-full flex flex-col antialiased`}
      >
        <I18nProvider locale={lang} dictionary={dictionary}>

          <div className="fixed inset-0 -z-10 pointer-events-none">
            <StarBackground />
          </div>

          <NavigationBar lang={lang} t={dictionary.navbar} />

          {children}

          <Footer lang={lang} t={dictionary.footer} nav={dictionary.navbar} />
        </I18nProvider>
      </body>
    </html>
  );
}