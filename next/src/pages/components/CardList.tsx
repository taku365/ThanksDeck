import { Grid, Typography, Box } from '@mui/material'
import CardItem from './CardItem'

interface CardListProps {
  cards: Array<{
    id: number
    content: string
    logged_date: string
  }>
}

export default function CardList({ cards }: CardListProps) {
  return (
    <Grid
      container
      spacing={2}
      sx={{ mt: 1 }}
      justifyContent={cards && cards.length === 0 ? 'center' : 'flex-start'}
    >
      {cards && cards.length > 0 ? (
        cards.map((card) => (
          <Grid item key={card.id} xs={12} sm={4}>
            <CardItem {...card} />
          </Grid>
        ))
      ) : (
        <Grid item xs={12} sm={4}>
          <Box
            sx={{
              minHeight: '160px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: 'background.paper',
              p: 2,
            }}
          >
            <Typography align="center" color="text.secondary">
              ThanksCardを
              <br />
              作成しよう！
            </Typography>
          </Box>
        </Grid>
      )}
    </Grid>
  )
}
