import { z } from 'zod';

// Shared validation schemas for the quote and booking flows. Used by both the
// client forms (via @hookform/resolvers) and the API routes.

export const quoteSchema = z.object({
  pickup: z.string().min(3),
  dropoff: z.string().min(3),
  vehicleSlug: z.enum(['business', 'first', 'van', 'sprinter']),
  // ISO date-time string of the pickup moment (local time from the form).
  pickupAt: z.string().min(1),
});

export type QuoteRequest = z.infer<typeof quoteSchema>;

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6).optional().or(z.literal('')),
  message: z.string().min(10).max(2000),
  locale: z.enum(['de', 'en', 'tr']).default('de'),
});

export type ContactRequest = z.infer<typeof contactSchema>;

export const bookingSchema = quoteSchema.extend({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  passengers: z.coerce.number().int().min(1).max(16),
  luggage: z.coerce.number().int().min(0).max(30),
  notes: z.string().max(1000).optional().or(z.literal('')),
  // Optional paid extras. Minibar is a map of item-id -> quantity; the server
  // re-prices it from the catalog (client prices are never trusted).
  extras: z
    .object({
      minibar: z.record(z.string(), z.coerce.number().int().min(0).max(20)).optional(),
    })
    .optional(),
  locale: z.enum(['de', 'en', 'tr']).default('de'),
});

export type BookingRequest = z.infer<typeof bookingSchema>;
