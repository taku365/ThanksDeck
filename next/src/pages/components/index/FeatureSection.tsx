import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CreateIcon from '@mui/icons-material/Create'
import ShareIcon from '@mui/icons-material/Share'
import { Box, Grid, Typography } from '@mui/material'
import React from 'react'

export default function FeatureSection() {
  return (
    <Box component="section" sx={{ py: 6, bgcolor: 'background.paper' }}>
      {/* タイトル */}
      <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 700 }}>
        特徴紹介
      </Typography>

      {/* 特徴１ */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box textAlign="center" sx={{ mb: 2 }}>
            <CreateIcon sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h6" align="center" sx={{ mb: 1 }}>
            1日最大3つ作成可能
          </Typography>
          <Typography variant="body2" align="center">
            小さな感謝を毎日記録
          </Typography>
        </Grid>

        {/* 特徴2 */}
        <Grid item xs={12} md={4}>
          <Box textAlign="center" sx={{ mb: 2 }}>
            <CalendarTodayIcon sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h6" align="center" sx={{ mb: 1 }}>
            カレンダーで振り返り
          </Typography>
          <Typography variant="body2" align="center">
            過去の感謝を一覧で確認
          </Typography>
        </Grid>

        {/* 特徴3 */}
        <Grid item xs={12} md={4}>
          <Box textAlign="center" sx={{ mb: 2 }}>
            <ShareIcon sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h6" align="center" sx={{ mb: 1 }}>
            SNSで共有
          </Typography>
          <Typography variant="body2" align="center">
            かんたんワンクリック
          </Typography>
        </Grid>
      </Grid>
    </Box>
  )
}
