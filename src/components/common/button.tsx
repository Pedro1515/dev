import React from "react";
import classNames from "classnames";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant: "primary" | "white";
  color?: string;
}

export function Button({
  label,
  variant,
  color = "blue",
  ...props
}: ButtonProps) {
  const primary = classNames(
    `border-transparent`,
    `bg-${color}-600`,
    "text-white",
    "hover:text-gray-100",
    `active:bg-${color}-100`,
    `active:text-${color}-800`,
    `hover:bg-${color}-500`,
    `focus:border-${color}-300`
  );

  const white = classNames(
    "border-gray-300",
    "bg-white",
    "text-gray-700",
    "hover:text-gray-500",
    "active:bg-gray-50",
    "active:text-gray-800",
    "focus:border-blue-300"
  );

  return (
    <button
      type="button"
      className={classNames(
        "inline-flex",
        "shadow-sm",
        "justify-center",
        "w-full",
        "rounded-md",
        "border",
        "px-4",
        "py-2",
        "text-sm",
        "leading-5",
        "font-medium",
        "focus:outline-none",
        "focus:shadow-outline-blue",
        "transition",
        "ease-in-out",
        "duration-150",
        variant === "primary" ? primary : white
      )}
      id="options-menu"
      aria-haspopup="true"
      aria-expanded="true"
      {...props}
    >
      {label}
    </button>
  );
}
