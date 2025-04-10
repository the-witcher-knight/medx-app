import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, extendTheme, theme as defaultTheme } from '@chakra-ui/react';
import ToastContainer from 'common/toastify';
import getStore from 'config/store';

import App from './App';
import reportWebVitals from './reportWebVitals';

// Get store
const store = getStore();

// Initialize chakra theme
const theme = extendTheme(defaultTheme, {
  fonts: {
    heading: 'JetBrains Mono',
    body: 'JetBrains Mono',
  },
});

// Initialize mount point
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <ToastContainer />
        </BrowserRouter>
      </Provider>
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
