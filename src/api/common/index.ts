import { useAxios } from '@/hooks/web/useAxios'
import { API_URL, ORDER_API } from '@/utils/API_URL'
import { objectToQueryParams } from '@/utils/format'
const fixedBaseURL = API_URL
const request = useAxios()

// Get all dictionaries
export const getDictApi = async (): Promise<IResponse> => {
  const res = await request.get({ url: '/dict/list' })
  return res && res.data
}

// Simulation to get a dictionary
export const getDictOneApi = async (): Promise<IResponse> => {
  const res = await request.get({ url: '/dict/one' })
  return res && res.data
}

export const GenerateCodeOrder = async (params: any): Promise<IResponse> =>{
  const res = await request.get({
    url: `${ORDER_API.GET_AUTO_GEN_CODE}?${objectToQueryParams(params)}`,
  },
  fixedBaseURL
  )
  return res && res.data
}

export const deleteTempCode = async (params): Promise<IResponse> => {
  const res = await request.delete(
    {
      url: `${ORDER_API.DELETE_CODE_TEMP}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}