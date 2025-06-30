import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { isAxiosError } from 'axios'
import { useState } from 'react'

interface CardFormModalProps {
  open: boolean
  initialData?: {
    id?: number
    content: string
    logged_date: string
  }
  onClose: () => void
  onCreate: (cardData: {
    id?: number
    content: string
    logged_date: string
  }) => Promise<void>
}

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 350 },
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 4,
  overflow: 'hidden',
}

export default function CardFormModal({
  open,
  initialData = {
    content: '',
    logged_date: new Date().toLocaleDateString('sv-SE'),
  },
  onClose,
  onCreate,
}: CardFormModalProps) {
  const [content, setContent] = useState(initialData.content)
  const [loggedDate, setLoggedDate] = useState(initialData.logged_date)
  const [errors, setErrors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    setErrors([])
    try {
      await onCreate({ id: initialData.id, content, logged_date: loggedDate })
      onClose()
    } catch (e) {
      if (isAxiosError(e)) {
        setErrors(e.response?.data?.errors ?? ['保存に失敗しました'])
      } else {
        setErrors(['保存に失敗しました'])
      }
    } finally {
      setSaving(false)
    }
  }

  const handleRequestClose = () => {
    if (content === initialData.content) {
      onClose()
    } else {
      setIsCancelDialogOpen(true)
    }
  }

  return (
    <>
      <Modal open={open} onClose={handleRequestClose}>
        <Box sx={modalStyle}>
          {/* ─── 見出し部分 ─── */}
          <Box sx={{ bgcolor: 'secondary.light', py: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="text.primary">
              {initialData.id != null ? '編集する' : 'ThanksCardを作成'}
            </Typography>
          </Box>

          {/* ─── フォーム部分 ─── */}
          <Box sx={{ px: 3, py: 2 }}>
            {errors.map((err, i) => (
              <Typography color="error" key={i} sx={{ mb: 1 }}>
                {err}
              </Typography>
            ))}

            <TextField
              label="感謝内容"
              placeholder="ありがとう"
              multiline
              rows={4}
              fullWidth
              value={content}
              onChange={(e) => setContent(e.target.value)}
              helperText={`${content.length}/140`}
              error={content.length > 140}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': { borderColor: 'secondary.main' },
                  '&:hover fieldset': { borderColor: 'secondary.dark' },
                  '&.Mui-focused fieldset': { borderColor: 'secondary.main' },
                },
                mb: 2,
              }}
            />

            <TextField
              label="記録日"
              type="date"
              fullWidth
              value={loggedDate}
              onChange={(e) => setLoggedDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': { borderColor: 'secondary.main' },
                  '&:hover fieldset': { borderColor: 'secondary.dark' },
                  '&.Mui-focused fieldset': { borderColor: 'secondary.main' },
                },
                mb: 3,
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                onClick={handleRequestClose}
                disabled={saving}
                sx={{ mr: 1 }}
              >
                キャンセル
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSave}
                disabled={
                  saving || content.length === 0 || content.length > 140
                }
              >
                {saving ? '保存中...' : '保存する'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* キャンセル確認ダイアログ */}
      <Dialog
        open={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
      >
        <DialogTitle>編集中の内容が破棄されます</DialogTitle>
        <DialogContent>
          内容が保存されません。キャンセルしてもよろしいですか？
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsCancelDialogOpen(false)}
            disabled={saving}
          >
            いいえ
          </Button>
          <Button
            color="error"
            onClick={() => {
              setContent(initialData.content)
              setErrors([])
              setIsCancelDialogOpen(false)
              onClose()
            }}
            disabled={saving}
          >
            変更を破棄
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
