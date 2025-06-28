import { Box, Button, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'

export default function HeroSection() {
  const router = useRouter()

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
          もう感謝を忘れない
        </Typography>
        <Typography variant="subtitle1">
          ThanksCardを集めて、毎日をちょっと好きに
        </Typography>
        <Typography variant="subtitle1">心を整える、感謝の記録</Typography>

        {/* アクションボタン */}
        <Stack spacing={2} alignItems="center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              width: { xs: '100%', sm: 400 },
              borderRadius: 3,
              py: 2,
              fontSize: '1.3rem',
              textTransform: 'none',
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
          >
            ゲストで体験する
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
