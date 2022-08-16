import { useAxios } from '@/hooks/web/useAxios'

const request = useAxios()

export const getProductCategories = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/products/List', params })
  return res && res.data
}
