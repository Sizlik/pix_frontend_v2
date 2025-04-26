import { ChangeEvent, ReactElement } from "react";
import { Icon } from "react-bootstrap-icons";
import {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import InputMask from "react-input-mask";

interface PixInputProps<T extends FieldValues> {
  label?: string;
  className?: string;
  inputClassName?: string;
  register: UseFormRegister<T>;
  name: Path<T>;
  options?: RegisterOptions<T, Path<T>>;  // Fixed the generic type here
  placeholder?: string;
  type?: string;
  error?: boolean;
}

interface PixSearchProps {
  className: string;
  icon: ReactElement;
  placeholder: string;
  inputClassName: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const PixInput = <T extends FieldValues>({
                                                  className,
                                                  type,
                                                  register,
                                                  label,
                                                  name,
                                                  placeholder,
                                                  options,
                                                  error = false,
                                                  inputClassName,
                                                }: PixInputProps<T>) => {
  return (
      <div className={className}>
        {label && <label htmlFor={name}>{label}</label>}
        <input
            id={name}
            {...register(name, options)}
            className={`bg-[#F2F4F7] rounded-3xl mt-1 px-4 py-4 w-full outline-[#D9D9D9] border border-rose-600 ${error ? "border-opacity-100" : "border-opacity-0"} transition-all ${inputClassName}`}
            placeholder={placeholder}
            type={type}
        />
      </div>
  );
};

export const PixTextArea = <T extends FieldValues>({
                                                     className,
                                                     register,
                                                     label,
                                                     name,
                                                     placeholder,
                                                     options,
                                                     error = false,
                                                   }: PixInputProps<T>) => {
  return (
      <div className={className}>
        {label && <label htmlFor={name}>{label}</label>}
        <textarea
            id={name}
            {...register(name, options)}
            className={`bg-[#F2F4F7] rounded-3xl px-4 py-4 w-full outline-[#D9D9D9] border border-rose-600 ${error ? "border-opacity-100" : "border-opacity-0"} transition-all resize-none h-full pr-20`}
            placeholder={placeholder}
        />
      </div>
  );
};

export const PixInputMask = <T extends FieldValues>({
                                                      mask,
                                                      className,
                                                      register,
                                                      label,
                                                      name,
                                                      placeholder,
                                                      options,
                                                      error = false,
                                                    }: PixInputProps<T> & { mask: string }) => {
  return (
      <div className={className}>
        {label && <label htmlFor={name}>{label}</label>}
        <InputMask
            mask={mask}
            id={name}
            {...register(name, options)}
            className={`bg-[#F2F4F7] rounded-3xl px-4 py-4 w-full mt-1 outline-[#D9D9D9] border border-rose-600 ${error ? "border-opacity-100" : "border-opacity-0"} transition-all`}
            placeholder={placeholder}
        />
      </div>
  );
};

export const PixSearch = ({
                            className,
                            icon,
                            placeholder,
                            inputClassName,
                            onChange,
                          }: PixSearchProps) => {
  return (
      <div className={`flex items-center relative ${className}`}>
        <input
            onChange={onChange}
            className={`border border-[#e5e7eb] outline-none rounded-md px-2 py-1 focus:border-gray-500 ${inputClassName}`}
            placeholder={placeholder}
        />
        <div className="absolute right-4">{icon}</div>
      </div>
  );
};