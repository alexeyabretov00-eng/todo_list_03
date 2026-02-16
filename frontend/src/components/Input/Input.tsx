import React from 'react';
import { StyledInput, InputWrapper, InputLabel, InputError, InputProps } from './Input.styled';

interface Props extends InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  maxLength?: number;
  className?: string;
}

export const Input: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  label,
  error,
  disabled = false,
  hasError,
  fullWidth = false,
  maxLength,
  className,
}) => {
  return (
    <InputWrapper className={className}>
      {label && <InputLabel>{label}</InputLabel>}
      <StyledInput
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        hasError={hasError || !!error}
        fullWidth={fullWidth}
        maxLength={maxLength}
      />
      {error && <InputError>{error}</InputError>}
    </InputWrapper>
  );
};
