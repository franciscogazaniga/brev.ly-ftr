import type { ReactElement } from "react"
// import type { ElementType } from "react"

type ButtonProps = {
  icon: ReactElement,
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function ButtonIcon({ children, icon, ...props }: ButtonProps) {
  return (
    <button className={"flex flex-row items-center text-gray-600 justify-center p-2 cursor-pointer text-sm-custom bg-gray-200 rounded-sm hover:shadow-[inset_0_0_0_1px_var(--color-blue-base)]"} {...props}>
      {icon}
    </ button>
  )
}