import { z } from "zod";

export const addressSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  line1: z.string().min(5, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit PIN code"),
  country: z.string().default("India"),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  image: z.string().url().optional().or(z.literal("")),
});

export type AddressInput = z.input<typeof addressSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
