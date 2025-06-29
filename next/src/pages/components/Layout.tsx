import AccountCircle from '@mui/icons-material/AccountCircle'
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Link,
  Dialog,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { useRouter } from 'next/router'
import { ReactNode, useState, MouseEvent } from 'react'

import { useAuth } from '@/hooks/useAuth'
import { useCurrentUser } from '@/hooks/useCurrentUser'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter()
  const { currentUser } = useCurrentUser()
  const { signOut } = useAuth()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)

  const open = Boolean(anchorEl)

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogoutClick = () => {
    setIsLogoutDialogOpen(true)
    handleMenuClose()
  }

  const handleLogoutCancel = () => {
    setIsLogoutDialogOpen(false)
  }

  const handleLogoutConfirm = async () => {
    setIsLogoutDialogOpen(false)
    await signOut()
    router.push('/signin')
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            ThanksDeck
          </Typography>

          {!currentUser ? (
            <>
              <Link
                component="button"
                onClick={() => router.push('/signin')}
                sx={{ mr: 2, color: 'inherit', textTransform: 'none' }}
              >
                ログイン
              </Link>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => router.push('/signup')}
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 700,
                }}
              >
                新規登録
              </Button>
            </>
          ) : (
            <>
              <IconButton onClick={handleMenuOpen} color="inherit">
                <AccountCircle />
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                <MenuItem onClick={handleMenuClose}>プロフィール</MenuItem>
                <MenuItem onClick={handleLogoutClick}>ログアウト</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Dialog open={isLogoutDialogOpen} onClose={handleLogoutCancel}>
        <DialogContent>
          ログアウトすると再度ログインが必要になります。よろしいですか？
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel}>いいえ</Button>
          <Button color="error" onClick={handleLogoutConfirm}>
            ログアウト
          </Button>
        </DialogActions>
      </Dialog>

      <Container sx={{ mt: 2, mb: 2 }}>{children}</Container>
    </>
  )
}
