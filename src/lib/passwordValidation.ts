import { z } from 'zod';

/**
 * Strong password requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const strongPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character (!@#$%^&*...)');

export const getPasswordRequirements = () => [
  { label: 'At least 8 characters', regex: /.{8,}/ },
  { label: 'One uppercase letter (A-Z)', regex: /[A-Z]/ },
  { label: 'One lowercase letter (a-z)', regex: /[a-z]/ },
  { label: 'One number (0-9)', regex: /[0-9]/ },
  { label: 'One special character (!@#$%...)', regex: /[^A-Za-z0-9]/ },
];
