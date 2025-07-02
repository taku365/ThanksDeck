import {
  Container,
  Box,
  TextField,
  Button,
  Alert,
  Typography,
  Link,
  Stack,
} from '@mui/material'
import { isAxiosError } from 'axios'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'

import Layout from './components/Layout'
import { api } from '@/utils/api'

interface ForgotPwFormData {
  email: string
}

// バリデーションルール
const validationRules = {
  email: {
    required: 'メールアドレスを入力してください。',
    pattern: {
      value:
        /^[a-zA-Z0-9_+-]+(\.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
      message: '正しい形式のメールアドレスを入力してください。',
    },
  },
}

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [isSending, setIsSending] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState<string>('')
  const [feedbackSeverity, setFeedbackSeverity] = useState<'success' | 'error'>(
    'success',
  )

  const { control, handleSubmit } = useForm<ForgotPwFormData>({
    defaultValues: { email: '' },
    mode: 'onChange',
  })

  const onSubmit: SubmitHandler<ForgotPwFormData> = async ({ email }) => {
    const resetSuccessUrl =
      process.env.NEXT_PUBLIC_FRONT_BASE_URL + '/password-reset'

    setIsSending(true)
    setFeedbackMessage('')

    try {
      await api.post('/auth/password', {
        email,
        redirect_url: resetSuccessUrl,
      })
      setFeedbackSeverity('success')
      setFeedbackMessage(
        'パスワード再設定用メールを送信しました。メールボックスをご確認ください。',
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
      setIsSending(false)
    }
  }

  return (
    <Layout>
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        {feedbackMessage && (
          <Alert severity={feedbackSeverity} sx={{ mb: 2 }}>
            {feedbackMessage}
          </Alert>
        )}

        <Box
          sx={{
            bgcolor: '#fff',
            boxShadow: 1,
            borderRadius: 2,
            p: 4,
          }}
        >
          <Stack component="form" spacing={4} onSubmit={handleSubmit(onSubmit)}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, textAlign: 'center' }}
            >
              パスワード再設定用のメールを送信します
            </Typography>
            {/* Email フィールド */}
            <Controller
              name="email"
              control={control}
              rules={validationRules.email}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="email"
                  label="メールアドレス"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={isSending}
                />
              )}
            />

            {/* 送信ボタン */}
            <Button
              type="submit"
              variant="contained"
              disabled={isSending}
              color="secondary"
            >
              {isSending ? '送信中…' : 'メールを送信'}
            </Button>
          </Stack>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => router.push('/signin')}
            >
              ログイン画面に戻る
            </Link>
          </Box>
        </Box>
      </Container>
    </Layout>
  )
}
