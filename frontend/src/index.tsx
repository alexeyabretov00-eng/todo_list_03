import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { ConfigProvider } from 'antd';
import { store } from './store';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// App component will be created in Phase 3
const App = () => {
  return (
    <div style={{ padding: '24px' }}>
      <h1>Todo List Application</h1>
      <p>Phase 1-2 Foundation Complete. User interface will be implemented in Phase 3+.</p>
    </div>
  );
};

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
serviceWorkerRegistration.register();

// Enable hot module replacement in development
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept();
}
