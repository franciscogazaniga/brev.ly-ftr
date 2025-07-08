import * as Toast from '@radix-ui/react-toast'
import { useState } from 'react'

type ToastType = 'info' | 'error'

type ToastPayload = {
  title: string
  description?: string
  type?: ToastType
}

export function ToastProvider() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<ToastType>('info')

  if (typeof window !== 'undefined') {
    (window as any).showToast = ({ title, description = '', type = 'info' }: ToastPayload) => {
      setTitle(title)
      setDescription(description)
      setType(type)
      setOpen(true)
    }
  }

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        className={`bg-white rounded-md px-4 py-3 shadow-lg border-l-4 ${type === 'error' ? 'border-red-500' : 'border-blue-500'
          }`}
        open={open}
        onOpenChange={setOpen}
      >
        <Toast.Title className="text-sm font-semibold text-gray-900">{title}</Toast.Title>
        {description && (
          <Toast.Description className="mt-1 text-sm text-gray-700">{description}</Toast.Description>
        )}
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-4 right-4 w-[320px] z-50" />
    </Toast.Provider>
  )
}