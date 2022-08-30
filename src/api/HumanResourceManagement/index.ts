import { useAxios } from '@/hooks/web/useAxios'

const request = useAxios()

export const getBranchList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/Branch/List', params })
  return res && res.data
}
export const getDepartmentList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/Department/List', params })
  return res && res.data
}
export const getRankList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/Rank/List', params })
  return res && res.data
}
export const getTypePersonnelList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/TypePersonnel/List', params })
  return res && res.data
}
