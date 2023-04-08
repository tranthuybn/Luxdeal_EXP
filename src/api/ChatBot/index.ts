import { useAxios } from '@/hooks/web/useAxios'
import { ERP_DOMAIN_CHATS_URL, CHAT_API } from '@/utils/API_URL'
const request = useAxios()
import { objectToQueryParams } from '@/utils/format'
const fixedBaseURL = ERP_DOMAIN_CHATS_URL

export const getEmployeeList = async (params): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${CHAT_API.USER_LIST_CHAT}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

export const getMessageChat = async (params): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${CHAT_API.MESSAGE_LIST_GROUP_CHAT}${params}`
    },
    fixedBaseURL
  )
  return res && res.data
}

export const getGroupIDChat = async (params): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${CHAT_API.GROUP_CHAT}${params}`
    },
    fixedBaseURL
  )
  return res && res.data
}


export const getTypeChat = async (params): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${CHAT_API.TYPECHAT}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}