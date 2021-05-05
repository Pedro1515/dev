import React from "react";
import classNames from "classnames";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean; 
  IconComponent: React.ReactNode;
}

export function IconButton({
  active,
  IconComponent,
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={classNames(
        "focus:outline-none",
        // { "bg-gray-300 text-gray-700": active },
        className
      )}
      {...props}
    >
      {IconComponent}
    </button>
  );
}
