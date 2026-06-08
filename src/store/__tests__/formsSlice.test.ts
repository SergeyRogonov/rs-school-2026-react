import { describe, it, expect } from 'vitest';
import formsReducer, {
  addSubmission,
  clearRecent,
} from '../../store/formsSlice';

describe('formsSlice reducer', () => {
  it('adds a submission with recent=true', () => {
    const initialState = { submissions: [], countries: ['United States'] };
    const nextState = formsReducer(
      initialState,
      addSubmission({
        name: 'Jane Doe',
        age: 32,
        email: 'jane@example.com',
        gender: 'female',
        termsAccepted: true,
        password: 'Secret123!',
        avatar: 'data:image/png;base64,abc',
        country: 'United States',
      })
    );

    expect(nextState.submissions).toHaveLength(1);
    expect(nextState.submissions[0].termsAccepted).toBe(true);
    expect(nextState.submissions[0].recent).toBe(true);
    expect(typeof nextState.submissions[0].id).toBe('string');
  });

  it('clears the recent flag for an existing submission', () => {
    const state = {
      submissions: [
        {
          id: 'submission-id',
          name: 'Jane Doe',
          age: 32,
          email: 'jane@example.com',
          gender: 'female',
          termsAccepted: true,
          password: 'Secret123!',
          avatar: 'data:image/png;base64,abc',
          country: 'United States',
          timestamp: Date.now(),
          recent: true,
        },
      ],
      countries: ['United States'],
    };

    const nextState = formsReducer(state, clearRecent({ id: 'submission-id' }));

    expect(nextState.submissions[0].recent).toBe(false);
  });
});
