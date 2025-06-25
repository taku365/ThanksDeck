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
  const [infoMessage, setInfoMessage] = useState<string>('')
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const confirmSuccessUrl = process.env.NEXT_PUBLIC_FRONT_BASE_URL + '/sign_in'

  // React-Hook-Form
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<SignUpFormData>({
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
    if (currentUser) router.replace('/')
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
      setInfoMessage('認証メールを送信しました。')
      router.push('/signin')
    } catch (e) {
      if (isAxiosError(e)) {
        console.log(e)
        const errs = e.response?.data?.errors.full_messages
        if (Array.isArray(errs)) {
          setErrorMessages(errs)
        } else {
          setErrorMessages(['メールアドレスまたはパスワードが違います'])
        }
      } else {
        setErrorMessages(['ログインに失敗しました'])
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

  return (
    <Container maxWidth="xs">
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

      {/* メール送信メッセージ */}
      {infoMessage && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {infoMessage}
        </Alert>
      )}

      <Stack component="form" spacing={3} onSubmit={handleSubmit(onSubmit)}>
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
            />
          )}
        />

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isLoading}
          disabled={!isValid || isLoading}
          fullWidth
        >
          新規登録
        </LoadingButton>
      </Stack>
    </Container>
  )
}
