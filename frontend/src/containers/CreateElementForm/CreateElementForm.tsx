import React, { useState } from 'react';
import styled from 'styled-components';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

const FormContainer = styled.form`
  display: flex;
  gap: 12px;
  align-items: flex-end;
  margin-bottom: 24px;
`;

const FormInput = styled.div`
  flex: 1;
`;

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
