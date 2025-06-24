import { LoadingButton } from '@mui/lab'
import {
  Box,
  Container,
  Typography,
  Stack,
  TextField,
  Alert,
} from '@mui/material'
import { isAxiosError } from 'axios'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'
import { useCurrentUser } from '@/hooks/useCurrentUser'

interface SignInFormData {
  email: string
  password: string
}

export default function SignInPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const { currentUser } = useCurrentUser()

  // React-Hook-Form
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<SignInFormData>({
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessages, setErrorMessages] = useState<string[]>([])

  // すでにログイン済みならトップへ
  useEffect(() => {
    if (currentUser) router.replace('/')
  }, [currentUser, router])

  //送信処理
  const onSubmit: SubmitHandler<SignInFormData> = async (data) => {
    setIsLoading(true)
    setErrorMessages([])
    try {
      await signIn(data.email, data.password)
      router.push('/')
    } catch (e) {
      console.log(e)
      if (isAxiosError(e)) {
        const errs = e.response?.data?.errors
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

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Container maxWidth="sm">
        <Box sx={{ mb: 4, pt: 4 }}>
          <Typography variant="h4" fontWeight="bold" align="center">
            おかえり
          </Typography>
        </Box>

        {errorMessages.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessages.join('、')}
          </Alert>
        )}

        <Stack component="form" spacing={3} onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'メールアドレスを入力してください。',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: '正しい形式のメールアドレスを入力してください。',
              },
            }}
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

          <Controller
            name="password"
            control={control}
            rules={{
              required: 'パスワードを入力してください。',
              minLength: {
                value: 6,
                message: 'パスワードは6文字以上で入力してください。',
              },
            }}
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

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isLoading}
            fullWidth
            disabled={!isValid || isLoading}
          >
            ログイン
          </LoadingButton>
        </Stack>
      </Container>
    </Box>
  )
}
