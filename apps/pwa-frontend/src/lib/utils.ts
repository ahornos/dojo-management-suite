import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names and merges Tailwind CSS classes without conflicts.
 * 
 * @function cn
 * @param {...ClassValue} inputs - The class names or conditional class objects to combine.
 * @returns {string} The merged and optimized class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}