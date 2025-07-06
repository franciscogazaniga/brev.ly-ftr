import { useState } from "react";
import { useLinks } from "../store/links";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function NewLink() {
  const { createLink, isLoading } = useLinks()
  const [originalLink, setOriginalLink] = useState("")
  const [slug, setSlug] = useState("")

  async function handleCreateLink() {
    if (!originalLink || !slug) {
      alert("Por favor, preencha todos os campos.")
      return
    }

    await createLink(originalLink, slug)
    setOriginalLink("")
    setSlug("")
  }

  return (
    <div className="w-full flex gap-y-5 flex-col justify-center bg-gray-100 p-6 max-w-96 rounded-lg">
      <h1 className="text-lg-custom">Novo Link</h1>

      <div className="flex flex-col gap-y-4">
        <Input inputHeader="Link original" inputPlaceholder="www.exemplo.com.br" value={originalLink} onChange={(e) => setOriginalLink(e.target.value)} />

        <Input inputHeader="Link encurtado" inputPlaceholder="breav.ly/" value={slug} onChange={(e) => setSlug(e.target.value)} />
      </div>

      <div>
        <Button onClick={handleCreateLink}>{isLoading ? "Salvando..." : "Salvar link"}</Button>
      </div>
    </div>
  )
}