import axios from 'axios'
import { getAuthTokens, setAuthTokens } from './tokenStorage'

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

// レスポンス時にトークン更新分を自動保存
api.interceptors.response.use((response) => {
  const h = response.headers
  if (h['access-token'] && h.client && h.uid) {
    setAuthTokens({
      'access-token': String(h['access-token'] ?? ''),
      client: String(h.client ?? ''),
      uid: String(h.uid ?? ''),
    })
  }
  return response
})

// GET→data 抜き出しのラッパー
export const fetcher = (url: string) => api.get(url).then((res) => res.data)
