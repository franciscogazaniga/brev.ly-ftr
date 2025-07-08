import { forwardRef } from "react"

type InputProps = {
  inputHeader: string
  inputPlaceholder: string
  error?: string
} & React.InputHTMLAttributes<HTMLInputElement>

function InputComponent({ inputHeader, inputPlaceholder, error, ...props }: InputProps, ref: React.Ref<HTMLInputElement>) {
  const inputId = props.id || inputHeader.toLowerCase().replace(/\s+/g, "-")

  return (
    <div className="flex flex-col gap-y-2">
      <input
        id={inputId}
        ref={ref}
        className={`order-2 peer w-full p-4 border rounded-lg text-md-custom text-gray-600
          ${error
            ? "border-danger focus:border-danger"
            : "border-gray-300 focus:border-blue-base"
          }
        `}
        placeholder={inputPlaceholder}
        {...props}
      />

      <label
        htmlFor={inputId}
        className={`order-1 text-xs-custom
            transition-colors
            ${error ? "text-danger peer-focus:text-danger" : "text-gray-500"}
            peer-focus:text-blue-base
          `}>
        {inputHeader}
      </label>
    </div>
  )
}

export const Input = forwardRef(InputComponent)

// Para evitar warnings no React DevTools
Input.displayName = "Input"