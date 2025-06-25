import { Container, Alert, Button, Box } from '@mui/material'
import { AxiosError, isAxiosError } from 'axios'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { api } from '@/utils/api'

export default function ConfirmationPendingPage() {
  const [isResending, setIsResending] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState<string>('')
  const [feedbackSeverity, setFeedbackSeverity] = useState<'success' | 'error'>(
    'success',
  )
  const router = useRouter()
  const { email } = router.query as { email?: string }
  const confirmSuccessUrl = process.env.NEXT_PUBLIC_FRONT_BASE_URL + '/sign_in'

  //再送信
  const resend = async () => {
    if (!email) return

    setIsResending(true)

    try {
      await api.post('/user/confirmations', {
        email,
        confirm_success_url: confirmSuccessUrl,
      })
      setFeedbackSeverity('success')
      setFeedbackMessage(
        '確認メールを再送信しました。メールを確認してください。',
      )
    } catch (e) {
      if (isAxiosError(e)) {
        const axiosError = e as AxiosError<{ message: string }>
        setFeedbackSeverity('error')
        setFeedbackMessage(
          axiosError.response?.data?.message ||
            '確認メールの再送信に失敗しました。再度お試しください',
        )
      } else {
        setFeedbackSeverity('error')
        setFeedbackMessage('予期せぬエラーが発生しました')
      }
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      {/* 警告メッセージ */}
      <Alert severity="warning" sx={{ mb: 2 }}>
        認証メールを送信しました。メールが届かない場合は下のボタンで再送信できます。
      </Alert>

      {/* 再送信ボタン */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Button variant="outlined" onClick={resend} disabled={isResending}>
          {isResending ? '再送信中…' : '確認メールを再送信'}
        </Button>
      </Box>

      {/* フィードバックメッセージ */}
      {feedbackMessage && (
        <Alert severity={feedbackSeverity} sx={{ mb: 2 }}>
          {feedbackMessage}
        </Alert>
      )}
    </Container>
  )
}
