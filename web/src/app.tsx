import { MyLinks } from "./components/my-links";
import { NewLink } from "./components/new-link";

export function App() {
  return (
    <main className="h-dvh flex flex-col gap-y-3 items-center justify-center p-10 bg-gray-200">
      <NewLink />
      <MyLinks />
    </main>
  )
}
