import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff } from 'lucide-react';
import { fileToDataUrl, checkPasswordStrength } from '../utils/helpers';
import { addSubmission } from '../store/formsSlice';
import type { RootState } from '../store/store';
import {
  formSchema,
  validateImage,
  validateCountry,
} from '../utils/validationSchema';

export default function UncontrolledForm({ onDone }: { onDone?: () => void }) {
  const dispatch = useDispatch();
  const countries = useSelector((state: RootState) => state.forms.countries);
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    hasNumber: false,
    hasUppercase: false,
    hasLowercase: false,
    hasSpecialChar: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    const formData = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      age: Number((form.elements.namedItem('age') as HTMLInputElement).value),
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      gender: (form.elements.namedItem('gender') as RadioNodeList).value,
      password: (form.elements.namedItem('password') as HTMLInputElement).value,
      confirm: (form.elements.namedItem('confirm') as HTMLInputElement).value,
      country: (form.elements.namedItem('country') as HTMLInputElement).value,

      avatar: (form.elements.namedItem('avatar') as HTMLInputElement)
        .files?.[0] as File | undefined,

      acceptTos: (form.elements.namedItem('acceptTos') as HTMLInputElement)
        .checked,
    };

    const result = formSchema(countries).safeParse({
      ...formData,
      avatar: formData.avatar as File,
    });

    const newErrors: Record<string, string> = {};

    if (!result.success && result.error && Array.isArray(result.error.issues)) {
      result.error.issues.forEach((issue) => {
        const key =
          issue.path && issue.path.length ? String(issue.path[0]) : 'form';

        if (key === 'password' && /match/i.test(String(issue.message))) {
          newErrors.confirm = String(issue.message);
        } else {
          newErrors[key] = String(issue.message);
        }
      });
    }

    const imageError = formData.avatar
      ? validateImage(formData.avatar)
      : 'Please upload only JPEG or PNG images';

    if (imageError) {
      newErrors.avatar = imageError;
    }

    const countryError = validateCountry(formData.country, countries);
    if (countryError) {
      newErrors.country = countryError;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstKey = Object.keys(newErrors)[0];

      const el =
        (document.querySelector(
          `[name="${firstKey}"]`
        ) as HTMLElement | null) || document.getElementById(firstKey);

      el?.focus();
      return;
    }

    const avatar = await fileToDataUrl(formData.avatar as File);

    const payload = {
      name: formData.name,
      age: Number(formData.age),
      email: formData.email,
      gender: formData.gender,
      termsAccepted: formData.acceptTos,
      password: formData.password,
      country: formData.country,
      avatar,
    };

    dispatch(addSubmission(payload));
    onDone?.();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-lg mx-auto p-6 bg-white rounded shadow "
    >
      <label htmlFor="name" className="block mb-3">
        <span className="font-medium">Name:</span>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Enter Your Name"
          required
          className={`block w-full mt-1 px-1 py-1 rounded shadow-sm ${errors.name ? 'border-red-500 ring-1 ring-red-200' : ''}`}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <div id="name-error" className="mt-1 text-sm text-red-600">
            {errors.name}
          </div>
        )}
      </label>

      <label htmlFor="email" className="block mb-3">
        <span className="font-medium">Email:</span>
        <input
          name="email"
          id="email"
          type="email"
          placeholder="react@example.com"
          required
          className={`block w-full mt-1 px-1 py-1 rounded shadow-sm ${errors.email ? 'border-red-500 ring-1 ring-red-200' : ''}`}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <div id="email-error" className="mt-1 text-sm text-red-600">
            {errors.email}
          </div>
        )}
      </label>

      <label htmlFor="age" className="block mb-3">
        <span className="font-medium">Age</span>
        <input
          name="age"
          id="age"
          type="number"
          min="0"
          placeholder="Age"
          required
          className={`block w-full mt-1 px-1 py-1 rounded shadow-sm ${errors.age ? 'border-red-500 ring-1 ring-red-200' : ''}`}
          aria-invalid={!!errors.age}
          aria-describedby={errors.age ? 'age-error' : undefined}
        />
        {errors.age && (
          <div id="age-error" className="mt-1 text-sm text-red-600">
            {errors.age}
          </div>
        )}
      </label>

      <fieldset
        className="mb-3"
        aria-describedby={errors.gender ? 'gender-error' : undefined}
      >
        <legend className="font-medium mb-2">Gender</legend>

        <div className="flex gap-3">
          <label htmlFor="male" className="inline-flex items-center space-x-2">
            <input
              type="radio"
              name="gender"
              id="male"
              value="male"
              required
              className={`h-4 w-4 ${errors.gender ? 'outline-none ring-1 ring-red-200' : ''}`}
            />
            <span className="text-sm">Male</span>
          </label>

          <label
            htmlFor="female"
            className="inline-flex items-center space-x-2"
          >
            <input
              type="radio"
              name="gender"
              id="female"
              value="female"
              className={`h-4 w-4 ${errors.gender ? 'outline-none ring-1 ring-red-200' : ''}`}
            />
            <span className="text-sm">Female</span>
          </label>

          <label htmlFor="other" className="inline-flex items-center space-x-2">
            <input
              type="radio"
              name="gender"
              id="other"
              value="other"
              className={`h-4 w-4 ${errors.gender ? 'outline-none ring-1 ring-red-200' : ''}`}
            />
            <span className="text-sm">Other</span>
          </label>
        </div>

        {errors.gender && (
          <div id="gender-error" className="mt-1 text-sm text-red-600">
            {errors.gender}
          </div>
        )}
      </fieldset>

      <label htmlFor="country" className="block mb-3">
        <span className="font-medium">Country</span>
        <input
          name="country"
          id="country"
          list="countries-list"
          placeholder="Select your country"
          required
          className={`block w-full mt-1 px-1 py-1 rounded shadow-sm ${errors.country ? 'border-red-500 ring-1 ring-red-200' : ''}`}
          aria-invalid={!!errors.country}
          aria-describedby={errors.country ? 'country-error' : undefined}
        />
        <datalist id="countries-list">
          {countries.map((country) => (
            <option key={country} value={country} />
          ))}
        </datalist>
        {errors.country && (
          <div id="country-error" className="mt-1 text-sm text-red-600">
            {errors.country}
          </div>
        )}
      </label>

      <div className="mb-3">
        <label htmlFor="password" className="block mb-1">
          <span className="font-medium">Password</span>
        </label>
        <div className="relative">
          <input
            name="password"
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="********"
            required
            value={password}
            onChange={handlePasswordChange}
            className={`block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm pr-10 ${errors.password ? 'border-red-500 ring-1 ring-red-200' : ''}`}
            aria-invalid={!!errors.password}
            aria-describedby={
              errors.password ? 'password-error' : 'password-requirements'
            }
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        {errors.password && (
          <div id="password-error" className="mt-1 text-sm text-red-600">
            {errors.password}
          </div>
        )}

        <div className="mt-2 text-xs text-gray-600">
          <div>Number: {passwordStrength.hasNumber ? '✔' : '✖'}</div>
          <div>Uppercase: {passwordStrength.hasUppercase ? '✔' : '✖'}</div>
          <div>Lowercase: {passwordStrength.hasLowercase ? '✔' : '✖'}</div>
          <div>Special: {passwordStrength.hasSpecialChar ? '✔' : '✖'}</div>
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="confirm" className="block mb-1">
          <span className="font-medium">Confirm Password</span>
        </label>
        <div className="relative">
          <input
            name="confirm"
            id="confirm"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="********"
            required
            className={`block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm pr-10 ${errors.confirm ? 'border-red-500 ring-1 ring-red-200' : ''}`}
            aria-invalid={!!errors.confirm}
            aria-describedby={errors.confirm ? 'confirm-error' : undefined}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500 hover:text-gray-700"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        {errors.confirm && (
          <div id="confirm-error" className="mt-1 text-sm text-red-600">
            {errors.confirm}
          </div>
        )}
      </div>

      <label htmlFor="avatar" className="block mb-3">
        <span className="font-medium">Upload avatar</span>
        <input
          name="avatar"
          id="avatar"
          type="file"
          accept="image/*"
          className={`block mt-1 px-1 py-1 w-full cursor-pointer rounded border-gray-300 bg-white shadow-sm text-gray-700 file:mr-4 file:py-1 file:px-1 file:rounded-md file:cursor-pointer file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${errors.avatar ? 'border-red-500 ring-1 ring-red-200' : ''}`}
          aria-invalid={!!errors.avatar}
          aria-describedby={errors.avatar ? 'avatar-error' : undefined}
        />
        {errors.avatar && (
          <div id="avatar-error" className="mt-1 text-sm text-red-600">
            {errors.avatar}
          </div>
        )}
      </label>

      <label
        htmlFor="acceptTos"
        className="flex items-center mb-4"
        aria-describedby={errors.acceptTos ? 'acceptTos-error' : undefined}
      >
        <input
          name="acceptTos"
          id="acceptTos"
          type="checkbox"
          required
          className={`h-4 w-4 ${errors.acceptTos ? 'outline-none ring-1 ring-red-200' : ''}`}
          aria-invalid={!!errors.acceptTos}
        />
        <span className="ml-2 text-sm">I accept the Terms and Conditions</span>
      </label>
      {errors.acceptTos && (
        <div id="acceptTos-error" className="mt-1 text-sm text-red-600">
          {errors.acceptTos}
        </div>
      )}

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Create account
      </button>
    </form>
  );
}
