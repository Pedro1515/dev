import { useEffect } from "react";
import classNames from "classnames";
import { motion, AnimatePresence } from "framer-motion";
import { Portal } from "src/components/";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  CrossCircleIcon,
  InformationCircleIcon,
  CrossIcon,
} from "src/components/icons";

export type NotificationType = "info" | "error" | "success" | "alert";

interface NotificationProps {
  type: NotificationType;
  title: string;
  message: string;
  visible: boolean;
  onClose: () => void;
  autoClose?: number;
}

function Icon({ type }: { type: NotificationType }) {
  let IconComponent;

  const color = {
    info: "blue",
    error: "red",
    success: "green",
    alert: "yellow",
  };

  if (type === "info") {
    IconComponent = InformationCircleIcon;
  }

  if (type === "error") {
    IconComponent = CrossCircleIcon;
  }

  if (type === "alert") {
    IconComponent = ExclamationCircleIcon;
  }

  if (type === "success") {
    IconComponent = CheckCircleIcon;
  }

  return (
    <div
      className={classNames(
        "w-7",
        "h-7",
        `text-${color[type]}-400`,
        "mr-4",
        "-ml-px"
      )}
    >
      <IconComponent />
    </div>
  );
}

export function Notification({
  type,
  title,
  message,
  visible,
  onClose,
  autoClose,
}: NotificationProps) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (visible) {
        onClose();
      }
    }, autoClose);
    return () => clearTimeout(timeout);
  }, [visible]);

  const notificationPanel = {
    visible: {
      opacity: 1,
      translateY: 4,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    hidden: {
      opacity: 0,
      translateY: 0,
      transition: { duration: 0.1, ease: "easeIn" },
    },
    exit: {
      opacity: 0,
      translateY: 0,
      transition: { duration: 0.1, ease: "easeIn" },
    },
  };

  return (
    <AnimatePresence>
      {visible && (
        <Portal selector="#portal">
          <motion.div
            className={classNames(
              "absolute",
              "max-w-md",
              "bg-white",
              "flex",
              "rounded-lg",
              "p-4",
              "shadow-lg",
              "items-center",
              "border",
              "top-0",
              "right-0",
              "m-4",
              "z-50"
            )}
            initial="hidden"
            animate="visible"
            variants={notificationPanel}
            exit="exit"
          >
            <div className="flex">
              <Icon {...{ type }} />
              <div className="flex flex-col my-1">
                <span className="leading-5 text-gray-800 font-medium">
                  {title}
                </span>
                <span className="text-gray-600 leading-normal mt-2">
                  {message}
                </span>
              </div>
              <button
                onClick={onClose}
                className={classNames(
                  "w-5",
                  "h-5",
                  "text-gray-500",
                  "hover:text-gray-600",
                  "transition-colors",
                  "duration-100",
                  "ml-4",
                  "outline-none"
                )}
              >
                <CrossIcon />
              </button>
            </div>
          </motion.div>
        </Portal>
      )}
    </AnimatePresence>
  );
}
