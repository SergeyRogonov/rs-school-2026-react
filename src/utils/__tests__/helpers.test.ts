import { describe, it, expect } from 'vitest';
import { checkPasswordStrength } from '../helpers';

describe('checkPasswordStrength', () => {
  it('detects all character types', () => {
    expect(checkPasswordStrength('Aa1!')).toEqual({
      hasNumber: true,
      hasUppercase: true,
      hasLowercase: true,
      hasSpecialChar: true,
    });
  });

  it('detects missing categories', () => {
    expect(checkPasswordStrength('abc')).toEqual({
      hasNumber: false,
      hasUppercase: false,
      hasLowercase: true,
      hasSpecialChar: false,
    });
  });

  it('handles empty string', () => {
    expect(checkPasswordStrength('')).toEqual({
      hasNumber: false,
      hasUppercase: false,
      hasLowercase: false,
      hasSpecialChar: false,
    });
  });
});
