import useSWR from 'swr'
import { fetcher } from '../utils/api'

export type User = {
  id: number
  name: string
  email: string
}

export const useCurrentUser = () => {
  const { data, error, mutate } = useSWR<User>('/current/user', fetcher, {
    revalidateOnFocus: false,
  })

  const loading = !data && !error

  return {
    currentUser: data,
    isLoading: loading,
    isError: !!error,
    refresh: mutate,
  }
}
