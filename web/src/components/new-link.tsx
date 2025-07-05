import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function NewLink() {
  return (
    <div className="w-full flex gap-y-5 flex-col justify-center bg-gray-100 p-6 max-w-96 rounded-lg">
      <h1 className="text-lg-custom">Novo Link</h1>

      <div className="flex flex-col gap-y-4">
        <Input inputHeader="Link original" inputPlaceholder="www.exemplo.com.br" />

        <Input inputHeader="Link encurtado" inputPlaceholder="breav.ly/" />
      </div>

      <div>
        <Button>Salvar link</Button>
      </div>
    </div>
  )
}