import { HTMLInputTypeAttribute } from "react";

export default function PixButton({
  value,
  type = "button",
  className,
  variant,
  onClick,
  disabled,
}: {
  value: string;
  type?: HTMLInputTypeAttribute;
  className?: string;
  variant?: "standard" | "cancel";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const variants = {
    standard: disabled ? "px-4 text-white bg-black" : "px-4 text-white bg-black hover:bg-gray-900",
    cancel: disabled ? "text-black" : "text-black hover:text-red-500",
  };
  return (
    <input
      value={value}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`py-2 text-center cursor-pointer transition-all ${variant ? variants[variant] : variants.standard} ${className}`}
    />
  );
}
