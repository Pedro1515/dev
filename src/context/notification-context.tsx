import React, { createContext, useContext, useState } from "react";
import { Notification, NotificationType } from "src/components";
import { useModal } from "src/utils/hooks";

interface NotificationState {
  title: string;
  message: string;
  type: NotificationType;
}

const initialState: NotificationState = {
  title: "",
  message: "",
  type: "success",
};

export interface NotificationProviderValue {
  show(options: NotificationState);
}

const NotificationContext = createContext<NotificationProviderValue>(null);

export function NotificationProvider({ children }) {
  const notification = useModal();
  const [state, setState] = useState(initialState);

  const show = ({ title, message, type }) => {
    notification.toggle();
    setState({ ...state, title, message, type });
  };

  return (
    <>
      <NotificationContext.Provider value={{ show }}>
        {children}
      </NotificationContext.Provider>
      <Notification
        visible={notification.visibility}
        onClose={notification.toggle}
        autoClose={4000}
        {...{ ...state }}
      />
    </>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);

  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }

  return context;
}
