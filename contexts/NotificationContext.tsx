import React, { createContext, useState, useCallback, useMemo } from 'react';
import { Notification, NotificationState, NotificationActions } from '../types';

interface NotificationContextValue {
  state: NotificationState;
  actions: NotificationActions;
}

export const NotificationContext = createContext<NotificationContextValue | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = `${Date.now()}_${Math.random()}`;
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [newNotification, ...prev]);

    const duration = notification.duration ?? 5000; // 5 seconds default
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }, [removeNotification]);

  const actions = useMemo(() => ({ addNotification, removeNotification }), [addNotification, removeNotification]);

  const value = useMemo(() => ({ state: { notifications }, actions }), [notifications, actions]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
