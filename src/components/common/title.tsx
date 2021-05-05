import React from "react";
import classNames from "classnames";

export interface TitleProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function Title({ className, children, ...props }: TitleProps) {
  return (
    <span
      className={classNames(
        "text-left",
        "text-xs",
        "leading-4",
        "font-medium",
        "text-gray-500",
        "uppercase",
        "tracking-wider",
        className
      )}
    >
      {children}
    </span>
  );
}
