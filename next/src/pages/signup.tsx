import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Box,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { isAxiosError } from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import Layout from '../components/Layout'
import { useAuth } from '@/hooks/useAuth'
import { useCurrentUser } from '@/hooks/useCurrentUser'

interface SignUpFormData {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

export default function SignUpPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const { currentUser } = useCurrentUser()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const confirmSuccessUrl = process.env.NEXT_PUBLIC_FRONT_BASE_URL + '/sign_in'

  // React-Hook-Form
  const { control, handleSubmit } = useForm<SignUpFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
    mode: 'onChange',
  })

  // すでにログイン済みならトップへ
  useEffect(() => {
    if (currentUser) router.replace('/mypage')
  }, [currentUser, router])

  //送信処理
  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    console.log(data)
    setIsLoading(true)
    setErrorMessages([])
    try {
      await signUp(
        data.name,
        data.email,
        data.password,
        data.passwordConfirmation,
        confirmSuccessUrl,
      )
      // サインアップ成功後は Pending ページへリダイレクト
      router.push(
        `/confirmation-pending?email=${encodeURIComponent(data.email)}`,
      )
    } catch (e) {
      if (isAxiosError(e)) {
        const errs = e.response?.data?.errors.full_messages
        setErrorMessages(errs)
      } else {
        setErrorMessages(['登録に失敗しました'])
      }
    } finally {
      setIsLoading(false)
    }
  }

  //バリデーションルール
  const validationRules = {
    name: { required: '名前を入力してください。' },
    email: {
      required: 'メールアドレスを入力してください。',
      pattern: {
        value:
          /^[a-zA-Z0-9_+-]+(\.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
        message: '正しい形式のメールアドレスを入力してください。',
      },
    },
    password: {
      required: 'パスワードを入力してください。',
      minLength: {
        value: 6,
        message: 'パスワードは6文字以上で入力してください。',
      },
    },
    passwordConfirmation: {
      required: '確認用パスワードを入力してください。',
      validate: (val: string, formValues: SignUpFormData) =>
        val === formValues.password || 'パスワードが一致しません。',
    },
  }

  //入力デザイン
  const fieldSx = {
    borderRadius: 3,
    '& .MuiOutlinedInput-root': {
      borderRadius: 3,
      backgroundColor: '#F6F6F6',
    },
  }

  return (
    <Layout>
      <Box sx={{ minHeight: '100vh-64px' }}>
        <Box
          sx={{
            maxWidth: 600,
            mx: 'auto',
            mt: 7,
            bgcolor: '#FFF9EB',
            px: 2,
            py: 5,
            borderRadius: 3,
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: 'primary.main',
          }}
        >
          <Container maxWidth="sm">
            <Box sx={{ mb: 4, pt: 4 }}>
              <Typography variant="h4" fontWeight="bold" align="center">
                ThanksCardを作成する
              </Typography>
            </Box>

            {/* エラーメッセージ */}
            {errorMessages.length > 0 && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessages}
              </Alert>
            )}

            <Stack
              component="form"
              spacing={4}
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* 名前 */}
              <Controller
                name="name"
                control={control}
                rules={validationRules.name}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="名前"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                    sx={fieldSx}
                  />
                )}
              />
              {/* メールアドレス */}
              <Controller
                name="email"
                control={control}
                rules={validationRules.email}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="メールアドレス"
                    type="email"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                    sx={fieldSx}
                  />
                )}
              />
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
                    fullWidth
                    sx={fieldSx}
                  />
                )}
              />
              {/* 確認用パスワード */}
              <Controller
                name="passwordConfirmation"
                control={control}
                rules={validationRules.passwordConfirmation}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="パスワード(確認用)"
                    type="password"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                    sx={fieldSx}
                  />
                )}
              />
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isLoading}
                disabled={isLoading}
                fullWidth
                size="large"
                color="secondary"
                sx={{
                  fontWeight: 700,
                  borderRadius: 3,
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: 'primary.main',
                }}
              >
                新規登録
              </LoadingButton>
            </Stack>
          </Container>
        </Box>
      </Box>
    </Layout>
  )
}
