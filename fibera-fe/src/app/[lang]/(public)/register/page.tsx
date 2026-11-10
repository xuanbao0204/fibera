import { isValidLocale, Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionary";
import { Metadata } from "next";
import RegisterForm from "@/sections/auth/RegisterForm";
import { Reveal } from "@/components/ui/Reveal";

interface RegisterPageProps {
    params: Promise<{
        lang: string;
    }>;
}

export async function generateMetadata({ params, }: { params: Promise<{ lang: Locale }>; }): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return {
        title: dict["register"].metadata.title,
        description: dict["register"].metadata.description,
    };
}

export default async function RegisterPage({ params }: RegisterPageProps) {
    const { lang } = await params;

    if (!isValidLocale(lang)) {
        notFound();
    }

    const t = (await getDictionary(lang)).register;

    return <Reveal><RegisterForm lang={lang} t={t} /></Reveal>;
}