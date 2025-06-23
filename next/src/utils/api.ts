import axios from 'axios'

// 共通ベースURL・ヘッダー付きの Axios インスタンスを作成
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// GET→data 抜き出しのラッパー
export const fetcher = (url: string) => api.get(url).then((res) => res.data)
