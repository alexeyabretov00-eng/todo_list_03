import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { FormContainer, FormInput } from './CreateElementForm.styled';

interface Props {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export const CreateElementForm: React.FC<Props> = ({ onSubmit, disabled = false }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && text.trim() && !disabled) {
      handleSubmit();
    }
  };

  return (
    <FormContainer>
      <FormInput>
        <Input
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          placeholder="Add a new task..."
          status={error ? 'error' : ''}
          maxLength={500}
          disabled={disabled}
        />
      </FormInput>
      <Button type="primary" onClick={handleSubmit} disabled={disabled || !text.trim()}>
        Add Task
      </Button>
    </FormContainer>
  );
};
