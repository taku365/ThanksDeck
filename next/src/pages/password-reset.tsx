import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
} from '@mui/material'
import { isAxiosError } from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Controller, useForm, SubmitHandler } from 'react-hook-form'

import Layout from '../components/Layout'
import { api } from '@/utils/api'
import { setAuthTokens } from '@/utils/tokenStorage'

interface ResetPwFormData {
  password: string
  passwordConfirmation: string
}

const validationRules = {
  password: {
    required: 'パスワードを入力してください。',
    minLength: {
      value: 6,
      message: 'パスワードは6文字以上で入力してください。',
    },
  },
  passwordConfirmation: {
    required: '確認用パスワードを入力してください。',
    validate: (val: string, formValues: ResetPwFormData) =>
      val === formValues.password || 'パスワードが一致しません。',
  },
}

export default function PasswordResetPage() {
  const router = useRouter()

  // クエリから reset token と認証ヘッダー情報を取得
  const {
    token: reset_password_token,
    'access-token': accessToken,
    client,
    uid,
  } = router.query as Record<string, string>

  const [tokenError, setTokenError] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackSeverity, setFeedbackSeverity] = useState<'success' | 'error'>(
    'error',
  )

  const { control, handleSubmit } = useForm<ResetPwFormData>({
    defaultValues: { password: '', passwordConfirmation: '' },
    mode: 'onChange',
  })

  // 一時認証トークンの保存＆リンク有効判定
  useEffect(() => {
    if (!router.isReady) return
    // Rails がリダイレクト時に渡す認証ヘッダーを保存
    if (accessToken && client && uid) {
      setAuthTokens({ 'access-token': accessToken, client, uid })
    }
    setTokenError(!reset_password_token)
  }, [router.isReady, accessToken, client, uid, reset_password_token])

  // Password変更送信処理
  const onSubmit: SubmitHandler<ResetPwFormData> = async ({
    password,
    passwordConfirmation,
  }) => {
    if (!reset_password_token) return

    setIsSending(true)
    setFeedbackMessage('')

    try {
      const response = await api.put('/auth/password', {
        password,
        password_confirmation: passwordConfirmation,
      })

      setAuthTokens({
        'access-token': response.headers['access-token'] as string,
        client: response.headers.client as string,
        uid: response.headers.uid as string,
      })

      setFeedbackSeverity('success')
      setFeedbackMessage('パスワードを変更しました。')
      router.replace('/mypage') //再送信防止
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

  // ——————— トークン無い場合のエラー画面 ———————
  if (tokenError) {
    return (
      <Layout>
        <Container maxWidth="sm" sx={{ mt: 8 }}>
          <Alert severity="error">
            このパスワード再設定用のリンクは無効、または有効期限が切れています。
          </Alert>
        </Container>
      </Layout>
    )
  }

  // ——————— 正常フォーム表示 ———————
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
              新しいパスワードを入力してください
            </Typography>
            {/* パスワード */}
            <Controller
              name="password"
              control={control}
              rules={validationRules.password}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="パスワード"
                  type="password"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={isSending}
                />
              )}
            />

            {/* パスワード確認 */}
            <Controller
              name="passwordConfirmation"
              control={control}
              rules={validationRules.passwordConfirmation}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="パスワード（確認用）"
                  type="password"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={isSending}
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={isSending}
              color="secondary"
            >
              {isSending ? '送信中…' : 'パスワードを変更'}
            </Button>
          </Stack>
        </Box>
      </Container>
    </Layout>
  )
}
