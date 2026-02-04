import { format, isToday, isYesterday } from "date-fns";

/**
 * Format a date string to a friendly display format
 * Returns "today", "yesterday", or formatted date like "June 10"
 */
export function formatFriendlyDate(dateString: string): string {
  const date = new Date(dateString);
  
  if (isToday(date)) {
    return "today";
  }
  
  if (isYesterday(date)) {
    return "yesterday";
  }
  
  return format(date, "MMMM d");
}

/**
 * Format a date string for last edited timestamp
 */
export function formatLastEdited(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "MMM d, yyyy 'at' h:mm a");
}

/**
 * Truncate text to a maximum length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * Must contain at least one capital letter, one lowercase letter, and one number
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one capital letter");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Debounce function for autosave
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Combine class names
 */
export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
