type ButtonProps = {
  children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ children, ...props }: ButtonProps) {
  return (
    <button className={"w-full px-5 py-4 cursor-pointer text-md-custom bg-blue-base text-white rounded-lg hover:bg-blue-dark disabled:opacity-50 disabled:pointer-events-none aria-disabled:opacity-50 aria-disabled:pointer-events-none"} {...props}>{children}</ button>
  )
}