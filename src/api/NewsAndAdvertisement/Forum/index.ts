import { useAxios } from '@/hooks/web/useAxios'

const request = useAxios()

export const getMemberList = async (): Promise<IResponse> => {
  const res = await request.get({ url: '/member/List' })
  return res && res.data
}
