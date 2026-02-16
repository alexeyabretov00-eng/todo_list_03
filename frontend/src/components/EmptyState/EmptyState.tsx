import React from 'react';
import {
  EmptyStateContainer,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
} from './EmptyState.styled';

interface Props {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<Props> = ({
  icon,
  title,
  description,
  actions,
  className,
}) => {
  return (
    <EmptyStateContainer className={className}>
      {icon && <EmptyStateIcon>{icon}</EmptyStateIcon>}
      <EmptyStateTitle>{title}</EmptyStateTitle>
      {description && <EmptyStateDescription>{description}</EmptyStateDescription>}
      {actions && <EmptyStateActions>{actions}</EmptyStateActions>}
    </EmptyStateContainer>
  );
};
