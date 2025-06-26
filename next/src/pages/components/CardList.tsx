import { Grid, Typography } from '@mui/material'
import CardItem from './CardItem'

interface CardListProps {
  todaysCards: Array<{
    id: number
    content: string
    logged_date: string
  }>
}

export default function CardList({ todaysCards }: CardListProps) {
  if (!todaysCards || todaysCards.length === 0) {
    return <Typography>ThanksCardを作成しよう!</Typography>
  }

  return (
    <Grid container spacing={2}>
      {todaysCards.map((card) => (
        <Grid item key={card.id} xs={12} sm={4}>
          <CardItem {...card} />
        </Grid>
      ))}
    </Grid>
  )
}
