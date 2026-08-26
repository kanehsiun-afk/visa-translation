"use client";

import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "md" | "lg" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 disabled:opacity-40 disabled:cursor-not-allowed select-none";
  const variants: Record<Variant, string> = {
    primary: "bg-brand text-white hover:bg-brand-2",
    secondary: "bg-surface text-ink border border-line hover:border-ink-3",
    ghost: "text-ink-2 hover:text-ink hover:bg-black/[0.04]",
    danger: "bg-white text-red-600 border border-red-200 hover:bg-red-50",
  };
  const sizes: Record<Size, string> = {
    sm: "h-9 px-3.5 text-sm",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-[15px]",
  };
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
}
