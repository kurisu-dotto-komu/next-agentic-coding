import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  variant?: "elevated" | "flat";
  className?: string;
}

export default function Card({
  children,
  variant = "elevated",
  className = "",
}: CardProps) {
  const baseStyles = "rounded-xl p-6 transition-all duration-200";

  const variants = {
    elevated: "bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl",
    flat: "bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800",
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}
