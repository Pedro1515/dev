import React, { useRef } from "react";
import { motion, HTMLMotionProps, AnimatePresence } from "framer-motion";
import classNames from "classnames";
import { useOnClickOutside } from "src/utils/hooks";

interface PopOverProps extends React.HTMLAttributes<HTMLDivElement> {
  visible: boolean;
  children: React.ReactNode;
  origin?: string;
  onClose: () => void;
}

export function PopOver({
  visible,
  children,
  className,
  onClose,
  ...props
}: PopOverProps & HTMLMotionProps<"div">) {
  const ref = useRef(null);
  useOnClickOutside(ref, onClose);

  const variants = {
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.1, ease: "easeOut" },
    },
    hidden: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.075, ease: "easeIn" },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.075, ease: "easeIn" },
    },
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={ref}
          initial="hidden"
          animate="visible"
          variants={variants}
          className={classNames(
            "absolute",
            "rounded-md",
            "shadow-lg",
            "z-10",
            className
          )}
          exit="exit"
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
