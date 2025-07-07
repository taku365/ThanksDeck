//受け取ったheadersオブジェクトから認証情報を保存
export const setAuthTokens = (headers: Record<string, string>) => {
  localStorage.setItem('access-token', headers['access-token'])
  localStorage.setItem('client', headers['client'])
  localStorage.setItem('uid', headers['uid'])
}

//保存した認証情報をすべて削除
export const clearAuthTokens = () => {
  localStorage.removeItem('access-token')
  localStorage.removeItem('client')
  localStorage.removeItem('uid')
}

//認証情報を取得(APIリクエスト時に使用)
export const getAuthTokens = () => ({
  'access-token': localStorage.getItem('access-token') || '',
  client: localStorage.getItem('client') || '',
  uid: localStorage.getItem('uid') || '',
})
