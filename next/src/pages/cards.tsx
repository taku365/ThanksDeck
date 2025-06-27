import dayjs from 'dayjs'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import useSWR from 'swr'
import Layout from './components/Layout'
import { fetcher } from '@/utils/api'

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
  const [currentYear, setCurrentYear] = useState(
    Number(router.query.year ?? today.year()),
  )
  const [currentMonth, setCurrentMonth] = useState(
    Number(router.query.month ?? today.month() + 1),
  )

  const { data: MonthlyCards = [], error } = useSWR(
    `/cards/deck/${currentYear}/${currentMonth}`,
    fetcher,
  )

  // ['2025-06-19', '2025-06-18']
  const markedDates = MonthlyCards.map((c: Card) => c.logged_date)

  if (!MonthlyCards && !error) {
    return (
      <p>
        Loading cards for {currentYear}/{currentMonth}...
      </p>
    )
  }
  if (error) {
    return <p>Error loading cards.</p>
  }
  console.log(MonthlyCards)

  return (
    <Layout>
      <CalendarMini
        year={currentYear}
        month={currentMonth}
        markedDates={markedDates}
        onChangeMonth={(y, m) => {
          setCurrentYear(y)
          setCurrentMonth(m)
          // ここでAPI再フェッチ
        }}
        onSelectDate={(date) => console.log('選択日:', date)}
      />
    </Layout>
  )
}
