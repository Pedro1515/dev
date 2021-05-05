import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Portal, Button } from "src/components/";
import classNames from "classnames";
import { useOnClickOutside } from "src/utils/hooks";

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  hideOverlay?: boolean;
  disableOverlayClick?: boolean;
  children: React.ReactNode;
}

export function ModalTitle({ children }) {
  return (
    <h3
      className="text-lg leading-6 font-medium text-gray-900"
      id="modal-headline"
    >
      {children}
    </h3>
  );
}

export function ModalWrapper({ children }) {
  return (
    <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <div className="sm:flex sm:items-start">
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          {children}
        </div>
      </div>
    </div>
  );
}

export function ModalBody({ children }) {
  return (
    <div className="mt-2">
      <p className="text-sm leading-5 text-gray-500">{children}</p>
    </div>
  );
}

export function ModalFooter({ children }) {
  return (
    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
      {children}
    </div>
  );
}

function Overlay() {
  const overlay = {
    visible: {
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    hidden: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
    exit: {
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 transition-opacity"
      initial="hidden"
      animate="visible"
      variants={overlay}
      exit="exit"
    >
      <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
    </motion.div>
  );
}

export function Modal({
  visible,
  onClose,
  hideOverlay = false,
  disableOverlayClick = false,
  children,
}: ModalProps) {
  const ref = useRef(null);
  useOnClickOutside(ref, onClose);

  const modalPanel = {
    visible: {
      opacity: 1,
      translateY: 4,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    hidden: {
      opacity: 0,
      translateY: 0,
      transition: { duration: 0.2, ease: "easeIn" },
    },
    exit: {
      opacity: 0,
      translateY: 0,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  return (
    <AnimatePresence>
      {visible && (
        <Portal selector="#portal">
          <div className="fixed z-50 inset-0 overflow-y-auto">
            <div
              className={classNames(
                "flex",
                "items-end",
                "justify-center",
                "min-h-screen",
                "pt-4",
                "px-4",
                "pb-20",
                "text-center",
                "sm:block",
                "sm:p-0"
              )}
            >
              {hideOverlay ? null : <Overlay />}
              <span
                className={classNames(
                  "hidden",
                  "sm:inline-block",
                  "sm:align-middle",
                  "sm:h-screen"
                )}
              ></span>
              <motion.div
                ref={disableOverlayClick ? undefined : ref}
                className={classNames(
                  "inline-block",
                  "align-bottom",
                  "bg-transparent",
                  "text-left",
                  "overflow-hidden",
                  "transform",
                  "transition-all",
                  "sm:mt-2",
                  "sm:align-middle",
                  "w-full"
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline"
                initial="hidden"
                animate="visible"
                variants={modalPanel}
                exit="exit"
              >
                {children}
              </motion.div>
            </div>
          </div>
        </Portal>
      )}
    </AnimatePresence>
  );
}
