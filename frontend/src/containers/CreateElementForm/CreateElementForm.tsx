import React, { useState } from 'react';
import { Input, Button } from '@components';
import { FormContainer, FormInput } from './CreateElementForm.styled';

interface Props {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export const CreateElementForm: React.FC<Props> = ({ onSubmit, disabled = false }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Element text is required');
      return;
    }
    
    if (text.length > 500) {
      setError('Element text cannot exceed 500 characters');
      return;
    }
    
    onSubmit(text.trim());
    setText('');
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (error) setError('');
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormInput>
        <Input
          value={text}
          onChange={handleChange}
          placeholder="Add a new task..."
          error={error}
          fullWidth
          maxLength={500}
          disabled={disabled}
        />
      </FormInput>
      <Button type="submit" disabled={disabled || !text.trim()}>
        Add Task
      </Button>
    </FormContainer>
  );
};
