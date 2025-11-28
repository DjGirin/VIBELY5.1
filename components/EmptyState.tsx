import React from 'react';
import { MessageSquareIcon } from './icons';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon = <MessageSquareIcon className="w-16 h-16 text-light-border" />,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-light-bg">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-light-text-primary">{title}</h3>
      <p className="mt-2 text-light-text-secondary max-w-xs">{message}</p>
    </div>
  );
};

export default EmptyState;
