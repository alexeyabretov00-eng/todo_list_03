import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { FormContainer, FormInput } from './CreateListForm.styled';

interface Props {
  onSubmit: (name: string) => void;
  disabled?: boolean;
}

export const CreateListForm: React.FC<Props> = ({ onSubmit, disabled = false }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('List name is required');
      return;
    }
    
    if (name.length > 500) {
      setError('List name cannot exceed 500 characters');
      return;
    }
    
    onSubmit(name.trim());
    setName('');
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (error) setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && name.trim() && !disabled) {
      handleSubmit();
    }
  };

  return (
    <FormContainer>
      <FormInput>
        <Input
          value={name}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          placeholder="Enter list name..."
          status={error ? 'error' : ''}
          maxLength={500}
          disabled={disabled}
        />
      </FormInput>
      <Button type="primary" onClick={handleSubmit} disabled={disabled || !name.trim()}>
        Create List
      </Button>
    </FormContainer>
  );
};
