import { useCallback } from 'react'
import { api } from '../utils/api'
import { setAuthTokens, clearAuthTokens } from '../utils/tokenStorage'

export const useAuth = () => {
  const signIn = useCallback(async (email: string, password: string) => {
    const response = await api.post('/auth/sign_in', { email, password })
    const h = response.headers
    setAuthTokens({
      'access-token': String(h['access-token'] ?? ''),
      client: String(h.client ?? ''),
      uid: String(h.uid ?? ''),
    })
    return response.data.data
  }, [])

  const signUp = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      passwordConfirmation: string,
      confirmSuccessUrl: string,
    ) => {
      const response = await api.post('/auth', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        confirm_success_url: confirmSuccessUrl,
      })
      const h = response.headers
      setAuthTokens({
        'access-token': String(h['access-token'] ?? ''),
        client: String(h.client ?? ''),
        uid: String(h.uid ?? ''),
      })
      return response.data.data
    },
    [],
  )

  const signOut = useCallback(async () => {
    await api.delete('/auth/sign_out')
    clearAuthTokens()
  }, [])

  return { signIn, signUp, signOut }
}
