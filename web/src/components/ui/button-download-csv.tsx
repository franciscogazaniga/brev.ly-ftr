import type { ReactElement } from "react"
// import type { ElementType } from "react"

type ButtonProps = {
  icon: ReactElement,
  children: React.ReactNode,
  isLoading: boolean,
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function ButtonDownloadCSV({ children, icon, isLoading, ...props }: ButtonProps) {
  return (
    <button disabled={isLoading} className={"flex flex-row items-center text-gray-500 justify-center gap-x-2 p-2 cursor-pointer text-sm-custom bg-gray-200 rounded-sm hover:shadow-[inset_0_0_0_1px_var(--color-blue-base)] disabled:opacity-50 disabled:pointer-events-none aria-disabled:opacity-50 aria-disabled:pointer-events-none"} {...props}>
      {isLoading ? (
        <span className="loader w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></span>
      ) : (
        <span className="text-gray-600">{icon}</span>
      )}
      {children}
    </ button>
  )
}