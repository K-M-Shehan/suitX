import { configureStore } from '@reduxjs/toolkit';
// In future: import and add reducers here
export const store = configureStore({
  reducer: {},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;