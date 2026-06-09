import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReactHookForm from '../ReactHookForm';
import { addSubmission } from '../../store/formsSlice';

import {
  createMockRootState,
  createMockUseDispatch,
  createMockUseSelector,
  mockFormData,
  mockFile,
} from '../../test-utils/mocks.ts';

const dispatchMock = createMockUseDispatch()();

vi.mock('react-redux', () => {
  return {
    useDispatch: () => dispatchMock,
    useSelector: (selector: unknown) =>
      createMockUseSelector(createMockRootState())(selector as never),
  };
});

vi.mock('../utils/helpers', () => {
  return {
    fileToDataUrl: vi.fn(async () => 'data:image/png;base64,avatar'),
    checkPasswordStrength: vi.fn(() => ({
      hasNumber: true,
      hasUppercase: true,
      hasLowercase: true,
      hasSpecialChar: true,
    })),
  };
});

vi.mock('lucide-react', () => ({
  Eye: () => <span>eye</span>,
  EyeOff: () => <span>eye-off</span>,
}));

beforeEach(() => {
  dispatchMock.mockClear();
});

const fillForm = () => {
  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: mockFormData.name },
  });

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: mockFormData.email },
  });

  fireEvent.change(screen.getByLabelText(/age/i), {
    target: { value: Number(mockFormData.age) },
  });

  fireEvent.click(screen.getByDisplayValue('male'));

  fireEvent.change(screen.getByLabelText(/country/i), {
    target: { value: mockFormData.country },
  });

  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: mockFormData.password },
  });

  fireEvent.change(screen.getByLabelText(/confirm password/i), {
    target: { value: mockFormData.confirm },
  });

  fireEvent.click(screen.getByLabelText(/i accept the terms/i));

  fireEvent.change(screen.getByLabelText(/avatar/i), {
    target: { files: [mockFile()] },
  });
};

describe('ReactHookForm', () => {
  it('renders form fields', () => {
    render(<ReactHookForm />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/avatar/i)).toBeInTheDocument();
  });

  it('enables submit when form is valid', async () => {
    render(<ReactHookForm />);

    fillForm();

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /create account/i })
      ).toBeEnabled();
    });
  });

  it('dispatches addSubmission on submit', async () => {
    render(<ReactHookForm onDone={vi.fn()} />);

    fillForm();

    const button = screen.getByRole('button', {
      name: /create account/i,
    });

    await waitFor(() => expect(button).toBeEnabled());

    fireEvent.click(button);

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: addSubmission.type,
          payload: expect.objectContaining({
            name: mockFormData.name,
            email: mockFormData.email,
            age: Number(mockFormData.age),
            gender: mockFormData.gender,
            country: mockFormData.country,
            termsAccepted: true,
          }),
        })
      );
    });
  });

  it('calls onDone after successful submit', async () => {
    const onDone = vi.fn();

    render(<ReactHookForm onDone={onDone} />);

    fillForm();

    const button = screen.getByRole('button', {
      name: /create account/i,
    });

    await waitFor(() => expect(button).toBeEnabled());

    fireEvent.click(button);

    await waitFor(() => {
      expect(onDone).toHaveBeenCalled();
    });
  });
});
