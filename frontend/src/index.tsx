import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { ConfigProvider } from 'antd';
import { store } from '@store';
import { theme } from '@theme';
import { GlobalStyles } from '@styles';
import { App } from '@containers';
import { register } from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: theme.colors.primary,
              fontFamily: theme.typography.fontFamily,
            },
          }}
        >
          <GlobalStyles />
          <App />
        </ConfigProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

// Register service worker for PWA functionality
register();

// Enable hot module replacement in development
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept();
}
