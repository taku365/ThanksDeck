import AddIcon from '@mui/icons-material/Add'
import { Fab, CircularProgress } from '@mui/material'
import dayjs from 'dayjs'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useState } from 'react'
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
  const router = useRouter()
  const today = dayjs()
  const currentYear = Number(router.query.year ?? today.year())
  const currentMonth = Number(router.query.month ?? today.month() + 1)

  //該当月のカード一覧を取得
  const {
    data: cards = [],
    error,
    mutate,
  } = useSWR(`/cards/deck/${currentYear}/${currentMonth}`, fetcher)

  const markedDates = cards.map((c: Card) => c.logged_date) // ['2025-06-19', '2025-06-18']
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  //選択日付によるフィルタリング
  const filtered = selectedDate
    ? cards?.filter((c: Card) => c.logged_date === selectedDate)
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

  //ローディング & エラーハンドリング
  if (!cards && !error) return <CircularProgress />
  if (error) return <p>取得エラー</p>

  return (
    <Layout>
      <CalendarMini
        year={currentYear}
        month={currentMonth}
        markedDates={markedDates}
        selectedDate={selectedDate}
        onChangeMonth={handleChangeMonth}
        setSelectDate={setSelectedDate}
      />

      {/* 選択日がある場合は日付ヘッダー */}
      {selectedDate && (
        <h3 style={{ marginTop: 24 }}>
          {dayjs(selectedDate).format('YYYY年M月D日（ddd）')}
        </h3>
      )}

      {/* 選択日に紐づくカード一覧 or 該当月のカード一覧 */}
      <CardList cards={filtered ?? []} />

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
