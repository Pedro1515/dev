import React, { HTMLAttributes } from "react";
import classNames from "classnames";
import { SearchIcon, CrossIcon } from "src/components/icons";
import { callAll, noop } from "src/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

interface ResetterProps {
  onClick?: (e: React.MouseEvent) => void;
}

export interface SearchBoxProps extends React.HTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
  className?: string;
  inputProps: InputProps;
  resetterProps: ResetterProps;
}

export function useSearchBox(initialValue: string) {
  const [value, setValue] = React.useState(initialValue);
  const handleText = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setValue(event.target.value),
    [value]
  );

  const clear = () => setValue("");

  const getInputProps = ({ onChange = noop, ...props }: InputProps) => ({
    role: "searchbox",
    value,
    onChange: callAll(onChange, handleText),
    ...props,
  });

  const getResetterProps = ({ onClick = noop, ...props }: ResetterProps) => ({
    role: "reset",
    onClick: callAll(onClick, clear),
    ...props,
  });

  return {
    value,
    handleText,
    clear,
    setValue,
    getInputProps,
    getResetterProps,
  };
}

export function SearchBox({
  fullWidth,
  className,
  inputProps,
  resetterProps,
}: SearchBoxProps) {
  const { value } = inputProps;
  return (
    <div className="relative">
      <input
        type="text"
        className={classNames(
          "shadow-sm",
          "appearance-none",
          "border",
          "rounded-md",
          { "w-full": fullWidth },
          "py-3",
          "px-3",
          "pl-10",
          "text-gray-700",
          "leading-tight",
          "focus:outline-none",
          "focus:shadow",
          "text-sm",
          className
        )}
        {...inputProps}
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
        <div className="w-5 h-5 text-gray-500">
          <SearchIcon />
        </div>
      </div>
      {value && (
        <div
          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
          {...resetterProps}
        >
          <div className="w-5 h-5 text-gray-500 hover:text-gray-600 transition-colors duration-100">
            <CrossIcon />
          </div>
        </div>
      )}
    </div>
  );
}
