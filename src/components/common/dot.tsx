import classNames from "classnames";

export interface DotProps {
  color: string;
  className?: string;
  size?: keyof typeof sizes;
}

const sizes = {
  small: classNames("w-2", "h-2"),
  medium: classNames("w-4", "h-4"),
  large: classNames("w-6", "h-6"),
};

export function Dot({ size = "small", color, className }: DotProps) {
  return (
    <div
      className={classNames(
        "flex-shrink-0",
        "rounded-full",
        `bg-${color}-500`,
        sizes[size],
        className
      )}
    />
  );
}
