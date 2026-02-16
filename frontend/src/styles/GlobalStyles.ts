import { createGlobalStyle } from 'styled-components';
import { Theme } from './theme';

export const GlobalStyles = createGlobalStyle<{ theme: Theme }>`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${(props) => props.theme.typography.fontFamily};
    font-size: ${(props) => props.theme.typography.fontSize.base};
    line-height: ${(props) => props.theme.typography.lineHeight.normal};
    color: ${(props) => props.theme.colors.text.primary};
    background-color: ${(props) => props.theme.colors.background.default};
    overflow-x: hidden;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
    line-height: ${(props) => props.theme.typography.lineHeight.tight};
    margin-bottom: ${(props) => props.theme.spacing.md};
  }

  h1 {
    font-size: ${(props) => props.theme.typography.fontSize.xxl};
  }

  h2 {
    font-size: ${(props) => props.theme.typography.fontSize.xl};
  }

  h3 {
    font-size: ${(props) => props.theme.typography.fontSize.lg};
  }

  p {
    margin-bottom: ${(props) => props.theme.spacing.md};
  }

  a {
    color: ${(props) => props.theme.colors.primary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }

  ul, ol {
    list-style: none;
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  /* Scrollbar styles */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${(props) => props.theme.colors.background.default};
  }

  ::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.border.default};
    border-radius: ${(props) => props.theme.borderRadius.md};

    &:hover {
      background: ${(props) => props.theme.colors.text.secondary};
    }
  }

  /* Ant Design overrides */
  .ant-btn-primary {
    background-color: ${(props) => props.theme.colors.primary};
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${(props) => props.theme.colors.primary};
    border-color: ${(props) => props.theme.colors.primary};
  }
`;
