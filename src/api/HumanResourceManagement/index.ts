import { useAxios } from '@/hooks/web/useAxios'
import { DEPARTMENT_DIRECTORY, API_URL } from '@/utils/API_URL'
import { objectToQueryParams } from '@/utils/format'

const fixedBaseURL = API_URL
const request = useAxios()

interface Params {
  PageIndex?: number
  PageSize?: number
}

// export const getBranchList = async (params: any): Promise<IResponse> => {
//   const res = await request.get({ url: '/Branch/List', params })
//   return res && res.data
// }

export const getBranchList = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    { url: `${DEPARTMENT_DIRECTORY.BRANCH_LIST}`, params },
    fixedBaseURL
  )
  return res && res.data
}

export const getDepartmentList = async (_params?: Params): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${DEPARTMENT_DIRECTORY.DEPARTMENT_LIST}`,
      params: {
        PageIndex: 1,
        PageSize: 20
      }
    },
    fixedBaseURL
  )
  return res && res.data
}

export const addNewDepartment = async (params: any): Promise<IResponse> => {
  const res = await request.post(
    { url: `${DEPARTMENT_DIRECTORY.POST_NEW_DEPARTMENT}`, params },
    fixedBaseURL
  )
  return res.data && res.data
}

export const updateDepartment = async (params: any): Promise<IResponse> => {
  const res = await request.put(
    {
      url: `${DEPARTMENT_DIRECTORY.UPDATE_DEPARTMENT}`,
      params
    },
    fixedBaseURL
  )
  return res && res.data
}
export const deleteDepartment = async (params): Promise<IResponse> => {
  const res = await request.delete(
    {
      url: `${DEPARTMENT_DIRECTORY.DELETE_DEPARTMENT}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
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
