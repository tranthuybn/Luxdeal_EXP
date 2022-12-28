import { useAxios } from '@/hooks/web/useAxios'
import {
  CUSTOMER_API,
  PRODUCTS_AND_SERVICES_API,
  ORDER_API,
  API_URL,
  ACCOUNTANT_API,
  CAMPAIGN_API,
  LOGIN_API_URL,
  WAREHOUSE_API
} from '@/utils/API_URL'
import { FORM_IMAGES, objectToQueryParams, FORM_DATA1 } from '@/utils/format'

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
