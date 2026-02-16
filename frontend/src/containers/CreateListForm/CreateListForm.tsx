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
  onSubmit: (name: string) => void;
  disabled?: boolean;
}

export const CreateListForm: React.FC<Props> = ({ onSubmit, disabled = false }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormInput>
        <Input
          value={name}
          onChange={handleChange}
          placeholder="Enter list name..."
          error={error}
          fullWidth
          maxLength={500}
          disabled={disabled}
        />
      </FormInput>
      <Button type="submit" disabled={disabled || !name.trim()}>
        Create List
      </Button>
    </FormContainer>
  );
};
