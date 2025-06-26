import { CircularProgress } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import useSWR from 'swr'
import Layout from './components/Layout'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { fetcher } from '@/utils/api'

export default function Dashboard() {
  const router = useRouter()
  const { currentUser, isLoading } = useCurrentUser()
  const { data: cards } = useSWR('/cards/today', fetcher)
  console.log(cards)

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.replace('/signin')
    }
  }, [isLoading, currentUser, router])

  if (isLoading) return <CircularProgress />

  if (!currentUser) return null

  return <Layout>ここはダッシュボード画面です</Layout>
}
