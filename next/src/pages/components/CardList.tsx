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
    return (
      <Typography textAlign="center" sx={{ mt: 5 }}>
        ThanksCardを作成しよう!
      </Typography>
    )
  }

  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      {todaysCards.map((card) => (
        <Grid item key={card.id} xs={4} sm={12}>
          <CardItem {...card} />
        </Grid>
      ))}
    </Grid>
  )
}
