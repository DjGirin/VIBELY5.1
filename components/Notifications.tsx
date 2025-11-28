import React, { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import { Notification as NotificationType } from '../types';
import { XIcon, CheckCircleIcon, XCircleIcon, InfoIcon, AlertTriangleIcon } from './icons';

const notificationIcons = {
  success: <CheckCircleIcon className="w-6 h-6 text-green-400" />,
  error: <XCircleIcon className="w-6 h-6 text-red-400" />,
  info: <InfoIcon className="w-6 h-6 text-blue-400" />,
  warning: <AlertTriangleIcon className="w-6 h-6 text-yellow-400" />,
};

const notificationStyles = {
  success: 'border-green-500/50',
  error: 'border-red-500/50',
  info: 'border-blue-500/50',
  warning: 'border-yellow-500/50',
};

const NotificationToast: React.FC<{ notification: NotificationType }> = ({ notification }) => {
  const { actions } = useContext(NotificationContext)!;
  
  return (
    <div className={`w-full max-w-sm bg-light-surface shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden border-l-4 ${notificationStyles[notification.type]}`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {notificationIcons[notification.type]}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-light-text-primary">
              {notification.message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="inline-flex text-light-text-secondary rounded-md hover:text-light-text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink"
              onClick={() => actions.removeNotification(notification.id)}
            >
              <span className="sr-only">Close</span>
              <XIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NotificationContainer: React.FC = () => {
  const context = useContext(NotificationContext);

  if (!context) return null;

  const { state } = context;

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex flex-col items-end px-4 pt-20 pb-6 pointer-events-none sm:p-6 sm:pt-20 z-50"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {state.notifications.map((notification) => (
          <NotificationToast key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
};