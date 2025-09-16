import { isAxiosError } from 'axios'
import { useCallback } from 'react'
import { api } from '../utils/api'
import { clearAuthTokens } from '../utils/tokenStorage'
import { useCurrentUser } from './useCurrentUser'

export const useAuth = () => {
  const { refresh } = useCurrentUser()

  const signIn = useCallback(
    async (email: string, password: string) => {
      const response = await api.post('/auth/sign_in', { email, password })
      await refresh()
      return response.data.data
    },
    [refresh],
  )

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
      return response.data.data
    },
    [],
  )

  // const signOut = useCallback(async () => {
  //   await api.delete('/auth/sign_out')
  //   clearAuthTokens()
  //   await refresh(undefined, { revalidate: false })
  // }, [refresh])
  const signOut = useCallback(async () => {
    try {
      await api.delete('/auth/sign_out')
    } catch (e) {
      if (
        !(
          isAxiosError(e) &&
          (e.response?.status === 401 || e.response?.status === 404)
        )
      ) {
        throw e
      }
    } finally {
      clearAuthTokens()
      await refresh(undefined, { revalidate: false })
    }
  }, [refresh])

  const guestSignIn = useCallback(async () => {
    const res = await api.post('/auth/guest_sign_in')
    await refresh()
    return res.data.data
  }, [refresh])

  return { signIn, signUp, signOut, guestSignIn }
}
