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

import { ThanksCard } from '../../types/thanks-card'
import CardFormModal from '../components/CardFormModal'
import Layout from '../components/Layout'
import CardList from '@/components/CardList'
import { api, fetcher } from '@/utils/api'

// Hydration エラー回避
const CalendarMini = dynamic(() => import('../components/CalendarMini'), {
  ssr: false,
})

type DeckResponse = {
  cards: ThanksCard[]
  meta: { current_page: number; total_pages: number; total_count: number }
}

export default function MonthlyDeckPage() {
  /* 画面サイズで表示数を変える ------------------------------------ */
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const perPage = isMdUp ? 6 : 3

  /* ルーティングパラメータ ---------------------------------------- */
  const router = useRouter()
  const today = dayjs()
  const currentYear = Number(router.query.year ?? today.year())
  const currentMonth = Number(router.query.month ?? today.month() + 1)

  /* ページネーション --------------------------------------------- */
  const [page, setPage] = useState(1)
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }
  useEffect(() => setPage(1), [perPage]) // perPage が変わったら 1 ページへ

  /* デッキ取得(ページ分) --------------------------------------- */
  const {
    data: pageData,
    error,
    mutate: mutatePageData,
  } = useSWR<DeckResponse>(
    `/cards/deck/${currentYear}/${currentMonth}?page=${page}&per=${perPage}`,
    fetcher,
    {
      refreshInterval: (current) =>
        current?.cards.some((card) => !card.reply) ? 5000 : 0,
    },
  )

  const pagedCards: ThanksCard[] = pageData?.cards ?? []
  const meta = pageData?.meta

  /* カレンダー用：月内すべて ------------------------------------- */
  const { data: MonthlyData, mutate: mutateMonthlyData } = useSWR<{
    cards: ThanksCard[]
  }>(`/cards/deck/${currentYear}/${currentMonth}?page=1&per=100`, fetcher, {
    refreshInterval: (current) =>
      current?.cards.some((card) => !card.reply) ? 5000 : 0,
  })
  const MonthlyCards = MonthlyData?.cards ?? []

  /* カレンダー選択 ------------------------------------------------- */
  const markedDates = MonthlyCards.map((c) => c.logged_date)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const displayedCards = selectedDate
    ? MonthlyCards.filter((c) => c.logged_date === selectedDate)
    : pagedCards

  /* カード作成 ----------------------------------------------------- */
  const [modalOpen, setModalOpen] = useState(false)
  const handleCreate = async (card: {
    content: string
    logged_date: string
  }) => {
    await api.post('/cards', { card })
    mutatePageData()
    mutateMonthlyData()
    setModalOpen(false)
  }

  /* 月切替＆マイページ ------------------------------------------- */
  const handleChangeMonth = (y: number, m: number) => {
    router.push(`/cards?year=${y}&month=${m}`)
    setSelectedDate(null)
  }
  const goToMypage = () => router.push('/mypage')

  /* ローディング／エラー ----------------------------------------- */
  if (!pageData && !error) return <CircularProgress />
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

      {/* カレンダー */}
      <CalendarMini
        year={currentYear}
        month={currentMonth}
        markedDates={markedDates}
        selectedDate={selectedDate}
        onChangeMonth={handleChangeMonth}
        setSelectDate={setSelectedDate}
      />

      {/* ヘッダー */}
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
            onChange={handleChange}
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

      {/* 新規ボタン */}
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
