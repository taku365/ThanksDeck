import { Alert, Container, Typography } from '@mui/material'
import { AxiosError, isAxiosError } from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { api } from '@/utils/api'

export default function ConfirmationPage() {
  const router = useRouter()
  const { confirmation_token } = router.query
  const [isLoading, setIsLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    if (!router.isReady || !confirmation_token) {
      return
    }

    const confirmAccount = async () => {
      setIsLoading(true)

      try {
        await api.patch('/user/confirmations', { confirmation_token })
        setSuccessMessage(
          'アカウントが有効化されました。サインインページへ移動します。',
        )
        setTimeout(() => router.push('/signin'), 1500)
      } catch (e) {
        if (isAxiosError(e)) {
          const axiosError = e as AxiosError<{ message: string }>
          setErrorMessage(
            axiosError.response?.data?.message ??
              'アカウントの有効化に失敗しました。',
          )
        } else {
          setErrorMessage('予期せぬエラーが発生しました')
        }
      } finally {
        setIsLoading(false)
      }
    }
    confirmAccount()
  }, [router, router.isReady, confirmation_token])

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      {isLoading && <Typography>有効化中…</Typography>}
      {!isLoading && successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      {!isLoading && errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
    </Container>
  )
}
