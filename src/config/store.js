import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'store';

import logger from './middleware/logger';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.config', 'payload.request', 'error', 'meta.arg'],
      },
    }).concat(logger),
});

// getStore provides a way to access the Redux store
const getStore = () => store;

export default getStore;
