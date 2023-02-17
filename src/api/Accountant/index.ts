import { useAxios } from '@/hooks/web/useAxios'
import { ACCOUNTANT_API, API_URL, APPROVAL_API } from '@/utils/API_URL'
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

export const CreateANewReceiOrPayment = async (params: any): Promise<IResponse> => {
  const res = await request.post(
    {
      url: ACCOUNTANT_API.CREATE_NEW_RECEIPT_OR_PAYMENT_VOUCHER,
      data: params
    },
    fixedBaseURL
  )
  return res.data && res.data.data
}

export const EditAReceiptOrPaymentVoucher = async (params: any): Promise<IResponse> => {
  const res = await request.put(
    {
      url: ACCOUNTANT_API.EDIT_RECEIPT_OR_PAYMENT_VOUCHER,
      data: params
    },
    fixedBaseURL
  )
  return res.data && res.data.data
}

export const deleteAReceiptOrPaymentVoucher = async (params: any): Promise<IResponse> => {
  const res = await request.delete(
    {
      url: ACCOUNTANT_API.DELETE_RECEIPT_OR_PAYMENT_VOUCHER,
      data: params
    },
    fixedBaseURL
  )
  return res.data && res.data.data
}