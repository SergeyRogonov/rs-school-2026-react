import { describe, it, expect, vi, type Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Home from '../Home';
import formsReducer, { type FormsState } from '../../store/formsSlice';
import * as hooks from '../../store/hooks';

vi.mock('../../store/hooks', () => ({
  useAppSelector: vi.fn(),
  useAppDispatch: vi.fn(),
}));

const renderHome = (
  initialState: Partial<FormsState> = { submissions: [] }
) => {
  const store = configureStore({
    reducer: { forms: formsReducer },
    preloadedState: {
      forms: {
        submissions: [],
        countries: [],
        ...initialState,
      } as FormsState,
    },
  });

  // Properly typed mock, no any, no unknown
  (hooks.useAppSelector as Mock).mockImplementation(
    (selector: (state: { forms: FormsState }) => unknown) =>
      selector(store.getState())
  );

  return render(
    <Provider store={store}>
      <Home />
    </Provider>
  );
};

describe('Home', () => {
  it('renders header and empty state when no submissions exist', () => {
    renderHome({ submissions: [] });

    expect(screen.getByText(/react forms/i)).toBeInTheDocument();
    expect(screen.getByText(/submissions \(0\)/i)).toBeInTheDocument();
    expect(screen.getByText(/no submissions yet/i)).toBeInTheDocument();
  });

  it('renders submissions count and cards when submissions exist', () => {
    const submission = {
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

    renderHome({ submissions: [submission] });

    expect(screen.getByText(/submissions \(1\)/i)).toBeInTheDocument();
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    expect(screen.queryByText(/no submissions yet/i)).not.toBeInTheDocument();
  });

  it('opens uncontrolled form modal when button is clicked', async () => {
    const user = userEvent.setup();
    renderHome();

    await user.click(
      screen.getByRole('button', { name: /uncontrolled form/i })
    );

    expect(screen.getByText(/uncontrolled form/i)).toBeInTheDocument();
  });

  it('opens react hook form modal when button is clicked', async () => {
    const user = userEvent.setup();
    renderHome();

    await user.click(screen.getByRole('button', { name: /react hook form/i }));

    expect(screen.getByText(/react hook form/i)).toBeInTheDocument();
  });
});
