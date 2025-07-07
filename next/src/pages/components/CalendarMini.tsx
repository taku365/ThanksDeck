import { CalendarPicker, PickersDay } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'

interface CalendarMiniProps {
  year: number
  month: number
  markedDates: string[] // 'YYYY-MM-DD' の配列
  selectedDate: string | null //現在選択中の日付 or null
  onChangeMonth: (y: number, m: number) => void
  setSelectDate: (date: string | null) => void
}

export default function CalendarMini({
  year,
  month,
  markedDates,
  selectedDate,
  onChangeMonth,
  setSelectDate,
}: CalendarMiniProps) {
  // デフォルトは今月
  const displayMonth = dayjs()
    .year(year)
    .month(month - 1)
    .date(1)

  return (
    <CalendarPicker<Dayjs>
      date={selectedDate ? dayjs(selectedDate) : null}
      defaultCalendarMonth={displayMonth}
      onMonthChange={(newDate) =>
        onChangeMonth(newDate.year(), newDate.month() + 1)
      }
      onChange={(newDate) => {
        if (!newDate) return
        const DateString = newDate.format('YYYY-MM-DD')
        if (DateString === selectedDate) {
          setSelectDate(null)
        } else {
          setSelectDate(DateString)
        }
      }}
      views={['day']}
      renderDay={(day, _value, DayComponentProps) => {
        const formatted = day.format('YYYY-MM-DD')
        const isMarked = markedDates.includes(formatted)

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
