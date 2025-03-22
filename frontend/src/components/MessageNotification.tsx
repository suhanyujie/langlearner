import * as React from 'react';
import { MessageBar, MessageBarBody } from '@fluentui/react-components';

interface MessageNotificationProps {
  type: 'error' | 'success';
  msg: string;
}

export const MessageNotification: React.FC<MessageNotificationProps> = ({
  type,
  msg,
}) => {
  let messageBar = null;
  if (type === 'error') {
    messageBar = (
      <MessageBar intent="error">
        <MessageBarBody>{msg}</MessageBarBody>
      </MessageBar>
    );
  } else if (type === 'success') {
    messageBar = (
      <MessageBar intent="success">
        <MessageBarBody>{msg}</MessageBarBody>
      </MessageBar>
    );
  }

  return <>{messageBar}</>;
};
