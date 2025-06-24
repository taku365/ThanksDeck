import { Grid, Typography } from '@mui/material'
import CardItem from './CardItem'

interface CardListProps {
  cards: Array<{
    id: number
    content: string
    logged_date: string
  }>
}

export default function CardList({ cards }: CardListProps) {
  if (!cards || cards.length === 0) {
    return <Typography>まだ投稿がありません</Typography>
  }

  return (
    <Grid container spacing={2}>
      {cards.map((card) => (
        <Grid item key={card.id} xs={12} sm={4}>
          <CardItem {...card} />
        </Grid>
      ))}
    </Grid>
  )
}
