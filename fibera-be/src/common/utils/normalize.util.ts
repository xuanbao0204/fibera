import type { TransformFnParams } from 'class-transformer';

export const VN_PHONE_REGEX = /^\+84(3|5|7|8|9)\d{8}$/;

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

/** 0912345678 / 84912345678 / +84 912 345 678  ->  +84912345678 */
export function normalizePhone(value: string): string {
  const compact = value.replace(/[\s.\-()]/g, '');
  if (compact.startsWith('+')) return compact;
  if (compact.startsWith('84')) return `+${compact}`;
  if (compact.startsWith('0')) return `+84${compact.slice(1)}`;
  return compact;
}

export const trimTransform = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export const emailTransform = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? normalizeEmail(value) : value;

export const phoneTransform = ({ value }: TransformFnParams): unknown => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : normalizePhone(trimmed);
};
