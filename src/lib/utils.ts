import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import slugify from "slugify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function genSlug(str: string): string {
  return slugify(str);
}

export function toInt(val: string | null, fallback: number): number {
  const n = parseInt(val ?? '');
  return isNaN(n) || n < 1 ? fallback : n;
};