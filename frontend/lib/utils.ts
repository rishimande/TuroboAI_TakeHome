import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to a friendly format:
 * - "today" for today's date
 * - "yesterday" for yesterday's date
 * - "Month Day" format for other dates (e.g., "June 10")
 */
export function formatFriendlyDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset time to midnight for accurate date comparison
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);

  if (compareDate.getTime() === today.getTime()) {
    return "today";
  } else if (compareDate.getTime() === yesterday.getTime()) {
    return "yesterday";
  } else {
    // Format as "Month Day" (e.g., "June 10")
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  }
}
