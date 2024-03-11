import { EmojiAngryFill, Eye, EyeSlash } from "react-bootstrap-icons";

export function PixInput({
  text,
  type,
  id,
  placeholder,
  className,
  icon = null,
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-normal text-gray-900">
        {text}
        <div className="items-center mt-3 flex flex-row justify-end">
          <input
            type={type}
            id={id}
            aria-describedby="helper-text-explanation"
            className="bg-[#fff] border border-[#ededed] w-full text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            placeholder={placeholder}
            required
          />
          {icon && <div className="absolute mr-4">{icon}</div>}
        </div>
      </label>
    </div>
  );
}

export function PixCancelButton({ text, onClick, className, disabled }) {
  return (
    <div className={className}>
      <button
        onClick={onClick}
        disabled={disabled}
        type="button"
        className="text-gray-900 w-full hover:text-white border-1 transition-all mr-2 border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        {text}
      </button>
    </div>
  );
}

export function PixSumbitInput({ value, className, disabled }) {
  return (
    <div className={className}>
      <input
        type="submit"
        disabled={disabled}
        className="focus:outline-none w-full text-white bg-emerald-500 transition-all hover:bg-emerald-600 focus:ring-4 focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 "
        value={value}
      />
    </div>
  );
}

export function PixButton({
  children,
  onClick,
  className,
  disabled,
  variant = "primary",
  selected = false,
}) {
  const variants = selected
    ? {
      primary: "text-black border-1 border-yellow-700",
      secondary: "bg-amber-600 text-white border-2 border-amber-700",
      success: "bg-emerald-800 text-white border-2 border-emerald-700",
      danger: "bg-red-600 text-white border-2 border-red-700",
    }
    : {
      primary: "bg-yellow-700 hover:bg-yellow-800 text-white",
      secondary: "bg-amber-700 hover:bg-amber-800 text-white",
      success: "bg-emerald-600 hover:bg-emerald-700 text-white",
      danger: "bg-red-700 hover:bg-red-800 text-white",
    };
  return (
    <button
      onClick={onClick}
      className={`rounded-xl transition-all py-1 px-4 border-1 flex items-center justify-center ${variants[variant]} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function PasswordIcon({ eye, setEye }) {
  const onClick = () => {
    setEye(!eye);
  };

  return (
    <div
      className="cursor-pointer relative left-2 group w-8 h-8 flex items-center justify-center"
      onClick={onClick}
    >
      {eye ? (
        <Eye className="group-hover:w-6 group-hover:h-6 transition-all " />
      ) : (
        <EyeSlash className="group-hover:w-6 group-hover:h-6 transition-all " />
      )}
    </div>
  );
}