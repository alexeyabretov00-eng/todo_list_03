import React, { useState } from 'react';
import { Input, Button, Row, Col, message } from 'antd';
import { useAppDispatch, useAppSelector } from '@hooks';
import { createSubItem } from '@slices';
import { FormContainerStyled, FormRow, CharCounter } from './CreateSubItemFormContainer.styled';

const MAX_TEXT_LENGTH = 500;
const MAX_SUBITEMS_PER_ELEMENT = 20;

interface CreateSubItemFormContainerProps {
  elementId: string;
  onSuccess?: () => void;
}

export const CreateSubItemFormContainer: React.FC<CreateSubItemFormContainerProps> = ({ elementId, onSuccess }) => {
  const dispatch = useAppDispatch();
  const [text, setText] = useState('');
  const { loading, error } = useAppSelector((state) => state.subItems);
  const { items: subItems } = useAppSelector((state) => state.subItems);

  const elementSubItems = subItems.filter((si) => si.elementId === elementId);
  const isAtLimit = elementSubItems.length >= MAX_SUBITEMS_PER_ELEMENT;
  const isNearLimit = text.length > MAX_TEXT_LENGTH * 0.8;
  const isDisabled = !text.trim() || isAtLimit || text.length > MAX_TEXT_LENGTH;

  const handleSubmit = async () => {
    if (!text.trim()) {
      message.error('Please enter sub-item text');
      return;
    }

    if (text.length > MAX_TEXT_LENGTH) {
      message.error(`Sub-item text must be ${MAX_TEXT_LENGTH} characters or less`);
      return;
    }

    if (isAtLimit) {
      message.error(`Maximum ${MAX_SUBITEMS_PER_ELEMENT} sub-items per element`);
      return;
    }

    try {
      await dispatch(createSubItem({ elementId, text: text.trim() })).unwrap();
      setText('');
      message.success('Sub-item created');
      onSuccess?.();
    } catch (err: any) {
      message.error(err || 'Failed to create sub-item');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isDisabled) {
      handleSubmit();
    }
  };

  return (
    <FormContainerStyled>
      <FormRow gutter={[12, 12]}>
        <Col span={24}>
          <Input
            placeholder="Add a sub-item..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading || isAtLimit}
            maxLength={MAX_TEXT_LENGTH}
            status={error ? 'error' : isNearLimit ? 'warning' : ''}
          />
          <CharCounter isNearLimit={isNearLimit}>
            {text.length}/{MAX_TEXT_LENGTH} characters
          </CharCounter>
        </Col>
        <Col span={24}>
          <Button
            type="primary"
            block
            onClick={handleSubmit}
            loading={loading}
            disabled={isDisabled}
          >
            {loading ? 'Adding...' : `Add Sub-Item${isAtLimit ? ' (Limit reached)' : ''}`}
          </Button>
          {error && (
            <div style={{ color: 'red', marginTop: '8px', fontSize: '12px' }}>
              {error}
            </div>
          )}
        </Col>
      </FormRow>
    </FormContainerStyled>
  );
};
