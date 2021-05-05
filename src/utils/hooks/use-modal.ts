import { useState, useCallback } from "react";

export function useModal() {
  const [visibility, setVisibility] = useState(false);
  const toggle = useCallback(() => setVisibility(!visibility), [visibility]);
  const getModalProps = (props?) => ({ onClick: toggle, ...props });

  return {
    visibility,
    toggle,
    getModalProps,
  };
}
