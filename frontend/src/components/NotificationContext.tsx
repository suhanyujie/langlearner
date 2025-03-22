import * as React from 'react';
import { MessageBar, MessageBarBody } from '@fluentui/react-components';

interface NotificationContextType {
  showNotification: (type: 'error' | 'success', msg: string) => void;
}

export const NotificationContext = React.createContext<NotificationContextType>(
  {
    showNotification: () => {},
  }
);

interface NotificationProviderProps {
  children: React.ReactNode;
}

interface NotificationState {
  type: 'error' | 'success';
  msg: string;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notification, setNotification] =
    React.useState<NotificationState | null>(null);

  const showNotification = (type: 'error' | 'success', msg: string) => {
    setNotification({ type, msg });
    // 3秒后自动清除通知
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000,
          }}
        >
          <MessageBar intent={notification.type}>
            <MessageBarBody>{notification.msg}</MessageBarBody>
          </MessageBar>
        </div>
      )}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  return React.useContext(NotificationContext);
};
