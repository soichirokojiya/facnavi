import { type ComponentProps } from "react";

interface CardProps extends ComponentProps<"div"> {
  hover?: boolean;
}

export function Card({ hover = false, className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm ${
        hover ? "hover:shadow-md transition-shadow" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
