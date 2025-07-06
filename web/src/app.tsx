import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MyLinks } from "./components/my-links";
import { NewLink } from "./components/new-link";
import { RedirectBySlug } from "./routes/redirectBySlug";
import { ToastContainer } from "react-toastify";
import { NotFound } from "./routes/notFound";

export function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="bottom-right" autoClose={3000} />

      <Routes>
        <Route
          path="/"
          element={
            <main className="h-dvh flex flex-col gap-y-3 items-center justify-center p-10 bg-gray-200">
              <NewLink />
              <MyLinks />
            </main>
          }
        />

        <Route
          path="/:slug"
          element={
            <RedirectBySlug />
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>

  )
}
