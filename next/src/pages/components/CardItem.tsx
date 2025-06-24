import { Card, CardContent, Typography } from '@mui/material'
import { useRouter } from 'next/router'

interface CardItemProps {
  id: number
  content: string
  logged_date: string
}

export default function CardItem({ id, content, logged_date }: CardItemProps) {
  const router = useRouter()

  return (
    <Card
      onClick={() => router.push(`/cards/${id}`)}
      sx={{ cursor: 'pointer' }}
    >
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>
          {logged_date}
        </Typography>
        <Typography variant="body2" noWrap>
          {content}
        </Typography>
      </CardContent>
    </Card>
  )
}
