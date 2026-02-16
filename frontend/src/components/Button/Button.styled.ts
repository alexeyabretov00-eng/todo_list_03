import styled, { css } from 'styled-components';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
}

export const StyledButton = styled.button<ButtonProps>`
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 500;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}

  ${({ size }) => {
    switch (size) {
      case 'small':
        return css`
          padding: 6px 12px;
          font-size: 14px;
          min-height: 32px;
        `;
      case 'large':
        return css`
          padding: 12px 24px;
          font-size: 16px;
          min-height: 48px;
        `;
      case 'medium':
      default:
        return css`
          padding: 8px 16px;
          font-size: 14px;
          min-height: 40px;
        `;
    }
  }}

  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.background};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primaryHover};
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
      case 'secondary':
        return css`
          background-color: ${theme.colors.secondary};
          color: ${theme.colors.text};
          border: 1px solid ${theme.colors.border};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.secondaryHover};
            border-color: ${theme.colors.primary};
          }
        `;
      case 'danger':
        return css`
          background-color: ${theme.colors.error};
          color: ${theme.colors.background};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.errorHover};
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
          }
        `;
      case 'ghost':
        return css`
          background-color: transparent;
          color: ${theme.colors.text};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.secondaryHover};
          }
        `;
      default:
        return css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.background};
        `;
    }
  }}
`;
