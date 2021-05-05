import React from "react";
import classNames from "classnames";

export function NoAccount() {
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm leading-5">
          <span className="px-2 bg-gray-100 text-gray-500">
            Don't have an account?
          </span>
        </div>
      </div>

      <div className="mt-6">
        <a
          href="https://crowdar.com.ar/"
          className={classNames(
            "block",
            "w-full",
            "text-center",
            "py-2",
            "px-3",
            "border",
            "border-gray-300",
            "rounded-md",
            "text-gray-900",
            "font-medium",
            "hover:border-gray-400",
            "focus:outline-none",
            "focus:border-gray-400",
            "sm:text-sm",
            "sm:leading-5"
          )}
        >
          Contact our sales team
        </a>
      </div>
    </div>
  );
}
