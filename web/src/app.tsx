import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MyLinks } from "./components/my-links";
import { NewLink } from "./components/new-link";
import { RedirectBySlug } from "./routes/redirectBySlug";
import { ToastContainer } from "react-toastify";
import { NotFound } from "./routes/notFound";
import Logo from '../public/Logo.svg'

export function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="bottom-right" autoClose={3000} />

      <Routes>
        <Route
          path="/"
          element={
            <main className="h-dvh w-full flex flex-col items-center justify-center gap-y-2 bg-gray-200 p-6">
              <div className="w-full md:w-auto md:min-w-3xl flex flex-col items-start justify-start gap-y-6 md:gap-y-8">
                <div className="w-full md:w-auto flex items-center justify-center md:justify-start">
                  <img src={Logo} alt="Logo Brev.ly" className="flex w-24 max-w-full h-auto" />
                </div>

                <div className="w-full flex flex-col md:flex-row gap-y-3 md:gap-x-3 items-center justify-center md:items-start">
                  <NewLink />
                  <MyLinks />
                </div>
              </div>
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
