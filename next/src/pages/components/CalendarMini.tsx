import { CalendarPicker, PickersDay } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import { useState } from 'react'

interface CalendarMiniProps {
  year: number
  month: number
  markedDates: string[] // 'YYYY-MM-DD'
  onChangeMonth: (y: number, m: number) => void
  onSelectDate: (date: string) => void
}

export default function CalendarMini({
  year,
  month,
  markedDates,
  onChangeMonth,
  onSelectDate,
}: CalendarMiniProps) {
  // 表示させたい月の 1 日を Dayjs で生成
  const displayMonth = dayjs()
    .year(year)
    .month(month - 1)
    .date(1)

  // ユーザーがクリックした日付を state で保持（選択日）
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)

  // 月送りハンドラ
  const handleMonthChange = (newDate: Dayjs) => {
    onChangeMonth(newDate.year(), newDate.month() + 1)
  }

  // 日付選択ハンドラ
  const handleSelect = (newDate: Dayjs | null) => {
    if (newDate) {
      setSelectedDate(newDate)
      onSelectDate(newDate.format('YYYY-MM-DD'))
    }
  }

  return (
    <CalendarPicker<Dayjs>
      // 選択日を制御
      date={selectedDate}
      // 表示する月だけを指定
      defaultCalendarMonth={displayMonth}
      onMonthChange={handleMonthChange}
      onChange={handleSelect}
      views={['day']}
      renderDay={(day, _value, DayComponentProps) => {
        const formatted = day.format('YYYY-MM-DD')
        const isMarked = markedDates.includes(formatted)

        // key と restProps に分離
        const { key, ...restProps } = DayComponentProps

        return (
          <PickersDay
            key={key}
            {...restProps}
            sx={{
              ...(isMarked && {
                backgroundColor: '#FFC107',
                color: '#fff',
                '&:hover, &:focus': {
                  backgroundColor: '#FFB300',
                },
              }),
            }}
          />
        )
      }}
    />
  )
}
