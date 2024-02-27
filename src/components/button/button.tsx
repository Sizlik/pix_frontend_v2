import { HTMLInputTypeAttribute } from "react";

export default function PixButton({
  value,
  type = "button",
  className,
  variant,
  onClick,
}: {
  value: string;
  type?: HTMLInputTypeAttribute;
  className?: string;
  variant?: "standard" | "cancel";
  onClick?: () => void;
}) {
  const variants = {
    standard: "px-4 text-white bg-black hover:bg-gray-900",
    cancel: "text-black hover:text-red-500",
  };
  return (
    <input
      value={value}
      type={type}
      onClick={onClick}
      className={`py-2 text-center cursor-pointer transition-all ${variant ? variants[variant] : variants.standard} ${className}`}
    />
  );
}
