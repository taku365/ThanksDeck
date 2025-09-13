import {
  Alert,
  Container,
  Typography,
  Button,
  TextField,
  Stack,
  Box,
} from '@mui/material'
import { isAxiosError } from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { api } from '@/utils/api'

type ApiStatus = 'success' | 'error'
type NextAction = 'signin' | 'resend' | 'none'
interface ApiResponse {
  status: ApiStatus
  next: NextAction
  message: string
}

export default function ConfirmationPage() {
  const router = useRouter()
  const { confirmation_token } = router.query
  const [isLoading, setIsLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [showResend, setShowResend] = useState(false)
  const [resendEmail, setResendEmail] = useState('')
  const [isResending, setIsResending] = useState(false)
  const [resendFeedback, setResendFeedback] = useState<string>('')
  const [resendIsError, setResendIsError] = useState(false)

  useEffect(() => {
    if (!router.isReady || !confirmation_token) return

    const confirmAccount = async () => {
      setIsLoading(true)
      try {
        const { data } = await api.patch<ApiResponse>('/user/confirmations', {
          confirmation_token,
        })
        setSuccessMessage(
          data.message ||
            'アカウントが有効化されました。サインインページへ移動します。',
        )
        setTimeout(() => router.push('/signin'), 1200)
      } catch (e) {
        if (isAxiosError<ApiResponse>(e)) {
          const msg = e.response?.data?.message ?? 'エラーが発生しました。'
          setErrorMessage(msg)
          setShowResend(true)
        } else {
          setErrorMessage('予期せぬエラーが発生しました')
          setShowResend(true)
        }
      } finally {
        setIsLoading(false)
      }
    }

    confirmAccount()
  }, [router, router.isReady, confirmation_token])

  // 再送ボタン押下
  const resend = async () => {
    if (!resendEmail) return
    setIsResending(true)
    setResendFeedback('')
    try {
      const { data } = await api.post<ApiResponse>('/user/confirmations', {
        email: resendEmail,
      })
      setResendIsError(false)
      setResendFeedback(data.message || '確認メールを再送信しました。')
      if (data.next === 'signin') {
        setTimeout(() => router.push('/signin'), 1000)
      }
    } catch (e) {
      setResendIsError(true)
      if (isAxiosError<ApiResponse>(e)) {
        const msg =
          e.response?.data?.message ??
          '再送に失敗しました。メールアドレスをご確認ください。'
        setResendFeedback(msg)
      } else {
        setResendFeedback('予期せぬエラーが発生しました。')
      }
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      {isLoading && <Typography>有効化中…</Typography>}

      {!isLoading && successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {!isLoading && errorMessage && (
        <>
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>

          {showResend && (
            <Box sx={{ bgcolor: '#fff', p: 2, borderRadius: 1, boxShadow: 1 }}>
              {resendFeedback && (
                <Alert
                  severity={resendIsError ? 'error' : 'success'}
                  sx={{ mb: 2 }}
                >
                  {resendFeedback}
                </Alert>
              )}
              <Stack direction="row" spacing={1}>
                <TextField
                  label="登録メールアドレス"
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  fullWidth
                  size="small"
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={resend}
                  disabled={isResending || resendEmail.length === 0}
                >
                  {isResending ? '送信中…' : '再送'}
                </Button>
              </Stack>
            </Box>
          )}
        </>
      )}
    </Container>
  )
}
