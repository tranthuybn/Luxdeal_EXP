import { useAxios } from '@/hooks/web/useAxios'
import { API_URL, APPROVAL_API } from '@/utils/API_URL'
const request = useAxios()
import { objectToQueryParams } from '@/utils/format'
const fixedBaseURL = API_URL

export const getAccountantBalanceList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/accountBallance/List', params })
  return res && res.data
}
export const getEmployeeList = async (params): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${APPROVAL_API.GET_LIST_ACOUNT}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

export const getEmployeeById = async (params): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${APPROVAL_API.GET_LIST_ACOUNT_BY_ID}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}
