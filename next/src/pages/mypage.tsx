import AddIcon from '@mui/icons-material/Add'
import {
  Box,
  Button,
  CircularProgress,
  Fab,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { ThanksCard } from '../../types/thanks-card'
import CardFormModal from './components/CardFormModal'
import CardList from './components/CardList'
import Layout from './components/Layout'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { api, fetcher } from '@/utils/api'

export default function Mypage() {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const { currentUser, isLoading } = useCurrentUser()

  //ゲストログイン通知
  const { notice } = router.query
  const [message, setMessage] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (typeof notice === 'string') {
      setMessage(notice)
      setOpen(true)
      router.replace('/mypage', undefined, { shallow: true }) // クエリを URL から消す
    }
  }, [notice, router])

  //今日のカード一覧を取得
  const {
    data: cards, // cards は ThanksCard[] | undefined
    error,
    mutate,
  } = useSWR<ThanksCard[]>('/cards/today', fetcher, {
    refreshInterval: (current) =>
      current?.some((card) => !card.reply) ? 5000 : 0,
  })

  // cards が undefined のときは空配列にフォールバック
  const todayCards = cards ?? []

  //今日の残り投稿数
  const remaining = 3 - (cards?.length ?? 0)

  //認証ガード
  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.replace('/signin')
    }
  }, [isLoading, currentUser, router])

  if (isLoading) return <CircularProgress />
  if (!currentUser) return null

  //カード作成処理
  const handleCreate = async (cardData: {
    content: string
    logged_date: string
  }) => {
    // Rails側でparams.require(:card) を想定しているため
    await api.post('/cards', { card: cardData })
    // 再取得して最新状態に更新
    await mutate()
    setModalOpen(false)
  }

  // ロード中 or エラー時
  if (!cards && !error) {
    return (
      <Layout>
        <CircularProgress />
      </Layout>
    )
  }
  if (error) {
    return (
      <Layout>
        <Typography color="error" align="center" sx={{ mt: 4 }}>
          カードの取得に失敗しました。再読み込みしてください。
        </Typography>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* ゲストユーザーログイン通知 */}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success">{message}</Alert>
      </Snackbar>

      {/* ----------本体---------- */}
      <Box sx={{ pb: { xs: 10, sm: 0 } }}>
        {/* 残り作成数の表示 */}
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, mt: 2, mb: 1, textAlign: 'center' }}
        >
          {remaining > 0
            ? `【今日の残り作成数】あと ${remaining}件`
            : '今日の投稿は上限に達しました'}
        </Typography>

        {/* ThanksCard作成ボタン */}
        <Button
          variant="contained"
          color="secondary"
          sx={{
            mt: 2,
            width: '100%',
            maxWidth: 400,
            mx: 'auto',
            display: 'block',
            textTransform: 'none',
            textAlign: 'center',
            borderRadius: 3,
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: 'primary.main',
            py: 2,
            fontSize: '1.2rem',
            fontWeight: 600,
          }}
          onClick={() => setModalOpen(true)}
        >
          ThanksCardを作成する
        </Button>

        {/* 今日のカード一覧 */}
        <CardList cards={todayCards} />

        {/* 見出し */}
        <Typography
          variant="subtitle1"
          fontWeight="fontWeightMedium"
          sx={{ fontWeight: 600, mt: 4, mb: 2, textAlign: 'center' }}
        >
          貯まったThanksCardを確認！
        </Typography>

        {/* ThanksDeck移動ボタン */}
        <Button
          variant="outlined"
          sx={{
            mt: 1,
            width: '100%',
            maxWidth: 400,
            mx: 'auto',
            display: 'block',
            textTransform: 'none',
            textAlign: 'center',
            borderRadius: 3,
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: 'primary.main',
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 500,
          }}
          onClick={() => router.push('/cards')}
        >
          ThanksDeckを確認する
        </Button>

        {/* モーダルを閉じたときに内容を残さない */}
        {modalOpen && (
          <CardFormModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onCreate={handleCreate}
          />
        )}

        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          onClick={() => setModalOpen(true)}
        >
          <AddIcon />
        </Fab>
      </Box>
    </Layout>
  )
}
