import { Modal, Box, TextField, Button, Typography } from '@mui/material'
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

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
}

export default function CardFormModal({
  open,
  initialData = {
    content: '',
    logged_date: new Date().toLocaleDateString('sv-SE'), //YYYY-MM-DD形式
  },
  onClose,
  onCreate,
}: CardFormModalProps) {
  const [content, setContent] = useState(initialData.content)
  const [loggedDate, setLoggedDate] = useState(initialData.logged_date)
  const [errors, setErrors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  //保存ボタンを押したときの処理
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

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          {initialData.id != null ? '編集する' : 'ThanksCardを作成'}
        </Typography>

        {errors.map((err, i) => (
          <Typography color="error" key={i}>
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
          inputProps={{ maxLength: 140 }}
          helperText={`${content.length}/140`}
          sx={{ mt: 2 }}
        />

        <TextField
          label="記録日"
          type="date"
          fullWidth
          value={loggedDate}
          onChange={(e) => setLoggedDate(e.target.value)}
          sx={{ mt: 2 }}
          InputLabelProps={{ shrink: true }}
        />

        <Box mt={3} display="flex" justifyContent="flex-end">
          {/* キャンセル */}
          <Button onClick={onClose} disabled={saving} sx={{ mr: 1 }}>
            キャンセル
          </Button>

          {/* 保存 */}
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving || !content}
          >
            {saving ? '保存中...' : '保存する'}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
