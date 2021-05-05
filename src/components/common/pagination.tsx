import Pagination, { PaginationProps } from "rc-pagination";
import { ChevronLeftIcon, ChevronRightIcon } from "src/components/icons";
import classNames from "classnames";

export type RCPaginationProps = PaginationProps;

export function RCPagination({ ...props }: PaginationProps) {
  const style = classNames(
    "relative",
    "inline-flex",
    "items-center",
    "border",
    "border-gray-300",
    "bg-white",
    "text-sm",
    "leading-5",
    "font-medium",
    "text-gray-500",
    "hover:text-gray-400",
    "focus:z-10",
    "focus:outline-none",
    "focus:border-blue-300",
    "focus:shadow-outline-blue",
    "active:bg-gray-100",
    "active:text-gray-500",
    "transition",
    "ease-in-out",
    "duration-150"
  );

  return (
    <Pagination
      className="relative z-0 inline-flex shadow-sm"
      itemRender={(page, type) => {
        if (type === "prev") {
          return (
            <a
              //href="#"
              className={classNames(
                style,
                "p-2",
                "rounded-l-md",
                "text-gray-500",
                "hover:text-gray-400",
                "cursor-pointer"
              )}
              aria-label="Previous"
            >
              <div className="w-5 h-5">
                <ChevronLeftIcon />
              </div>
            </a>
          );
        }

        if (type === "next") {
          return (
            <a
              //href="#"
              className={classNames(
                style,
                "-ml-px",
                "p-2",
                "rounded-r-md",
                "text-gray-500",
                "hover:text-gray-400",
                "cursor-pointer"
              )}
              aria-label="Next"
            >
              <div className="w-5 h-5">
                <ChevronRightIcon />
              </div>
            </a>
          );
        }

        return (
          <a
            //href="#"
            className={classNames(
              style,
              "-ml-px",
              "px-4",
              "py-2",
              "text-gray-700",
              "hover:text-gray-500",
              "cursor-pointer",
              { "text-gray-900 bg-gray-200": props?.current === page }
            )}
          >
            {type === "page" ? page : "..."}
          </a>
        );
      }}
      {...props}
    />
  );
}
