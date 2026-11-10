"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/libs/utils";
import { ctaClass, fieldClass, linkClass } from "@/libs/styles";
import type { LoginMessages } from "@/i18n/dictionary.type";

interface LoginFormProps {
    lang: string;
    t: LoginMessages;
}

export default function LoginForm({ lang, t }: LoginFormProps) {
    const [viewPassword, setViewPassword] = useState(false);

    return (
        <section className="flex min-h-screen w-full items-center justify-center px-4 py-12">
            <div className="glass w-full max-w-md rounded-r-card p-6 shadow-panel sm:p-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-fg">
                        {t.title}
                    </h1>
                </div>

                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="flex flex-col gap-5"
                >
                    {/* Identifier */}
                    <label>
                        <span className="micro mb-2 block">{t.id}</span>
                        <input
                            type="text"
                            name="identifier"
                            autoComplete="username"
                            placeholder={t.id}
                            className={cn("field w-full", fieldClass)}
                            required
                        />
                    </label>

                    {/* Password */}
                    <label>
                        <span className="micro mb-2 block">{t.password}</span>

                        <div className="relative">
                            <input
                                type={viewPassword ? "text" : "password"}
                                name="password"
                                autoComplete="current-password"
                                placeholder={t.password}
                                className={cn(
                                    "field w-full pr-12",
                                    fieldClass
                                )}
                                required
                            />

                            <button
                                type="button"
                                onClick={() => setViewPassword((prev) => !prev)}
                                aria-label={
                                    viewPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg"
                            >
                                {viewPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </label>

                    {/* Forgot password */}
                    <div className="flex justify-end">
                        <Link
                            href={`/${lang}/forgot-password`}
                            className={`${linkClass} text-sm `}
                        >
                            {t["forgot-password"]}
                        </Link>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className={cn("flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3", ctaClass)}
                    >
                        {t.cta}
                        <Icon name="arrow_action" />
                    </button>
                </form>

                {/* Register */}
                <p className="mt-6 text-center text-sm text-fg-muted">
                    {t["other-action"]}
                    <Link
                        href={`/${lang}/register`}
                        className={linkClass}
                    >
                        {t["register-link"]}
                    </Link>
                </p>
            </div>
        </section>
    );
}