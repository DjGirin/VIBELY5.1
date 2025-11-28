import React, { DragEvent } from 'react';
import { Task } from '../types';
import LazyImage from './LazyImage';
import { MessageSquareIcon } from './icons';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onDragStart: (e: DragEvent<HTMLDivElement>) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, onDragStart }) => {
  const { title, assignees, comments, dueDate, priority } = task;
  
  const priorityStyles = {
    low: 'bg-green-400',
    medium: 'bg-yellow-400',
    high: 'bg-red-400',
  };

  return (
    <div
      onClick={onClick}
      onDragStart={onDragStart}
      draggable
      className="bg-light-surface rounded-lg border border-light-border p-3 cursor-pointer hover:bg-light-bg shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
    >
      <p className="font-semibold text-sm mb-3">{title}</p>
      <div className="flex justify-between items-center">
        <div className="flex items-center -space-x-2">
          {assignees.map(user => (
            <LazyImage
              key={user.id}
              src={user.avatarUrl}
              alt={user.name}
              className="w-6 h-6 rounded-full border border-light-surface"
              title={user.name}
            />
          ))}
        </div>
        <div className="flex items-center space-x-3 text-xs text-light-text-secondary">
          {comments.length > 0 && (
            <div className="flex items-center space-x-1">
              <MessageSquareIcon className="w-3 h-3" />
              <span>{comments.length}</span>
            </div>
          )}
          <span>{new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${priorityStyles[priority]} transition-transform duration-300 transform translate-y-1 group-hover:translate-y-0`}></div>
    </div>
  );
};

export default TaskCard;