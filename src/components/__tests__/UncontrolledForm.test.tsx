import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import UncontrolledForm from '../UncontrolledForm';
import formsReducer from '../../store/formsSlice';
import { mockFile } from '../../test-utils/mocks';

const renderUncontrolledForm = (onDone?: () => void) => {
  const store = configureStore({
    reducer: { forms: formsReducer },
  });

  render(
    <Provider store={store}>
      <UncontrolledForm onDone={onDone} />
    </Provider>
  );

  return { store };
};

describe('UncontrolledForm', () => {
  it('renders all form fields', () => {
    renderUncontrolledForm();

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^age/i)).toBeInTheDocument();
    expect(screen.getByText(/gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/upload avatar/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/accept the terms/i)).toBeInTheDocument();
  });

  it('displays password strength indicators as password changes', async () => {
    renderUncontrolledForm();

    const passwordInput = screen.getByLabelText(
      /^password$/i
    ) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: 'TestPass123!' } });

    await waitFor(() => {
      expect(screen.getByText(/Number: ✔/i)).toBeInTheDocument();
      expect(screen.getByText(/Uppercase: ✔/i)).toBeInTheDocument();
      expect(screen.getByText(/Lowercase: ✔/i)).toBeInTheDocument();
      expect(screen.getByText(/Special: ✔/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data and dispatches addSubmission', async () => {
    const onDone = vi.fn();
    const { store } = renderUncontrolledForm(onDone);

    fireEvent.change(screen.getByLabelText(/^name/i), {
      target: { value: 'Jane Smith' },
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'jane@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/^age/i), {
      target: { value: '30' },
    });

    fireEvent.click(screen.getByDisplayValue('female'));

    fireEvent.change(screen.getByLabelText(/country/i), {
      target: { value: 'Canada' },
    });

    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'SecurePass123!' },
    });

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'SecurePass123!' },
    });

    const user = userEvent.setup();

    const avatarInput = screen.getByLabelText(/upload avatar/i);

    const file = new File(['avatar-content'], 'avatar.png', {
      type: 'image/png',
    });

    await user.upload(avatarInput, file);

    fireEvent.click(screen.getByLabelText(/accept the terms/i));

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(onDone).toHaveBeenCalled();
    });

    expect(store.getState().forms.submissions).toHaveLength(1);

    expect(store.getState().forms.submissions[0].email).toBe(
      'jane@example.com'
    );
  });

  it('displays validation error for invalid email', async () => {
    const onDone = vi.fn();
    renderUncontrolledForm(onDone);

    const form = screen
      .getByRole('button', { name: /create account/i })
      .closest('form') as HTMLFormElement;

    fireEvent.change(screen.getByLabelText(/^name/i), {
      target: { value: 'John Doe' },
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'not-an-email' },
    });

    fireEvent.change(screen.getByLabelText(/^age/i), {
      target: { value: '25' },
    });

    fireEvent.click(screen.getByDisplayValue('male'));

    fireEvent.change(screen.getByLabelText(/country/i), {
      target: { value: 'United States' },
    });

    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'Password123!' },
    });

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'Password123!' },
    });

    const avatarInput = screen.getByLabelText(
      /upload avatar/i
    ) as HTMLInputElement;
    const file = mockFile();

    const fileList = {
      0: file,
      length: 1,
      item: (index: number): File | null => (index === 0 ? file : null),
    } as unknown as FileList;

    Object.defineProperty(avatarInput, 'files', {
      value: fileList,
      writable: false,
    });

    fireEvent.change(avatarInput);

    fireEvent.click(screen.getByLabelText(/accept the terms/i));

    screen.debug(screen.getByRole('button', { name: /create account/i }));
    const submitButton = screen.getByRole('button', {
      name: /create account/i,
    });
    console.log('disabled:', submitButton.hasAttribute('disabled'));

    fireEvent.submit(form);

    await waitFor(() => {
      expect(
        screen.getByText(
          /Email must have one @, a non-empty local part, and a domain with at least one dot/i
        )
      ).toBeInTheDocument();
    });

    expect(onDone).not.toHaveBeenCalled();
  });

  it('displays error when passwords do not match', async () => {
    const onDone = vi.fn();
    renderUncontrolledForm(onDone);

    const form = screen
      .getByRole('button', { name: /create account/i })
      .closest('form') as HTMLFormElement;

    fireEvent.change(screen.getByLabelText(/^name/i), {
      target: { value: 'John Doe' },
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/^age/i), {
      target: { value: '25' },
    });

    fireEvent.click(screen.getByDisplayValue('male'));

    fireEvent.change(screen.getByLabelText(/country/i), {
      target: { value: 'United States' },
    });

    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'Password123!' },
    });

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'DifferentPass123!' },
    });

    const avatarInput = screen.getByLabelText(
      /upload avatar/i
    ) as HTMLInputElement;
    const file = mockFile();

    const fileList = {
      0: file,
      length: 1,
      item: (index: number): File | null => (index === 0 ? file : null),
    } as unknown as FileList;

    Object.defineProperty(avatarInput, 'files', {
      value: fileList,
      writable: false,
    });

    fireEvent.change(avatarInput);

    fireEvent.click(screen.getByLabelText(/accept the terms/i));

    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/don't match/i)).toBeInTheDocument();
    });

    expect(onDone).not.toHaveBeenCalled();
  });

  it('displays error when avatar is missing', async () => {
    const onDone = vi.fn();
    renderUncontrolledForm(onDone);

    const form = screen
      .getByRole('button', { name: /create account/i })
      .closest('form') as HTMLFormElement;

    fireEvent.change(screen.getByLabelText(/^name/i), {
      target: { value: 'John Doe' },
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/^age/i), {
      target: { value: '25' },
    });

    fireEvent.click(screen.getByDisplayValue('male'));

    fireEvent.change(screen.getByLabelText(/country/i), {
      target: { value: 'United States' },
    });

    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'Password123!' },
    });

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'Password123!' },
    });

    fireEvent.click(screen.getByLabelText(/accept the terms/i));

    fireEvent.submit(form);

    await waitFor(() => {
      expect(
        screen.getByText(/Please upload only JPEG or PNG images/i)
      ).toBeInTheDocument();
    });

    expect(onDone).not.toHaveBeenCalled();
  });

  it('displays error when country is invalid', async () => {
    const onDone = vi.fn();
    renderUncontrolledForm(onDone);

    const form = screen
      .getByRole('button', { name: /create account/i })
      .closest('form') as HTMLFormElement;

    fireEvent.change(screen.getByLabelText(/^name/i), {
      target: { value: 'John Doe' },
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/^age/i), {
      target: { value: '25' },
    });

    fireEvent.click(screen.getByDisplayValue('male'));

    fireEvent.change(screen.getByLabelText(/country/i), {
      target: { value: 'InvalidCountry' },
    });

    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'Password123!' },
    });

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'Password123!' },
    });

    const avatarInput = screen.getByLabelText(
      /upload avatar/i
    ) as HTMLInputElement;
    const file = mockFile();

    const fileList = {
      0: file,
      length: 1,
      item: (index: number): File | null => (index === 0 ? file : null),
    } as unknown as FileList;

    Object.defineProperty(avatarInput, 'files', {
      value: fileList,
      writable: false,
    });

    fireEvent.change(avatarInput);

    fireEvent.click(screen.getByLabelText(/accept the terms/i));

    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/valid country/i)).toBeInTheDocument();
    });

    expect(onDone).not.toHaveBeenCalled();
  });

  it('toggles password visibility when clicking eye button', () => {
    renderUncontrolledForm();

    const passwordInput = screen.getByLabelText(
      /^password$/i
    ) as HTMLInputElement;
    const toggleButton = screen.getAllByLabelText(
      /show password|hide password/i
    )[0];

    expect(passwordInput.type).toBe('password');

    fireEvent.click(toggleButton);

    expect(passwordInput.type).toBe('text');

    fireEvent.click(toggleButton);

    expect(passwordInput.type).toBe('password');
  });
});
