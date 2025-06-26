import AddIcon from '@mui/icons-material/Add'
import { CircularProgress, Fab, Typography } from '@mui/material'
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
  const { data: todaysCards, mutate } = useSWR('/cards/today', fetcher)

  //今日の残り投稿数
  const remaining = 3 - (todaysCards?.length ?? 0)

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

  return (
    <Layout>
      <Typography fontWeight="fontWeightBold" variant="h6">
        {remaining > 0 ? `あと ${remaining}件` : '今日の投稿は上限に達しました'}
      </Typography>

      <CardList todaysCards={todaysCards} />

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
