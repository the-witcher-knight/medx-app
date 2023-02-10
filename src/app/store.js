import { configureStore } from '@reduxjs/toolkit';
import loggerMiddleware from 'app/middleware/logger';
import rootReducer from 'rootReducer';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.config', 'payload.request', 'error', 'meta.arg'],
      },
    }).concat(loggerMiddleware),
});

// getStore provides a way to access the Redux store
const getStore = () => store;

export default getStore;
