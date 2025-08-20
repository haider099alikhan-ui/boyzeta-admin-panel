import { z } from 'zod';

// Normalization functions
export const normalizeName = (name: string): string => {
  return name.trim().replace(/\s+/g, ' ');
};

export const normalizeBarcode = (barcode: string): string => {
  return barcode.replace(/[^\d]/g, '');
};

export const normalizeArray = (arr: string[]): string[] => {
  return [...new Set(arr.map(item => item.trim()).filter(item => item.length > 0))];
};

export const normalizeUrls = (urls: string[]): string[] => {
  return normalizeArray(urls).map(url => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  });
};

// Zod schemas
export const productSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .transform(normalizeName),
  boycott: z.boolean(),
  reason: z.string()
    .min(5, 'Reason must be at least 5 characters')
    .trim(),
  alternatives: z.array(z.string().trim())
    .default([])
    .transform(normalizeArray),
  barcodes: z.array(z.string())
    .default([])
    .transform(arr => normalizeArray(arr.map(normalizeBarcode))),
  proofUrls: z.array(z.string())
    .default([])
    .transform(normalizeUrls),
});

export const productUpdateSchema = productSchema.partial({
  name: true,
});

export const csvRowSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  boycott: z.string().transform(val => val.toLowerCase() === 'true'),
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
  alternatives: z.string().default('').transform(val => 
    val ? val.split(';').map(s => s.trim()).filter(s => s) : []
  ),
  barcodes: z.string().default('').transform(val => 
    val ? val.split(';').map(s => normalizeBarcode(s.trim())).filter(s => s) : []
  ),
  urls: z.string().default('').transform(val => 
    val ? normalizeUrls(val.split(';').map(s => s.trim()).filter(s => s)) : []
  ),
});

export type Product = z.infer<typeof productSchema>;
export type ProductUpdate = z.infer<typeof productUpdateSchema>;
export type CsvRow = z.infer<typeof csvRowSchema>;
