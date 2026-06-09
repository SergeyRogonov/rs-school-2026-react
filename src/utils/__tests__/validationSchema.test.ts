import { describe, it, expect } from 'vitest';
import {
  formSchema,
  validateCountry,
  validateImage,
} from '../../utils/validationSchema';
import { mockFile } from '../../test-utils/mocks';

describe('validationSchema', () => {
  const countries = ['United States'];

  it('rejects an invalid email', () => {
    const result = formSchema(countries).safeParse({
      name: 'John Doe',
      age: 25,
      email: 'invalid-email',
      password: 'Password123!',
      confirm: 'Password123!',
      gender: 'male',
      country: 'United States',
      avatar: mockFile(),
      acceptTos: true,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const emailError = result.error.issues.find((i) => i.path[0] === 'email');
      expect(emailError?.message).toContain(
        'Email must have one @, a non-empty local part, and a domain with at least one dot'
      );
    }
  });

  it('returns an error for unsupported image type', () => {
    const badFile = mockFile('content', 'file.txt', 1000);
    expect(validateImage(badFile)).toBe(
      'Please upload only JPEG or PNG images'
    );
  });

  it('returns an error for an image larger than 5MB', () => {
    const largeFile = new File(
      [new Uint8Array(5 * 1024 * 1024 + 1)],
      'large.png',
      {
        type: 'image/png',
      }
    );
    expect(validateImage(largeFile)).toBe('Image size should be less than 5MB');
  });

  it('validates country membership correctly', () => {
    expect(validateCountry('United States', countries)).toBeNull();
    expect(validateCountry('Mars', countries)).toBe(
      'Please select a valid country'
    );
  });
});
