import dayjs from 'dayjs'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const CalendarMini = dynamic(() => import('./components/CalendarMini'), {
  ssr: false,
})

export default function MonthlyEntriesPage() {
  const [year, setYear] = useState(dayjs().year())
  const [month, setMonth] = useState(dayjs().month() + 1)

  const markedDates = ['2025-06-19', '2025-06-18']

  return (
    <CalendarMini
      year={year}
      month={month}
      markedDates={markedDates}
      onChangeMonth={(y, m) => {
        setYear(y)
        setMonth(m)
        // ここでAPI再フェッチ
      }}
      onSelectDate={(date) => console.log('選択日:', date)}
    />
  )
}
