// import type { NextPage } from 'next'
// import useSWR from 'swr'
// import { fetcher } from '@/utils'

// const Index: NextPage = () => {
//   const url = 'http://localhost:3000/api/v1/health_check'
//   const { data, error } = useSWR(url, fetcher)

//   if (error) return <div>An error has occurred.</div>
//   if (!data) return <div>Loading...</div>

//   return (
//     <>
//       <div>Rails疎通確認</div>
//       <div>レスポンスメッセージ: {data.message}</div>
//     </>
//   )
// }

// export default Index

import CardList from './components/CardList'

export default function HomePage() {
  const sample = [
    { id: 1, content: 'サンプル感謝内容', logged_date: '2025-06-22' },
    { id: 1, content: 'サンプル感謝内容', logged_date: '2025-06-22' },
    { id: 1, content: 'サンプル感謝内容', logged_date: '2025-06-22' },
    // ...他のサンプル
  ]

  return <CardList cards={sample} />
}
