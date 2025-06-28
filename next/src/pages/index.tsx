import AddIcon from '@mui/icons-material/Add'
import { Box, Button, CircularProgress, Fab, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import CardFormModal from './components/CardFormModal'
import CardList from './components/CardList'
import Layout from './components/Layout'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { api, fetcher } from '@/utils/api'

export default function Dashboard() {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const { currentUser, isLoading } = useCurrentUser()

  //今日のカード一覧を取得
  const { data: cards, mutate, error } = useSWR('/cards/today', fetcher)

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

  // ロード中
  if (!cards && !error) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Layout>
    )
  }

  // エラー表示
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
      {/* 残り作成数の表示 */}
      <Typography fontWeight="fontWeightBold" variant="h6">
        {remaining > 0
          ? `【今日の残り作成数】あと ${remaining}件`
          : '今日の投稿は上限に達しました'}
      </Typography>

      {/* ThanksCard作成ボタン */}
      <Button
        variant="outlined"
        sx={{
          mt: 5,
          width: 300,
          mx: 'auto',
          display: 'block',
          textTransform: 'none',
        }}
        onClick={() => setModalOpen(true)}
      >
        ThanksCardを作成する
      </Button>

      {/* 今日のカード一覧 */}
      <CardList cards={cards} />

      <Typography variant="h6" mt={4} mb={2}>
        最近のThanksCard
      </Typography>

      {/* ThanksDeck移動ボタン */}
      <Button
        variant="outlined"
        sx={{
          mt: 5,
          width: 300,
          mx: 'auto',
          display: 'block',
          textTransform: 'none',
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
    </Layout>
  )
}
