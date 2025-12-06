import LogoutIcon from '@mui/icons-material/Logout'
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  IconButton,
  Button,
  Link,
  Dialog,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { useRouter } from 'next/router'
import { ReactNode, useState } from 'react'

import { useAuth } from '@/hooks/useAuth'
import { useCurrentUser } from '@/hooks/useCurrentUser'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter()
  const { currentUser } = useCurrentUser()
  const { signOut } = useAuth()

  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)

  const handleLogoutCancel = () => {
    setIsLogoutDialogOpen(false)
  }

  // ログアウト
  const handleLogout = async () => {
    await signOut()
    setIsLogoutDialogOpen(false)
    router.push('/signin')
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => {
              if (currentUser) {
                router.push('/mypage')
              } else {
                router.push('/')
              }
            }}
          >
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
            <IconButton
              color="inherit"
              aria-label="ログアウト"
              onClick={() => setIsLogoutDialogOpen(true)}
            >
              <LogoutIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* ログアウト確認 */}
      <Dialog open={isLogoutDialogOpen} onClose={handleLogoutCancel}>
        <DialogContent>ログアウトしてよろしいですか？</DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel}>キャンセル</Button>
          <Button
            color="error"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{ fontWeight: 700 }}
          >
            ログアウト
          </Button>
        </DialogActions>
      </Dialog>

      <Container sx={{ mt: 2, mb: 2 }}>{children}</Container>
    </>
  )
}
