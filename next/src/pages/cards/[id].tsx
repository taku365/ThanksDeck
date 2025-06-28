import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import XIcon from '@mui/icons-material/X'
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'

import CardFormModal from '../components/CardFormModal'
import Layout from '../components/Layout'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { api, fetcher } from '@/utils/api'

export default function CardDetailPage() {
  const router = useRouter()
  const { id } = router.query

  // カードデータ取得
  const {
    data: card,
    error,
    mutate,
  } = useSWR(id ? `/cards/${id}` : null, fetcher)

  const { currentUser, isLoading } = useCurrentUser()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  //  認証ガード
  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.replace('/signin')
    }
  }, [isLoading, currentUser, router])

  if (isLoading) return <CircularProgress />
  if (!currentUser) return null

  // ローディング & エラー(カード取得)
  if (!card && !error) {
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
          カードの取得に失敗しました
        </Typography>
      </Layout>
    )
  }

  // 前の画面に戻る
  const pageBack = () => {
    router.back()
  }

  //削除処理
  const handleDelete = async () => {
    await api.delete(`/cards/${card.id}`)
    router.back()
  }

  //Xシェア
  const XText = encodeURIComponent(card.content)
  const shareUrl = `https://twitter.com/intent/tweet?text=${XText}&hashtags=ThanksDeck`;

  return (
    <Layout>
      <Box sx={{ mb: 2 }}>
        <Button startIcon={<ArrowBackIosIcon />} onClick={pageBack}>
          戻る
        </Button>
      </Box>

      <Container sx={{ p: 2 }} maxWidth="md">
        {/* 日付 と Xアイコン */}
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            alineItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* 記録日 */}
          <Typography variant="caption" color="text.secondary" gutterBottom>
            {dayjs(card.logged_date).format('YYYY年M月D日')}
          </Typography>

          {/* X シェア */}
          <Tooltip title="Xに投稿する">
            <IconButton
              component="a"
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="カードをXでシェア"
            >
              <XIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* カード内容 */}
        <Typography
          variant="body1"
          sx={{ whiteSpace: 'pre-wrap', mt: 2, mb: 3 }}
        >
          {card.content}
        </Typography>

        {/* 編集・削除ボタン */}
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => setIsEditOpen(true)}
          >
            編集
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            削除
          </Button>
        </Box>

        {/* 編集モーダル */}
        {isEditOpen && (
          <CardFormModal
            open={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            initialData={{
              id: card.id,
              content: card.content,
              logged_date: card.logged_date,
            }}
            onCreate={async (updated) => {
              await api.patch(`/cards/${card.id}`, { card: updated })
              await mutate()
              setIsEditOpen(false)
            }}
          />
        )}
      </Container>

      {/* 削除確認ダイヤログ */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>ThanksCardが破棄されます</DialogTitle>
        <DialogContent>本当に削除しますか？</DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>いいえ</Button>
          <Button color="error" onClick={handleDelete}>
            はい、削除します
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  )
}
