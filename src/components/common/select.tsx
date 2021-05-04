import React, { useRef, useCallback } from "react";
import classNames from "classnames";
import { Machine } from "xstate";
import { useMachine } from "@xstate/react";
import { SelectorIcon } from "src/components/icons";
import { useOnClickOutside } from "src/utils/hooks";

export interface Option {
  label: string;
  value: string | number;
}
export interface SelectProps {
  name: string;
  options: Option[];
  onSelect: (option: Option) => void;
  selected: Option;
}

const selectMachine = Machine({
  id: "select",
  initial: "closed",
  states: {
    closed: {
      on: {
        TOGGLE: {
          target: "opened",
        },
      },
    },
    opened: {
      on: {
        TOGGLE: {
          target: "closed",
        },
        SELECT: {
          target: "closed",
        },
      },
    },
  },
});

export function Select({ name, options, selected, onSelect }: SelectProps) {
  const [current, send] = useMachine(selectMachine);
  const menuRef = useRef(null);

  const toggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      send("TOGGLE");
    },
    [send]
  );

  const handleSelect = useCallback(
    (option: Option) => (e: React.MouseEvent) => {
      onSelect(option);
      send("SELECT");
    },
    [send]
  );

  useOnClickOutside(menuRef, toggle);

  return (
    <div className="relative w-full">
      <span
        className={classNames(
          "inline-block",
          "w-full",
          "rounded-md",
          "shadow-sm"
        )}
      >
        <button
          type="button"
          name={name}
          className={classNames(
            "relative",
            "w-full",
            "rounded-md",
            "border",
            "bg-white",
            "pl-3",
            "pr-10",
            "py-1",
            "text-left",
            "focus:outline-none",
            "focus:shadow-outline-blue",
            "focus:border-blue-300",
            "transition",
            "ease-in-out",
            "duration-150",
            "text-sm",
            "leading-5"
          )}
          onClick={toggle}
        >
          <div className="flex items-center space-x-3">
            <span className="block truncate" title={selected.label}>
              {selected.label}
            </span>
          </div>
          <span
            className={classNames(
              "absolute",
              "inset-y-0",
              "right-0",
              "flex",
              "items-center",
              "pr-2",
              "pointer-events-none"
            )}
          >
            <div className="h-5 w-5 text-gray-400">
              <SelectorIcon />
            </div>
          </span>
        </button>
      </span>
      {current.matches("opened") && (
        <div
          ref={menuRef}
          className={classNames(
            "absolute",
            "mt-1",
            "w-full",
            "rounded-md",
            "bg-white",
            "shadow-lg",
            "z-10"
          )}
        >
          <ul
            className={classNames(
              "max-h-56",
              "rounded-md",
              "py-1",
              "text-base",
              "leading-6",
              "shadow-xs",
              "overflow-auto",
              "focus:outline-none",
              "sm:text-sm",
              "sm:leading-5"
            )}
          >
            {options.map((option) => (
              <li
                key={option.value}
                className={classNames(
                  "text-gray-900",
                  "cursor-pointer",
                  "select-none",
                  "relative",
                  "py-1",
                  "pl-3",
                  "pr-9",
                  "transition duration-200 hover:bg-gray-200"
                )}
                onClick={handleSelect(option)}
              >
                <div className="flex items-center space-x-3">
                  <span className="font-normal block truncate">
                    {option.label}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
