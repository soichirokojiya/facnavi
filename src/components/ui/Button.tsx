import { type ComponentProps } from "react";

type ButtonVariant = "primary" | "secondary" | "accent" | "outline";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  secondary: "bg-gray-600 text-white hover:bg-gray-700",
  accent: "bg-accent text-white hover:bg-amber-600",
  outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`px-6 py-3 rounded-lg font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
