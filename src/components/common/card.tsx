import React from "react";
import classNames from "classnames";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={classNames(
        "flex",
        "bg-white",
        className
      )}
    >
      {children}
    </div>
  );
}
