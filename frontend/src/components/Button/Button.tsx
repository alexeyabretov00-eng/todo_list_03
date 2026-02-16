import React from 'react';
import { StyledButton, ButtonProps } from './Button.styled';

interface Props extends ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  className?: string;
}

export const Button: React.FC<Props> = ({
  children,
  onClick,
  type = 'button',
  icon,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  className,
}) => {
  return (
    <StyledButton
      type={type}
      onClick={onClick}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      className={className}
    >
      {icon && <span>{icon}</span>}
      {children}
    </StyledButton>
  );
};
