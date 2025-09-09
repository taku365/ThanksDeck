import { Alert, Box, Button, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function HeroSection() {
  const router = useRouter()
  const { guestSignIn } = useAuth()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleClick = async () => {
    try {
      await guestSignIn()
      router.push({
        pathname: '/mypage',
        query: { notice: 'ゲストユーザーでログインしました' },
      })
    } catch {
      setErrorMessage('ゲストログインに失敗しました')
    }
  }

  return (
    <Box
      component="section"
      sx={{
        bgcolor: 'background.default',
        minHeight: '60vh',
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Stack
        spacing={3}
        sx={{ width: '100%', maxWidth: 600, textAlign: 'center' }}
      >
        {/* 見出しとサブテキスト */}
        <Typography variant="h2" component="h1" sx={{ fontWeight: 700 }}>
          もう
          <Box component="span" sx={{ color: 'secondary.main' }}>
            感謝
          </Box>
          を忘れない
        </Typography>
        <Typography variant="subtitle1">
          ThanksCardを集めて、毎日をちょっと好きに
          <br />
          心を整える、感謝の記録
        </Typography>

        {/* アクションボタン */}
        <Stack spacing={2} alignItems="center">
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{
              width: { xs: '100%', sm: 400 },
              borderRadius: 3,
              borderWidth: '2px', // 枠の太さ
              borderStyle: 'solid', // 枠線のスタイル
              borderColor: 'primary.main',
              py: 2,
              fontSize: '1.3rem',
              textTransform: 'none',
              fontWeight: 700,
            }}
            onClick={() => router.push('/signup')}
          >
            ThanksCardを作成する
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="medium"
            sx={{
              width: { xs: '60%', sm: 200 },
              borderRadius: 3,
              py: 1.5,
            }}
            onClick={handleClick}
          >
            ゲストで体験する
          </Button>
        </Stack>
      </Stack>

      {/* ゲストログインエラーメッセージ */}
      {errorMessage && (
        <Alert
          severity="error"
          sx={{ mt: 4 }}
          onClose={() => setErrorMessage(null)}
        >
          {errorMessage}
        </Alert>
      )}
    </Box>
  )
}
