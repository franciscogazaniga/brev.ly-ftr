export function LoadingBar() {
  return (
    <div className="absolute top-0 left-0 h-1 w-full overflow-hidden rounded-t-lg">
      <div className="h-full w-1/3 bg-blue-base animate-[marquee_1.5s_ease-in-out_infinite]" />
    </div>
  )
}