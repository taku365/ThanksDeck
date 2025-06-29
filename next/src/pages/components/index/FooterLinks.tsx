import { Box } from '@mui/material'
import React from 'react'

export default function FooterLinks() {
  return (
    <Box
      component="footer"
      sx={{ pt: 4, textAlign: 'center', bgcolor: 'background.default' }}
    >
      <Box component="footer" sx={{ py: 2, textAlign: 'center' }}>
        © {new Date().getFullYear()} ThanksDeck
      </Box>
    </Box>
  )
}
