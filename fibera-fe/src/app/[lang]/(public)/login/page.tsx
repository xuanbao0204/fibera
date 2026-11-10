import { isValidLocale, Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionary";
import LoginForm from "@/sections/auth/LoginForm";
import { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";

interface LoginPageProps {
    params: Promise<{
        lang: string;
    }>;
}

export async function generateMetadata({ params, }: { params: Promise<{ lang: Locale }>; }): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return {
        title: dict["login"].metadata.title,
        description: dict["login"].metadata.description,
    };
}

export default async function LoginPage({ params }: LoginPageProps) {
    const { lang } = await params;

    if (!isValidLocale(lang)) {
        notFound();
    }

    const t = (await getDictionary(lang)).login;

    return <Reveal><LoginForm lang={lang} t={t} /></Reveal>;
}