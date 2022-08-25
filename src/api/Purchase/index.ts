import { useAxios } from '@/hooks/web/useAxios'

const request = useAxios()

export const getPurchaseOrderList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/purchaseOrder/List', params })
  return res && res.data
}
