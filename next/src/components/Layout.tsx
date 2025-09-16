import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
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
import { isAxiosError } from 'axios'
import { useRouter } from 'next/router'
import { ReactNode, useState } from 'react'

import { useAuth } from '@/hooks/useAuth'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { api } from '@/utils/api'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter()
  const { currentUser } = useCurrentUser()
  const { signOut } = useAuth()

  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleLogoutCancel = () => {
    setIsLogoutDialogOpen(false)
  }

  // ログアウト
  const handleLogout = async () => {
    await signOut()
    setIsLogoutDialogOpen(false)
    router.push('/signin')
  }

  //アカウント削除
  const handleDeleteAccount = async () => {
    try {
      await api.delete('/auth')
    } catch (err) {
      if (isAxiosError(err)) {
        const status = err.response?.status
        if (!(status === 401 || status === 404)) {
          alert('アカウント削除に失敗しました')
          return
        }
      } else {
        alert('アカウント削除に失敗しました')
        return
      }
    }
    await signOut()
    await router.push('/signup')
    setIsDeleteDialogOpen(false)
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
            <>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteForeverIcon />}
                onClick={() => setIsDeleteDialogOpen(true)}
                sx={{ textTransform: 'none', fontWeight: 700 }}
              >
                アカウント削除
              </Button>

              <IconButton
                color="inherit"
                aria-label="ログアウト"
                onClick={() => setIsLogoutDialogOpen(true)}
              >
                <LogoutIcon />
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* ログアウト確認 */}
      <Dialog open={isLogoutDialogOpen} onClose={handleLogoutCancel}>
        <DialogContent>
          ログアウトすると再度ログインが必要になります。よろしいですか？
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel}>キャンセル</Button>
          <Button color="error" onClick={handleLogout}>
            ログアウト
          </Button>
        </DialogActions>
      </Dialog>

      {/* アカウント削除確認 */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogContent>
          本当にアカウントを削除しますか？この操作は取り消せません。
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>
            キャンセル
          </Button>
          <Button color="error" onClick={handleDeleteAccount}>
            削除する
          </Button>
        </DialogActions>
      </Dialog>

      <Container sx={{ mt: 2, mb: 2 }}>{children}</Container>
    </>
  )
}
