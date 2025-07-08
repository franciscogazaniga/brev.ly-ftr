export async function copyLinkToClipboard(customSlug: string) {
  try {
    await navigator.clipboard.writeText(`localhost:5173/${customSlug}`)

    const successMessage = `O link ${customSlug} foi copiado para a área de transferência.`

    return successMessage
  } catch (err) {
    throw new Error()
  }
}