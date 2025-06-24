// pages/card-test.tsx
import React, { useState } from 'react'
import CardFormModal from './components/CardFormModal'

export default function CardTestPage() {
  // モーダル表示フラグ
  const [open, setOpen] = useState(false)

  // 確認用の onSave
  const handleSave = async (data: {
    id?: number
    content: string
    logged_date: string
  }) => {
    console.log('■ onSave に渡された data:', data)
    alert(JSON.stringify(data, null, 2))
    // 本来は API 呼び出しなど。テストなのですぐ resolve
    return Promise.resolve()
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>CardFormModal テストページ</h1>
      <button onClick={() => setOpen(true)}>モーダルを開く</button>

      <CardFormModal
        open={open}
        initialData={{
          // テスト時の初期値
          content: '',
          logged_date: new Date().toLocaleDateString('sv-SE'),
        }}
        onClose={() => setOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}
