import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import DeleteIcon from '@mui/icons-material/Delete'
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

  // 認証ガード
  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.replace('/signin')
    }
  }, [isLoading, currentUser, router])

  // ローディング／エラー時
  if (isLoading || (!card && !error))
    return (
      <Layout>
        <CircularProgress />
      </Layout>
    )
  if (!currentUser) return null
  if (error)
    return (
      <Layout>
        <Typography color="error" align="center" sx={{ mt: 4 }}>
          カードの取得に失敗しました
        </Typography>
      </Layout>
    )

  // 戻る処理
  const handleBack = () => router.back()

  // 削除処理
  const handleDelete = async () => {
    await api.delete(`/cards/${card.id}`)
    router.back()
  }

  // Xシェア用URL
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    card.content,
  )}&hashtags=ThanksDeck`

  return (
    <Layout>
      {/* 戻るボタン */}
      <Box sx={{ p: 2 }}>
        <Button
          startIcon={<ArrowBackIosIcon />}
          size="small"
          onClick={handleBack}
        >
          戻る
        </Button>
      </Box>

      {/* カード本体 */}
      <Container maxWidth="sm" sx={{ p: 2 }}>
        <Box
          sx={{
            position: 'relative',
            bgcolor: '#e6f8fb',
            borderRadius: 3,
            p: 2,
            pb: 8,
            boxShadow: 3,
          }}
        >
          {/* 日付・Xアイコン */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {dayjs(card.logged_date).format('YYYY年M月D日')}
            </Typography>
            <Tooltip title="Xにシェア">
              <IconButton
                size="small"
                component="a"
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <XIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* 感謝内容エリア */}
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: '#fff',
              borderRadius: 2,
              minHeight: '140px',
            }}
          >
            <Typography
              variant="body1"
              sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
            >
              {card.content}
            </Typography>
          </Box>

          {/* チャッピー返信エリア */}
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: '#FFFDE7',
              borderRadius: 2,
              minHeight: '140px',
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              🤖 チャッピー の返信
            </Typography>
            <Typography
              variant="body2"
              sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
            >
              {card.reply ?? '返信準備中…'}
            </Typography>
          </Box>

          {/* 削除アイコン */}
          <IconButton
            size="small"
            onClick={() => setIsDeleteDialogOpen(true)}
            sx={{ position: 'absolute', bottom: 16, left: 16 }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>

          {/* 編集ボタン */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              right: 12,
            }}
          >
            <Button
              variant="contained"
              size="small"
              onClick={() => setIsEditOpen(true)}
            >
              編集
            </Button>
          </Box>
        </Box>
      </Container>

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

      {/* 削除確認ダイアログ */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle sx={{ fontWeight: 700, p: 3 }}>
          ThanksCardを削除します
        </DialogTitle>
        <DialogContent>本当に削除してよいですか？</DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>いいえ</Button>
          <Button color="error" onClick={handleDelete}>
            はい、削除
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  )
}
