import React, { useId, useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

const CustomInput = forwardRef(
  (
    { 
      label, 
      labelClassName = "", 
      type = "text", 
      className = "",
      icon,
      ...props 
    },
    ref
  ) => {
    const id = useId();
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleFocus = (e) => {
      setIsFocused(true);
      if (props.onFocus) props.onFocus(e);
    };

    const handleBlur = (e) => {
      setIsFocused(false);
      if (props.onBlur) props.onBlur(e);
    };

    const handleChange = (e) => {
      setHasValue(!!e.target.value);
      if (props.onChange) props.onChange(e);
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const inputType =
      type === "password" ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full relative">
        {label && (
          <label
            className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none z-10
              ${
                isFocused || hasValue
                  ? "-top-2.5 text-xs text-[#2563EB] bg-white"
                  : "top-1/2 -translate-y-1/2 text-[#64748B]"
              }
              ${icon ? 'left-10' : 'left-3'}
              ${labelClassName}`}
            htmlFor={id}
          >
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]">
              {icon}
            </div>
          )}
          
          <input
            type={inputType}
            className={`px-4 py-3 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] 
              outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 
              transition-all duration-200 w-full
              ${icon ? 'pl-10' : 'pl-4'}
              ${isFocused || hasValue ? 'border-[#2563EB]' : ''}
              ${className}`}
            ref={ref}
            {...props}
            id={id}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            // placeholder={isFocused || hasValue ? '' : label} // For better UX
          />

          {type === "password" && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#334155] focus:outline-none transition-colors"
              onClick={togglePasswordVisibility}
              tabIndex="-1"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>
    );
  }
);

CustomInput.displayName = 'CustomInput';

export default CustomInput;