import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions for data handling
export const dedupe = <T>(arr: T[]): T[] => {
  return [...new Set(arr)];
};

export const normalize = {
  name: (name: string): string => {
    return name.trim().replace(/\s+/g, ' ');
  },
  barcode: (barcode: string): string => {
    return barcode.replace(/[^\d]/g, '');
  },
  array: (arr: string[]): string[] => {
    return dedupe(arr.map(item => item.trim()).filter(item => item.length > 0));
  },
  urls: (urls: string[]): string[] => {
    return normalize.array(urls).map(url => {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return `https://${url}`;
      }
      return url;
    });
  },
};

// Toast helper
export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  // This will be handled by the Sonner toast component
  return { message, type };
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
