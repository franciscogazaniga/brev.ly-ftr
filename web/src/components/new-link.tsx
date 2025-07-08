import { useLinks } from "../store/links";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { WarningDiamondIcon } from "@phosphor-icons/react";

const inputSchema = z.object({
  originalLink: z.string().url({ message: "Informe uma URL válida." }),
  customSlug: z.string()
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: "Informe uma url minúscula e sem espaços/caracter especial",
    }),
});


type FormData = z.infer<typeof inputSchema>;

export function NewLink() {
  const { createLink } = useLinks()
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({ resolver: zodResolver(inputSchema), })

  async function handleCreateLink(data: { originalLink: string; customSlug: string }) {
    await createLink(data.originalLink, data.customSlug)
    reset()
  }

  return (
    <div className="w-full flex gap-y-5 flex-col justify-center bg-gray-100 p-6 max-w-96 rounded-lg">
      <h1 className="text-lg-custom">Novo Link</h1>

      <form onSubmit={handleSubmit(handleCreateLink)} className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-2">
          <Input
            id="originalLink"
            type="text"
            inputHeader="Link original"
            inputPlaceholder="www.exemplo.com.br"
            error={errors.originalLink?.message}
            {...register('originalLink')}
          />
          {errors.originalLink && (
            <span className="flex flex-row items-center gap-x-2 text-gray-500 text-xs"><span className="text-danger"><WarningDiamondIcon size={14} /></span>{errors.originalLink.message}</span>)}
        </div>

        <div className="flex flex-col gap-y-2">
          <Input
            id="customSlug"
            type="text"
            inputHeader="Link encurtado"
            inputPlaceholder="breav.ly/"
            error={errors.originalLink?.message}
            {...register('customSlug')}
          />
          {errors.customSlug && (
            <span className="flex flex-row items-center gap-x-2 text-gray-500 text-xs"><span className="text-danger"><WarningDiamondIcon size={14} /></span>{errors.customSlug.message}</span>)}
        </div>


        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Salvando..." : "Salvar link"}</Button>
      </form>
    </div>
  )
}