// import { Card, CardContent, Typography } from '@mui/material'
// import { useRouter } from 'next/router'

// interface CardItemProps {
//   id: number
//   content: string
//   logged_date: string
// }

// export default function CardItem({ id, content, logged_date }: CardItemProps) {
//   const router = useRouter()

//   return (
//     <Card
//       onClick={() => router.push(`/cards/${id}`)}
//       sx={{ cursor: 'pointer' }}
//     >
//       <CardContent>
//         <Typography variant="subtitle2" gutterBottom>
//           {logged_date}
//         </Typography>
//         <Typography variant="body2" noWrap>
//           {content}
//         </Typography>
//       </CardContent>
//     </Card>
//   )
// }

// ThanksCard.tsx
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Paper,
  IconButton,
} from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import React from 'react'

interface ThanksCardProps {
  id: number
  logged_date: string
  content: string
  reply?: string
}

export default function ThanksCard({
  id,
  logged_date,
  content,
  reply,
}: ThanksCardProps) {
  const router = useRouter()

  return (
    <Card
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mb: 3,
        borderRadius: 3,
        boxShadow: 3,
        bgcolor: '#e6f8fb',
        cursor: 'pointer',
        '&:hover': { transform: 'scale(1.1)' },
        transition: '0.2s',
      }}
      onClick={() => router.push(`/cards/${id}`)}
    >
      <CardContent sx={{ px: 3, pt: 2, pb: 1, position: 'relative' }}>
        <Tooltip title="編集・詳細">
          <IconButton
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* 記録日 */}
        <Typography variant="caption" color="text.secondary">
          {dayjs(logged_date).format('YYYY年M月D日')}
        </Typography>

        {/* ───────── 感謝内容エリア ───────── */}
        <Paper
          sx={{
            mt: 1.5,
            p: 2,
            borderRadius: 2,
            border: '2px solid #FFEB3B',
            height: 140,
            overflow: 'auto',
          }}
        >
          <Typography
            variant="body1"
            color="text.primary"
            sx={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {content}
          </Typography>
        </Paper>

        {/* ───────── ChatGPT返信エリア ───────── */}
        <Box sx={{ mt: 2 }}>
          <Divider />
          <Typography
            variant="subtitle2"
            sx={{ mt: 1, mb: 0.5 }}
            color="text.secondary"
          >
            🤖 チャッピー の返信
          </Typography>
          <Paper
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: '#FFFDE7',
              border: '2px dashed',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="body2"
              color={reply ? 'text.primary' : 'text.secondary'}
            >
              {reply ?? '🤖 返信準備中…'}
            </Typography>
          </Paper>
        </Box>
      </CardContent>
    </Card>
  )
}
