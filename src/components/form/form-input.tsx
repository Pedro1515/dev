import React, { InputHTMLAttributes } from "react";
import classNames from "classnames";

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const FormInput = React.forwardRef((props: FormInputProps, ref) => (
  <input
    className={classNames(
      "shadow-sm",
      "appearance-none",
      "border",
      "rounded-md",
      "w-full",
      "py-2",
      "px-3",
      "text-gray-700",
      "focus:outline-none",
      "text-sm"
    )}
    {...props}
  />
));
