import { Dot } from "./dot";
import classNames from "classnames";
import { CrossIcon } from "../icons";

export interface BadgeProps {
  label: string;
  color: string;
  IconComponent?: React.ReactNode;
  uppercase?: boolean;
  className?: string;
  onDismiss?: () => void;
}

export function Badge({
  label,
  color,
  IconComponent,
  uppercase = true,
  className,
  onDismiss,
}: BadgeProps) {
  return (
    <span
      className={classNames(
        "px-2",
        "py-px",
        "inline-flex",
        "text-xs",
        "leading-5",
        "font-semibold",
        "rounded-full",
        `bg-${color}-100`,
        `text-${color}-800`,
        "tracking-wide",
        "items-center",
        { uppercase: uppercase },
        { [`hover:bg-${color}-200`]: onDismiss },
        className
      )}
      onClick={onDismiss}
    >
      {IconComponent ? IconComponent : <Dot {...{ color }} className="mr-2" />}
      {label}
      {onDismiss ? (
        <button className="ml-2 w-3 h-3">
          <CrossIcon />
        </button>
      ) : null}
    </span>
  );
}
