export async function selectLocalPath(): Promise<string | null> {
  // Verificar se o navegador suporta File System Access API
  if (!('showDirectoryPicker' in window)) {
    // Fallback: pedir ao usuário que digitalize o caminho
    const path = prompt('Cole o caminho da pasta:\n(Ex: C:\\Users\\seunome\\Documents\\estudos)')
    return path ? path.trim() : null
  }

  try {
    // @ts-ignore - File System Access API não está totalmente tipificado
    const dirHandle = await window.showDirectoryPicker({
      mode: 'read',
      startIn: 'documents'
    })

    // Retornar o nome da pasta (não conseguimos o caminho completo por segurança)
    return dirHandle.name
  } catch (error: any) {
    // Usuário cancelou ou erro
    if (error.name !== 'AbortError') {
      console.error('Erro ao acessar pasta:', error)
    }
    return null
  }
}

export async function openLocalPath(pathOrName: string): Promise<boolean> {
  // Esta é uma web app, então não podemos abrir diretamente
  // Mas podemos:
  // 1. Copiar o caminho para clipboard
  // 2. Mostrar ao usuário
  // 3. Sugerir usar Ctrl+L no explorador

  try {
    await navigator.clipboard.writeText(pathOrName)
    alert(
      `📋 Caminho copiado para a área de transferência!\n\n${pathOrName}\n\n` +
      `Abra seu explorador de arquivos e cole o caminho (Ctrl+L em Windows/Linux, Cmd+L em Mac)`
    )
    return true
  } catch (error) {
    // Fallback se clipboard falhar
    const message = `Abra esta pasta no seu computador:\n\n${pathOrName}`
    alert(message)
    return false
  }
}

export function isLocalPathValid(path: string): boolean {
  // Validação simples: deve ter separadores de caminho
  return path.includes('\\') || path.includes('/')
}
