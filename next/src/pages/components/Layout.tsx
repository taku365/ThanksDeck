import AccountCircle from '@mui/icons-material/AccountCircle'
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material'
import { ReactNode, useState } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            ThanksDeck
          </Typography>
          <IconButton onClick={handleOpen} color="inherit">
            <AccountCircle />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={handleClose}>プロフィール</MenuItem>
            <MenuItem onClick={handleClose}>ログアウト</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 2, mb: 2 }}>{children}</Container>
      <Box component="footer" sx={{ py: 2, textAlign: 'center' }}>
        © {new Date().getFullYear()} ThanksDeck
      </Box>
    </>
  )
}
