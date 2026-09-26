import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name').max(100),
  company: z.string().trim().max(100).optional().or(z.literal('')),
  email: z.string().trim().email('Please enter a valid email address'),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  service: z.string().trim().max(100).optional().or(z.literal('')),
  message: z.string().trim().min(1, 'Please enter a message').max(5000),
  locale: z.enum(['en', 'sq']).default('en'),
  botCheck: z.string().max(0, 'Spam detected').optional().or(z.literal('')),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  locale: z.enum(['en', 'sq']).default('en'),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

export const projectInquirySchema = z.object({
  firstName: z.string().trim().min(1).max(50),
  lastName: z.string().trim().min(1).max(50),
  email: z.string().trim().email(),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  company: z.string().trim().max(100).optional().or(z.literal('')),
  website: z.string().trim().optional().or(z.literal('')),
  projectType: z.string().trim().min(1).max(100),
  services: z.array(z.string()).default([]),
  budgetMin: z.number().int().min(0).optional(),
  budgetMax: z.number().int().min(0).optional(),
  budget: z.string().trim().optional().or(z.literal('')),
  timeline: z.string().trim().max(100).optional().or(z.literal('')),
  description: z.string().trim().optional().or(z.literal('')),
  goals: z.string().trim().max(2000).optional().or(z.literal('')),
  locale: z.enum(['en', 'sq']).default('en'),
  botCheck: z.string().max(0, 'Spam detected').optional().or(z.literal('')),
});

export type ProjectInquiryInput = z.infer<typeof projectInquirySchema>;
