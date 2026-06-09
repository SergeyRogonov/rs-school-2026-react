import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import countriesData from '../data/countries.json';

export type Submission = {
  id: string;
  name: string;
  age: number;
  email: string;
  gender: string;
  termsAccepted: boolean;
  password: string;
  avatar: Base64URLString;
  country: string;
  timestamp: number;
  recent: boolean;
};

export interface FormsState {
  submissions: Submission[];
  countries: string[];
}

const initialState: FormsState = {
  submissions: [],
  countries: countriesData.countries,
};

const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    addSubmission(
      state,
      action: PayloadAction<Omit<Submission, 'id' | 'timestamp' | 'recent'>>
    ) {
      state.submissions.push({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        recent: true,
        ...action.payload,
      });
    },
    clearRecent(state, action: PayloadAction<{ id: string }>) {
      const s = state.submissions.find((x) => x.id === action.payload.id);
      if (s) s.recent = false;
    },
  },
});

export const { addSubmission, clearRecent } = formsSlice.actions;
export default formsSlice.reducer;
