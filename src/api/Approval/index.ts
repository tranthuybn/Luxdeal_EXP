import { useAxios } from '@/hooks/web/useAxios'
import { API_URL, APPROVAL_API, PRODUCTS_AND_SERVICES_API, ORDER_API } from '@/utils/API_URL'
import { FORM_DATA, objectToQueryParams } from '@/utils/format'
const request = useAxios()
const fixedBaseURL = API_URL

export const getApproveManagementList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: `${APPROVAL_API.GET_LIST_APPROVAL}`, params }, fixedBaseURL)
  return res && res.data
}

export const getProductsApproval = async (params): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${APPROVAL_API.GET_LIST_PRODUCT_APPROVAL}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

export const getBusinessProductLibrary = async (params): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${PRODUCTS_AND_SERVICES_API.GET_PRODUCT}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

// Lấy danh sách order cần duyệt
export const getOrderApproval = async (params): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${ORDER_API.ORDER_APPROVAL_LIST}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}
// Lấy danh sách chiến dịch khuyến mãi
export const getCampaignApproval = async (params): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${APPROVAL_API.GET_LIST_CAMPAIGN_APPROVED}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

// Lấy danh sách CTV cần duyệt
export const listApprovalCollab = async (params): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${ORDER_API.COLLABORATOR_APPROVAL_LIST}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

// Lấy danh sách TKKH cần duyệt
export const listApprovalUserAccount = async (params): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${ORDER_API.CUSTOMER_APPROVAL_LIST}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

// Lấy danh sách phiếu thu chi và đề nghị thanh toán
export const getOrderPayments = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${ORDER_API.APPROVAL_API_PAYMENT_LIST}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

// duyệt sản phẩm
export const approvalProducts = async (data): Promise<IResponse> => {
  const res = await request.put(
    { url: `${PRODUCTS_AND_SERVICES_API.APPROVAL_PRODUCTS}`, data },
    fixedBaseURL
  )
  return res.data && res.data.data
}

// cập nhật trạng thái duyệt của cài đặt duyệt
export const approvalSettings = async (data): Promise<IResponse> => {
  data = FORM_DATA(data)
  const res = await request.put(
    { url: `${PRODUCTS_AND_SERVICES_API.APPROVAL_SETTINGS}`, data },
    fixedBaseURL
  )
  return res.data && res.data.data
}