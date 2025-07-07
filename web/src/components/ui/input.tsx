type InputProps = {
  inputHeader: string
  inputPlaceholder: string
} & React.InputHTMLAttributes<HTMLInputElement>

export function Input({ inputHeader, inputPlaceholder, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-y-2 focus-within:text-blue-base focus-within:font-bold">
      <p className="text-xs-custom">{inputHeader}</p>
      <input
        type="text"
        className="w-full p-4 border border-gray-300 rounded-lg text-md-custom focus:border-blue-base"
        placeholder={inputPlaceholder}
        {...props}
      />
    </div>
  )
}