import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind merge capabilities.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
