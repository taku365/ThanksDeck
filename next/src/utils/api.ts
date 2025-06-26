import axios from 'axios'
import { getAuthTokens } from './tokenStorage'

// 共通ベースURL・ヘッダー付きの Axios インスタンスを作成
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
console.log('baseURL:', api.defaults.baseURL)

//リクエスト時に認証ヘッダーを自動付与
api.interceptors.request.use((config) => {
  const tokens = getAuthTokens()

  if (config.headers) {
    config.headers['access-token'] = tokens['access-token']
    config.headers.client = tokens.client
    config.headers.uid = tokens.uid
  }
  return config
})

// GET→data 抜き出しのラッパー
export const fetcher = (url: string) => api.get(url).then((res) => res.data)
