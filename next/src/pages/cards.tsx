import AddIcon from '@mui/icons-material/Add'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import {
  Fab,
  CircularProgress,
  Typography,
  Box,
  Button,
  Pagination,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import dayjs from 'dayjs'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import CardFormModal from './components/CardFormModal'
import CardList from './components/CardList'
import Layout from './components/Layout'
import { api, fetcher } from '@/utils/api'

// Hydration エラー回避
const CalendarMini = dynamic(() => import('./components/CalendarMini'), {
  ssr: false,
})

export interface Card {
  id: number
  content: string
  logged_date: string
}

export default function MonthlyDeckPage() {
  //画面サイズ判定
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const perPage = isMdUp ? 6 : 3

  const router = useRouter()
  const today = dayjs()
  const currentYear = Number(router.query.year ?? today.year())
  const currentMonth = Number(router.query.month ?? today.month() + 1)

  const [page, setPage] = useState(1)
  useEffect(() => {
    setPage(1)
  }, [perPage])

  //データ取得：ページ切り替え
  const { data, error, mutate } = useSWR<{
    cards: Card[]
    meta: { current_page: number; total_pages: number; total_count: number }
  }>(
    `/cards/deck/${currentYear}/${currentMonth}?page=${page}&per=${perPage}`,
    fetcher,
  )

  const cards = data?.cards ?? []
  const meta = data?.meta

  // データ取得: カレンダー用に全件取得
  const { data: allCardsData } = useSWR<{
    cards: Card[]
  }>(`/cards/deck/${currentYear}/${currentMonth}?page=1&per=100`, fetcher)

  const allCards = allCardsData?.cards ?? []

  // ['2025-06-19', '2025-06-18']
  const markedDates = allCardsData
    ? allCardsData.cards.map((c) => c.logged_date)
    : []

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  //選択日に紐づくカード一覧 or 現ページのカード一覧
  const displayedCards = selectedDate
    ? allCards.filter((c) => c.logged_date === selectedDate)
    : cards

  //カレンダー月の切り替え
  const handleChangeMonth = (y: number, m: number) => {
    router.push(`/cards?year=${y}&month=${m}`)
    setSelectedDate(null)
  }

  //カード作成
  const handleCreate = async (cardData: {
    content: string
    logged_date: string
  }) => {
    await api.post('/cards', { card: cardData })
    await mutate()
    setModalOpen(false)
  }

  //mypageに戻る
  const goToMypage = () => {
    router.push('/mypage')
  }

  //ローディング & エラーハンドリング
  if (!cards && !error) return <CircularProgress />
  if (error) return <p>取得エラー</p>

  return (
    <Layout>
      {/* 戻るボタン */}
      <Box sx={{ p: 2 }}>
        <Button
          startIcon={<ArrowBackIosIcon />}
          size="small"
          onClick={goToMypage}
        >
          戻る
        </Button>
      </Box>

      <CalendarMini
        year={currentYear}
        month={currentMonth}
        markedDates={markedDates}
        selectedDate={selectedDate}
        onChangeMonth={handleChangeMonth}
        setSelectDate={setSelectedDate}
      />

      {/* 選択日がある場合は日付ヘッダー */}
      <Typography sx={{ mt: 3, mb: 2, textAlign: 'center', fontWeight: 700 }}>
        {selectedDate
          ? dayjs(selectedDate).format('YYYY年M月D日')
          : `${currentMonth}月のThanksDeck`}
      </Typography>

      {/* カードリスト */}
      <CardList cards={displayedCards} />

      {/* ページネーション */}
      {!selectedDate && meta && meta.total_pages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={meta.total_pages}
            page={page}
            onChange={(_e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {/* カード作成モーダル */}
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
