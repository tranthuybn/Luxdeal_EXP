import { useAxios } from '@/hooks/web/useAxios'
const request = useAxios()

export const getAccountantBalanceList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/accountBallance/List', params })
  return res && res.data
}
