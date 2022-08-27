import { useAxios } from '@/hooks/web/useAxios'
const request = useAxios()

export const getApproveManagementList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/ApprovalManagement/List', params })
  return res && res.data
}
