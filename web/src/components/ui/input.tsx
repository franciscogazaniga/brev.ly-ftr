type InputProps = {
  inputHeader: string
  inputPlaceholder: string
} & React.InputHTMLAttributes<HTMLInputElement>

export function Input({ inputHeader, inputPlaceholder, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-y-2">
      <p className="text-xs-custom">{inputHeader}</p>
      <input
        type="text"
        className="w-full p-4 border border-gray-300 rounded-lg text-md-custom"
        placeholder={inputPlaceholder}
        {...props}
      />
    </div>
  )
}