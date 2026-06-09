import { z } from 'zod';

export const formSchema = (countries: string[]) =>
  z
    .object({
      name: z
        .string()
        .min(1, 'Name is required')
        .regex(/^[A-Z]/, 'Name must start with a capital letter'),
      age: z
        .number()
        .int('Age must be a whole number')
        .positive('Age must be a positive number')
        .min(1, 'Age must be at least 1'),

      email: z.string().min(1, 'Email is required').refine(validateEmail, {
        message:
          'Email must have one @, a non-empty local part, and a domain with at least one dot',
      }),
      gender: z.string().min(1, 'Gender is required'),
      country: z
        .string()
        .min(1, 'Country is required')
        .refine((c) => countries.includes(c), {
          message: 'Select a valid country',
        }),
      password: z.string().min(1, 'Password is required'),
      confirm: z.string().min(1, 'Confirm password is required'),
      avatar: z.instanceof(File, { message: 'Avatar is required' }),
      acceptTos: z.boolean().refine((val) => val, { message: 'Accept terms' }),
    })
    .refine((data) => data.password === data.confirm, {
      path: ['confirm'],
      message: "Passwords don't match",
    });

const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;

  const trimmedEmail = email.trim();
  if (trimmedEmail.length === 0) return false;

  // Check for exactly one @
  const atCount = trimmedEmail.split('@').length - 1;
  if (atCount !== 1) return false;

  const [localPart, domain] = trimmedEmail.split('@');

  // Non-empty local part
  if (!localPart || localPart.length === 0) return false;

  // Domain must exist and have at least one dot
  if (!domain || domain.length === 0) return false;
  if (!domain.includes('.')) return false;

  // Domain must have content before and after the dot
  const domainParts = domain.split('.');
  for (const part of domainParts) {
    if (!part || part.length === 0) return false;
  }

  return true;
};

// Additional validation for image file
export const validateImage = (file: File): string | null => {
  const IMAGE_MAX_SIZE = 5 * 1024 * 1024;
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

  if (!allowedTypes.includes(file.type)) {
    return 'Please upload only JPEG or PNG images';
  }

  if (file.size > IMAGE_MAX_SIZE) {
    return 'Image size should be less than 5MB';
  }

  return null;
};

// Validation for country existence
export const validateCountry = (
  country: string,
  countriesList: string[]
): string | null => {
  if (!countriesList.includes(country)) {
    return 'Please select a valid country';
  }

  return null;
};

export type FormData = z.infer<ReturnType<typeof formSchema>>;
