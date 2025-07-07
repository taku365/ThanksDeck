import { Container, Alert, Button, Box, Typography } from '@mui/material'
import { isAxiosError } from 'axios'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Layout from './components/Layout'
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
      setFeedbackSeverity('error')
      if (isAxiosError(e)) {
        const errs = e.response?.data?.errors
        setFeedbackMessage(errs)
      } else {
        setFeedbackMessage('予期せぬエラーが発生しました')
      }
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Layout>
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        {/* 警告メッセージはそのまま外に */}
        <Alert severity="warning" sx={{ mb: 3 }}>
          1時間以内に認証を完了させなかった場合、メールリンクは無効になります。
        </Alert>

        {/* フィードバックメッセージ */}
        {feedbackMessage && (
          <Alert severity={feedbackSeverity} sx={{ mb: 3 }}>
            {feedbackMessage}
          </Alert>
        )}

        <Box
          sx={{
            bgcolor: '#FFFFFF',
            boxShadow: 1,
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
          }}
        >
          {/* 見出し */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
            認証用メールを送信しました
          </Typography>

          {/* 説明文 */}
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            届いたメールに記載されたURLをクリックして登録を完了させてください。
            <br />
            メールが受信できない場合は迷惑メールに振り分けられていないかご確認ください。
          </Typography>

          {/* 再送信ボタン */}
          <Button
            variant="contained"
            onClick={resend}
            disabled={isResending}
            color="secondary"
            size="large"
          >
            {isResending ? '再送信中…' : 'メールを再送信する'}
          </Button>
        </Box>
      </Container>
    </Layout>
  )
}
