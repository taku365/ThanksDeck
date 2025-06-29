import GoogleIcon from '@mui/icons-material/Google'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Container,
  Typography,
  Stack,
  TextField,
  Alert,
  Divider,
  Button,
} from '@mui/material'
import { isAxiosError } from 'axios'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import Layout from './components/Layout'
import { useAuth } from '@/hooks/useAuth'

interface SignInFormData {
  email: string
  password: string
}

export default function SignInPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessages, setErrorMessages] = useState<string[]>([])

  // React-Hook-Form
  const { control, handleSubmit } = useForm<SignInFormData>({
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  })

  //送信処理
  const onSubmit: SubmitHandler<SignInFormData> = async (data) => {
    setIsLoading(true)
    setErrorMessages([])
    try {
      await signIn(data.email, data.password)
      router.push('/mypage')
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

  //バリデーションルール
  const validationRules = {
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
  }

  return (
    <Layout>
      <Box sx={{ minHeight: '100vh' }}>
        <Box
          sx={{
            mt: 10,
            maxWidth: 600,
            mx: 'auto',
            bgcolor: '#FFF9E8',
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
                おかえり
              </Typography>
            </Box>

            {errorMessages.length > 0 && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessages}
              </Alert>
            )}

            <Stack
              component="form"
              spacing={3}
              onSubmit={handleSubmit(onSubmit)}
            >
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
                    sx={{
                      borderRadius: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        backgroundColor: '#F6F6F6',
                      },
                    }}
                  />
                )}
              />

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
                    sx={{
                      borderRadius: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        backgroundColor: '#F6F6F6',
                      },
                    }}
                  />
                )}
              />

              {/* パスワードをお忘れですか？リンク */}
              <Typography
                variant="body2"
                sx={{
                  color: 'secondary.main',
                  textAlign: 'right',
                  cursor: 'pointer',
                }}
                onClick={() => router.push('/forgot-password')}
              >
                パスワードをお忘れですか？
              </Typography>

              <LoadingButton
                type="submit"
                variant="contained"
                loading={isLoading}
                loadingIndicator="ログイン中…"
                fullWidth
                disabled={isLoading}
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
                ログイン
              </LoadingButton>

              {/* ── or 区切り線 */}
              <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                <Divider sx={{ flexGrow: 1 }} />
                <Typography
                  variant="body2"
                  sx={{ mx: 2, color: 'text.secondary' }}
                >
                  または
                </Typography>
                <Divider sx={{ flexGrow: 1 }} />
              </Box>

              {/* Google ログイン */}
              <Button
                variant="outlined"
                fullWidth
                startIcon={<GoogleIcon />}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  borderColor: 'grey.400',
                  bgcolor: 'white',
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                }}
                onClick={() => {
                  router.push('/auth/google')
                }}
              >
                Googleでログイン
              </Button>

              {/* 新規登録誘導 */}
              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                アカウントをお持ちでない方は
                <Box
                  component="span"
                  sx={{ color: 'secondary.main', cursor: 'pointer', ml: 0.5 }}
                  onClick={() => router.push('/signup')}
                >
                  アカウントを作成
                </Box>
              </Typography>
            </Stack>
          </Container>
        </Box>
      </Box>
    </Layout>
  )
}
