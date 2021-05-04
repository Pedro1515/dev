import React, { createContext, useContext, useState } from "react";
import {
  Modal,
  Button,
  ModalProps,
  ModalBody,
  ModalFooter,
  ModalWrapper,
  ModalTitle,
} from "src/components";
import { useModal } from "src/utils/hooks";

export interface AlertProps extends Omit<ModalProps, "children" | "open"> {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  body: string;
  action?: string;
}

function Alert({
  visible,
  onClose,
  onConfirm,
  title,
  body,
  action,
  ...props
}: AlertProps) {
  return (
    <Modal {...{ visible, onClose }} {...props}>
      <div className="bg-white w-5/12 m-auto rounded-lg shadow-2xl">
        <ModalWrapper>
          <ModalTitle>{title}</ModalTitle>
          <ModalBody>{body}</ModalBody>
        </ModalWrapper>
        <ModalFooter>
          <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
            <Button
              variant="primary"
              color="red"
              label={action ? action : "Aceptar"}
              onClick={onConfirm}
            />
          </span>
          <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
            <Button variant="white" label="Cancel" onClick={onClose} />
          </span>
        </ModalFooter>
      </div>
    </Modal>
  );
}

type AlertState = {
  title: string;
  body: string;
  action?: string;
  onConfirm: () => void;
  AlertProps?: AlertProps;
};

const initialState = {
  title: "",
  body: "",
  action: undefined,
  onConfirm: () => {},
};

export interface AlertProviderValue {
  show(options: AlertState);
}

const AlertContext = createContext<AlertProviderValue>(null);

export function AlertProvider({ children }) {
  const alert = useModal();
  const [state, setState] = useState<AlertState>(initialState);

  const show = ({ title, body, action, onConfirm }) => {
    alert.toggle();
    setState({ ...state, title, body, action, onConfirm });
  };

  const onConfirm = () => {
    state.onConfirm();
    alert.toggle();
  };

  return (
    <>
      <AlertContext.Provider value={{ show }}>{children}</AlertContext.Provider>
      <Alert
        visible={alert.visibility}
        onClose={alert.toggle}
        {...{ ...state, onConfirm }}
      />
    </>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);

  if (context === undefined) {
    throw new Error("useAlert must be used within a AlertProvider");
  }

  return context;
}
