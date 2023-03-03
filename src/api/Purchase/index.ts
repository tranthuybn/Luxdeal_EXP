import { useAxios } from '@/hooks/web/useAxios'
import {
  ORDER_API,
  API_URL,
} from '@/utils/API_URL'
import { objectToQueryParams } from '@/utils/format'

const request = useAxios()
const fixedBaseURL = API_URL

export const getPurchaseOrderList = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${ORDER_API.GET_ORDER_LIST}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}
