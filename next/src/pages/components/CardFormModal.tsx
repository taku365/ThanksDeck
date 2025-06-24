import { Modal, Box, TextField, Button, Typography } from '@mui/material'
import { isAxiosError } from 'axios'
import { useState, useEffect } from 'react'

interface CardFormModalProps {
  open: boolean
  initialData?: {
    id?: number
    content: string
    logged_date: string
  }
  onClose: () => void
  onSave: (data: {
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
    // logged_date: new Date().toISOString().slice(0, 10),
    // sv-SEロケールはYYYY-MM-DD形式の日付文字列を戻す
    logged_date: new Date().toLocaleDateString('sv-SE'),
  },
  onClose,
  onSave,
}: CardFormModalProps) {
  const [content, setContent] = useState(initialData.content)
  const [loggedDate, setLoggedDate] = useState(initialData.logged_date)
  const [errors, setErrors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setContent(initialData.content)
    setLoggedDate(initialData.logged_date)
    setErrors([])
  }, [initialData, open])

  const handleSave = async () => {
    setSaving(true)
    setErrors([])
    try {
      await onSave({ id: initialData.id, content, logged_date: loggedDate })
      onClose()
    } catch (e: unknown) {
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
          <Button onClick={onClose} disabled={saving} sx={{ mr: 1 }}>
            キャンセル
          </Button>
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
