import React from "react";
import classNames from "classnames";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant: "primary" | "secondary";
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
    `hover:bg-${color}-500`
  );

  const secondary = classNames(
    "border-gray-300",
    "bg-white",
    "text-gray-900",
    "hover:text-gray-700",
    "active:bg-gray-50",
    "active:text-gray-800"
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
        "focus:border-blue-300",
        "focus:shadow-outline-blue",
        "transition",
        "ease-in-out",
        "duration-150",
        variant === "primary" ? primary : secondary
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