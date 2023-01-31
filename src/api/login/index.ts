import { useAxios } from '@/hooks/web/useAxios'
import type { UserType } from './types'
interface RoleParams {
  roleName: string
}
import { LOGIN_API_URL, API_URL } from '@/utils/API_URL'
const fixedBaseURL = API_URL

const request = useAxios()
export const loginApi = async (data: UserType): Promise<IResponse<UserType>> => {
  const res = await request.post({ url: 'api/auth/Login', data }, LOGIN_API_URL)
  return res && res.data
}

//update password
export const updatePasswordApi = async (data): Promise<IResponse> => {
  const res = await request.post({ url: 'api/auth/updatePassword', data }, LOGIN_API_URL)
  return res && res.data
}

export const loginOutApi = async (): Promise<IResponse> => {
  const res = await request.get({ url: '/user/loginOut' })
  return res && res.data
}

export const getUserListApi = ({ params }: AxiosConfig) => {
  return request.get<{
    total: number
    list: UserType[]
  }>({ url: '/user/list', params })
}

export const getRoutesAsRolesApi = async (params: RoleParams): Promise<IResponse<any>> => {
  const res = await request.get({ url: '/role/list', params })
  return res && res.data
}
export const GetRouterByStaffAccountId = async (params): Promise<IResponse<any>> => {
  const res = await request.get(
    { url: 'api/v1/Authorization/GetRouterByStaffAccountId', params },
    fixedBaseURL
  )
  return res && res.data
}
