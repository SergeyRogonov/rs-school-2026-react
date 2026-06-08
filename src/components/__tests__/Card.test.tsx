import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from '../Card';
import { useAppDispatch } from '../../store/hooks';
import { clearRecent } from '../../store/formsSlice';
import type { Submission } from '../../store/formsSlice';

vi.mock('../../store/hooks', () => ({
  useAppDispatch: vi.fn(),
}));

describe('Card', () => {
  const dispatch = vi.fn();

  const baseSubmission: Submission = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    gender: 'male',
    age: 25,
    country: 'France',
    avatar: 'https://example.com/avatar.png',
    password: 'TestPassword123!',
    termsAccepted: true,
    timestamp: Date.now(),
    recent: false,
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    (useAppDispatch as unknown as Mock).mockReturnValue(dispatch);
  });

  it('renders submission data correctly', () => {
    render(<Card submission={baseSubmission} />);

    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/male/i)).toBeInTheDocument();
    expect(screen.getByText(/25/i)).toBeInTheDocument();
    expect(screen.getByText(/france/i)).toBeInTheDocument();

    const img = screen.getByAltText(/user avatar/i);
    expect(img).toHaveAttribute('src', baseSubmission.avatar);
  });

  it('shows "New Submission" badge when recent is true', () => {
    render(<Card submission={{ ...baseSubmission, recent: true }} />);

    expect(screen.getByText(/new submission/i)).toBeInTheDocument();
  });

  it('does NOT show badge when recent is false', () => {
    render(<Card submission={baseSubmission} />);

    expect(screen.queryByText(/new submission/i)).not.toBeInTheDocument();
  });

  it('dispatches clearRecent after 5 seconds when recent is true', () => {
    render(<Card submission={{ ...baseSubmission, recent: true }} />);

    expect(dispatch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(5000);

    expect(dispatch).toHaveBeenCalledTimes(1);

    const action = dispatch.mock.calls[0][0];

    expect(action.type).toBe(clearRecent.type);
    expect(action.payload).toEqual(
      expect.objectContaining({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      })
    );
  });

  it('cleans up timer on unmount', () => {
    const { unmount } = render(
      <Card submission={{ ...baseSubmission, recent: true }} />
    );

    unmount();

    vi.advanceTimersByTime(5000);

    expect(dispatch).not.toHaveBeenCalled();
  });
});
