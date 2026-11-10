
"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/libs/utils";
import { ctaClass, fieldClass, linkClass } from "@/libs/styles";
import type { RegisterMessages } from "@/i18n/dictionary.type";

interface RegisterFormProps {
    lang: string;
    t: RegisterMessages;
}

type RegisterValues = {
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    role: "" | "TENANT" | "LANDLORD";
    acceptTerm: boolean;
};

type FieldName = keyof RegisterValues;
type FormErrors = Partial<Record<FieldName | "identity", string>>;

const initialValues: RegisterValues = {
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    acceptTerm: false,
};

export default function RegisterForm({ lang, t }: RegisterFormProps) {
    const [values, setValues] = useState<RegisterValues>(initialValues);
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
    const [viewPassword, setViewPassword] = useState(false);
    const [viewConfirmPassword, setViewConfirmPassword] = useState(false);

    // Validate a single field
    const validateField = (
        field: FieldName,
        currentValues: RegisterValues
    ): string | undefined => {
        switch (field) {
            case "email": {
                if (
                    currentValues.email &&
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentValues.email)
                ) {
                    return t.validation.email;
                }
                break;
            }

            case "phone": {
                if (
                    currentValues.phone &&
                    !/^0\d{9}$/.test(currentValues.phone)
                ) {
                    return t.validation.phone;
                }
                break;
            }

            case "password": {
                if (
                    currentValues.password.length > 0 &&
                    currentValues.password.length < 8
                ) {
                    return t.validation.password;
                }
                break;
            }

            case "confirmPassword": {
                if (
                    currentValues.confirmPassword &&
                    currentValues.confirmPassword !== currentValues.password
                ) {
                    return t.validation.confirmPassword;
                }
                break;
            }

            case "role": {
                if (!currentValues.role) {
                    return t.validation.role;
                }
                break;
            }

            case "acceptTerm": {
                if (!currentValues.acceptTerm) {
                    return t.validation.acceptTerm;
                }
                break;
            }
        }

        return undefined;
    };

    // Validate all fields
    const validateForm = (currentValues: RegisterValues): FormErrors => {
        const nextErrors: FormErrors = {};

        if (!currentValues.email && !currentValues.phone) {
            nextErrors.identity = t.validation.identity;
        }

        (Object.keys(currentValues) as FieldName[]).forEach((field) => {
            const error = validateField(field, currentValues);

            if (error) {
                nextErrors[field] = error;
            }
        });

        return nextErrors;
    };

    // Update value and validate while typing
    const handleChange = <K extends FieldName>(
        field: K,
        value: RegisterValues[K]
    ) => {
        const nextValues = {
            ...values,
            [field]: value,
        };

        setValues(nextValues);

        // Only show errors after the user has interacted with a field
        if (touched[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: validateField(field, nextValues),
            }));
        }

        // Revalidate confirmation when password changes
        if (field === "password" && touched.confirmPassword) {
            setErrors((prev) => ({
                ...prev,
                confirmPassword: validateField(
                    "confirmPassword",
                    nextValues
                ),
            }));
        }

        // Revalidate identity when either email or phone changes
        if (
            (field === "email" || field === "phone") &&
            (touched.email || touched.phone)
        ) {
            setErrors((prev) => ({
                ...prev,
                identity:
                    !nextValues.email && !nextValues.phone
                        ? t.validation.identity
                        : undefined,
            }));
        }
    };

    // Validate when leaving a field
    const handleBlur = (field: FieldName) => {
        setTouched((prev) => ({
            ...prev,
            [field]: true,
        }));

        setErrors((prev) => ({
            ...prev,
            [field]: validateField(field, values),
        }));

        if (field === "email" || field === "phone") {
            setErrors((prev) => ({
                ...prev,
                identity:
                    !values.email && !values.phone
                        ? t.validation.identity
                        : undefined,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const nextErrors = validateForm(values);

        setErrors(nextErrors);

        setTouched({
            email: true,
            phone: true,
            password: true,
            confirmPassword: true,
            role: true,
            acceptTerm: true,
        });

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        // TODO: Call registration API here
        console.log("Register payload:", values);
    };

    // Reusable error message
    const ErrorMessage = ({ error }: { error?: string }) => {
        if (!error) return null;

        return (
            <p className="mt-1.5 text-xs text-red-500" role="alert">
                {error}
            </p>
        );
    };

    return (
        <section className="flex min-h-screen w-full items-center justify-center px-4 py-12">
            <div className="glass w-full max-w-md rounded-r-card p-6 shadow-panel sm:p-8">

                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-fg">
                        {t.title}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {/* Email */}
                    <label>
                        <span className="micro mb-2 block">{t.id}</span>
                        <input
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            onBlur={() => handleBlur("email")}
                            autoComplete="email"
                            placeholder={t.id}
                            className={cn(
                                "field w-full",
                                fieldClass,
                                errors.email && "border-red-500"
                            )}
                            aria-invalid={!!errors.email}
                        />
                        <ErrorMessage error={errors.email} />
                    </label>

                    {/* Phone */}
                    <label>
                        <span className="micro mb-2 block">{t.phone}</span>
                        <input
                            type="tel"
                            name="phone"
                            value={values.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            onBlur={() => handleBlur("phone")}
                            autoComplete="tel"
                            placeholder={t.phone}
                            className={cn(
                                "field w-full",
                                fieldClass,
                                errors.phone && "border-red-500"
                            )}
                            aria-invalid={!!errors.phone}
                        />
                        <ErrorMessage error={errors.phone} />
                        <ErrorMessage error={errors.identity} />
                    </label>

                    {/* Password */}
                    <label>
                        <span className="micro mb-2 block">{t.password}</span>

                        <div className="relative">
                            <input
                                type={viewPassword ? "text" : "password"}
                                name="password"
                                value={values.password}
                                onChange={(e) => handleChange("password", e.target.value)}
                                onBlur={() => handleBlur("password")}
                                autoComplete="new-password"
                                placeholder={t.password}
                                className={cn(
                                    "field w-full pr-12",
                                    fieldClass,
                                    errors.password && "border-red-500"
                                )}
                                aria-invalid={!!errors.password}
                            />

                            <button
                                type="button"
                                onClick={() => setViewPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg"
                                aria-label="Toggle password visibility"
                            >
                                {viewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <ErrorMessage error={errors.password} />
                    </label>

                    {/* Confirm Password */}
                    <label>
                        <span className="micro mb-2 block">
                            {t["confirm-password"]}
                        </span>

                        <div className="relative">
                            <input
                                type={viewConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={values.confirmPassword}
                                onChange={(e) =>
                                    handleChange("confirmPassword", e.target.value)
                                }
                                onBlur={() => handleBlur("confirmPassword")}
                                autoComplete="new-password"
                                placeholder={t["confirm-password"]}
                                className={cn(
                                    "field w-full pr-12",
                                    fieldClass,
                                    errors.confirmPassword && "border-red-500"
                                )}
                                aria-invalid={!!errors.confirmPassword}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setViewConfirmPassword((prev) => !prev)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg"
                                aria-label="Toggle confirm password visibility"
                            >
                                {viewConfirmPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>

                        <ErrorMessage error={errors.confirmPassword} />
                    </label>

                    {/* Role */}
                    <div>
                        <span className="micro mb-2 block">{t.role}</span>

                        <div className="flex justify-around w-full gap-3">
                            <label
                                className={cn(
                                    "flex cursor-pointer items-center justify-center rounded-lg border px-5 py-1.5",
                                    "transition-all duration-200",
                                    values.role === "TENANT"
                                        ? "border-brand bg-brand text-white"
                                        : "border-border bg-transparent text-fg hover:border-brand"
                                )}
                            >
                                <input
                                    type="radio"
                                    name="role"
                                    value="TENANT"
                                    checked={values.role === "TENANT"}
                                    onChange={() => handleChange("role", "TENANT")}
                                    onBlur={() => handleBlur("role")}
                                    className="sr-only"
                                />
                                <span>{t.roles.tenant}</span>
                            </label>

                            <label
                                className={cn(
                                    "flex cursor-pointer items-center justify-center rounded-lg border px-5 py-1.5",
                                    "transition-all duration-200",
                                    values.role === "LANDLORD"
                                        ? "border-brand bg-brand text-white"
                                        : "border-border bg-transparent text-fg hover:border-brand"
                                )}
                            >
                                <input
                                    type="radio"
                                    name="role"
                                    value="LANDLORD"
                                    checked={values.role === "LANDLORD"}
                                    onChange={() => handleChange("role", "LANDLORD")}
                                    onBlur={() => handleBlur("role")}
                                    className="sr-only"
                                />
                                <span>{t.roles.landlord}</span>
                            </label>
                        </div>

                        <ErrorMessage error={errors.role} />
                    </div>

                    {/* Terms */}
                    <div>
                        <label className="flex items-start gap-2 text-sm text-fg-muted">
                            <input
                                type="checkbox"
                                name="acceptTerm"
                                checked={values.acceptTerm}
                                onChange={(e) =>
                                    handleChange("acceptTerm", e.target.checked)
                                }
                                onBlur={() => handleBlur("acceptTerm")}
                                className="mt-1 accent-brand"
                            />

                            <span>
                                {t["accept-term"]}
                                <Link
                                    href={`/${lang}/terms`}
                                    target="_blank"
                                    className={linkClass}
                                >
                                    {t.term}
                                </Link>
                            </span>
                        </label>

                        <ErrorMessage error={errors.acceptTerm} />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className={cn(
                            "flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3",
                            ctaClass
                        )}
                        disabled={!values.acceptTerm}
                    >
                        {t.cta}
                        <Icon name="arrow_action" />
                    </button>
                </form>

                {/* Login */}
                <p className="mt-6 text-center text-sm text-fg-muted">
                    {t["other-action"]}

                    <Link
                        href={`/${lang}/login`}
                        className={linkClass}
                    >
                        {t["register-link"]}
                    </Link>
                </p>
            </div>
        </section>
    );
}
