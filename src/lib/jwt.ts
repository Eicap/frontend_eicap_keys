/**
 * Decodifica un JWT sin verificar la firma (solo para leer los claims)
 * Útil para validar expiración en el cliente
 */
export function decodeJWT(token: string): Record<string, any> | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    // Decodificar el payload (segunda parte)
    const payload = parts[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  } catch (error) {
    console.error('Error decodificando JWT:', error)
    return null
  }
}

/**
 * Verifica si un JWT está expirado
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token)
  if (!decoded || !decoded.exp) {
    return true
  }

  // exp está en segundos, Date.now() está en milisegundos
  const expirationTime = decoded.exp * 1000
  const currentTime = Date.now()

  return currentTime > expirationTime
}

/**
 * Obtiene el tiempo restante del token en segundos
 */
export function getTokenTimeRemaining(token: string): number {
  const decoded = decodeJWT(token)
  if (!decoded || !decoded.exp) {
    return 0
  }

  const expirationTime = decoded.exp * 1000
  const currentTime = Date.now()
  const remaining = (expirationTime - currentTime) / 1000

  return Math.max(0, remaining)
}
