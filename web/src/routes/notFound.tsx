import Image404 from '../../public/404.svg'
import Logo_Icon from '../../public/Logo_Icon.svg'

export function NotFound() {
  return (
    <main className="h-dvh flex flex-col gap-y-3 items-center justify-center bg-gray-200 px-3">
      <div className="w-full flex flex-col items-center justify-center bg-gray-100 max-w-[580px] rounded-lg gap-y-6 py-16 px-12">
        <img src={Image404} alt="Imagem de erro 404" />

        <span className="text-xl-custom text-gray-600">Link não encontrado</span>

        <span className="text-center text-md-custom text-gray-500">O link que você está tentando acessar não existe, foi removido ou é uma URL inválida. Saiba mais em <a className='text-blue-base underline' href='/'>brev.ly.</a></span>
      </div>
    </main>
  )
}