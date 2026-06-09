export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => {
      reader.abort();
      reject(new Error('File read error'));
    };
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
};

export const checkPasswordStrength = (password: string) => {
  return {
    hasNumber: /\d/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  };
};
