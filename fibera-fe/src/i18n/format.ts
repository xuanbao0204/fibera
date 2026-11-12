export type PluralMessage = { one?: string; other: string };

export function formatMessage(template: string, values: Record<string, string | number> = {}) {
    return template.replace(/\{(\w+)\}/g, (_, k) => (k in values ? String(values[k]) : `{${k}}`));
}

export function plural(locale: string, msg: PluralMessage, count: number, extra: Record<string, string | number> = {}) {
    const cat = new Intl.PluralRules(locale).select(count) as 'one' | 'other';
    return formatMessage(msg[cat] ?? msg.other, { count: new Intl.NumberFormat(locale).format(count), ...extra });
}