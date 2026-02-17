import styled from 'styled-components';
import { Row } from 'antd';

export const FormContainerStyled = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  padding: 16px;
  margin: 16px 0;
`;

export const FormRow = styled(Row)`
  gap: 12px;
`;

export const CharCounter = styled.span<{ isNearLimit: boolean }>`
  font-size: 12px;
  color: ${({ isNearLimit, theme }) =>
    isNearLimit ? theme.colors.error : theme.colors.textSecondary};
  margin-top: 4px;
`;
