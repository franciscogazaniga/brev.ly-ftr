import Image404 from '../../public/404.svg'

export function NotFound() {
  return (
    <main>
      <div className="w-full flex gap-y-5 flex-col items-center justify-center bg-gray-100 p-6 max-w-96 rounded-lg gap-y-6">
        <img src={Image404} alt="Imagem de erro 404" />

        <span className="text-xl-custom text-gray-600">Link não encontrado</span>

        <span className="text-md-custom text-gray-500">O link que você está tentando acessar não existe, foi removido ou é uma URL inválida. Saiba mais em brev.ly.</span>
      </div>
    </main>
  )
}