import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';

import { fileToDataUrl, checkPasswordStrength } from '../utils/helpers';
import { addSubmission } from '../store/formsSlice';
import type { RootState } from '../store/store';
import { formSchema } from '../utils/validationSchema';

type FormValues = z.infer<ReturnType<typeof formSchema>>;

export default function ReactHookForm({ onDone }: { onDone?: () => void }) {
  const dispatch = useDispatch();
  const countries = useSelector((state: RootState) => state.forms.countries);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const schema = useMemo(() => formSchema(countries), [countries]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, touchedFields, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const password = useWatch({ control, name: 'password' }) || '';
  const passwordStrength = checkPasswordStrength(password);

  const showConfirmError = touchedFields.confirm && !!errors.confirm;

  const onSubmit = async (data: FormValues) => {
    const avatar = await fileToDataUrl(data.avatar);

    dispatch(
      addSubmission({
        ...data,
        avatar,
        termsAccepted: data.acceptTos,
      })
    );

    onDone?.();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-lg mx-auto p-6 bg-white rounded shadow"
    >
      {/* NAME */}
      <label htmlFor="name" className="block mb-3">
        <span className="font-medium">Name</span>
        <input
          {...register('name')}
          id="name"
          className="block w-full mt-1 px-2 py-1 border rounded"
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </label>

      {/* EMAIL */}
      <label htmlFor="email" className="block mb-3">
        <span className="font-medium">Email</span>
        <input
          {...register('email')}
          type="email"
          id="email"
          className="block w-full mt-1 px-2 py-1 border rounded"
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </label>

      {/* AGE */}
      <label htmlFor="age" className="block mb-3">
        <span className="font-medium">Age</span>
        <input
          {...register('age', { valueAsNumber: true })}
          type="number"
          id="age"
          className="block w-full mt-1 px-2 py-1 border rounded"
        />
        {errors.age && (
          <p className="text-sm text-red-600">{errors.age.message}</p>
        )}
      </label>

      {/* GENDER */}
      <fieldset className="mb-3">
        <legend className="font-medium mb-2">Gender</legend>
        {['male', 'female', 'other'].map((value) => (
          <label htmlFor={value} key={value} className="mr-3">
            <input
              type="radio"
              id={value}
              value={value}
              {...register('gender')}
            />{' '}
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </label>
        ))}
        {errors.gender && (
          <p className="text-sm text-red-600">{errors.gender.message}</p>
        )}
      </fieldset>

      {/* COUNTRY */}
      <label htmlFor="country" className="block mb-3">
        <span className="font-medium">Country</span>
        <input
          {...register('country')}
          list="countries"
          id="country"
          className="block w-full mt-1 px-2 py-1 border rounded"
        />
        <datalist id="countries">
          {countries.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        {errors.country && (
          <p className="text-sm text-red-600">{errors.country.message}</p>
        )}
      </label>

      {/* PASSWORD */}
      <label htmlFor="password" className="block mb-3">
        <span className="font-medium">Password</span>
        <div className="relative">
          <input
            {...register('password')}
            id="password"
            type={showPassword ? 'text' : 'password'}
            className="w-full mt-1 px-2 py-2 border rounded"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-2 top-2 text-sm"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
      </label>
      <div className="mt-2 text-xs text-gray-600">
        <div>Number: {passwordStrength.hasNumber ? '✔' : '✖'}</div>
        <div>Uppercase: {passwordStrength.hasUppercase ? '✔' : '✖'}</div>
        <div>Lowercase: {passwordStrength.hasLowercase ? '✔' : '✖'}</div>
        <div>Special: {passwordStrength.hasSpecialChar ? '✔' : '✖'}</div>
      </div>

      {/* CONFIRM PASSWORD */}
      <label htmlFor="confirm" className="block mb-3">
        <span className="font-medium">Confirm Password</span>
        <div className="relative">
          <input
            {...register('confirm', {
              validate: (val) => val === password || "Passwords don't match",
            })}
            id="confirm"
            type={showConfirmPassword ? 'text' : 'password'}
            className="w-full mt-1 px-2 py-2 border rounded"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((s) => !s)}
            className="absolute right-2 top-2 text-sm"
          >
            {showConfirmPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        {showConfirmError && (
          <p className="text-sm text-red-600">{errors.confirm?.message}</p>
        )}
      </label>

      {/* AVATAR */}
      <label htmlFor="avatar" className="block mb-3">
        <span className="font-medium">Avatar</span>
        <input
          type="file"
          id="avatar"
          accept="image/*"
          className="block mt-1 px-1 py-1 w-full cursor-pointer rounded border-gray-300 bg-white shadow-sm text-gray-700 file:mr-4 file:py-1 file:px-1 file:rounded-md file:cursor-pointer file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setValue('avatar', file, { shouldValidate: true });
            }
          }}
        />
        {errors.avatar && (
          <p className="text-sm text-red-600">{errors.avatar.message}</p>
        )}
      </label>

      {/* TERMS */}
      <label htmlFor="acceptTos" className="flex items-center mb-4">
        <input {...register('acceptTos')} type="checkbox" id="acceptTos" />
        <span className="ml-2 text-sm">I accept the terms and conditions</span>
      </label>

      {errors.acceptTos && (
        <p className="text-sm text-red-600">{errors.acceptTos.message}</p>
      )}

      {/* SUBMIT */}
      <button
        type="submit"
        id="submit"
        disabled={!isValid}
        className={`w-full py-2 px-4 rounded text-white ${
          isValid
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        Create account
      </button>
    </form>
  );
}
