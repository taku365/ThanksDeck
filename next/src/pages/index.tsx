import { Button } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'

export default function PublicThanksDeck() {
  const router = useRouter()

  return (
    <>
      <div>ここで新規登録やログイン</div>
      <Button onClick={() => router.push('/signup')}>新規登録ボタン</Button>
      <Button onClick={() => router.push('/signin')}>ログイン</Button>
    </>
  )
}
