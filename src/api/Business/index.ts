import { useAxios } from '@/hooks/web/useAxios'
import {
  CUSTOMER_API,
  PRODUCTS_AND_SERVICES_API,
  ORDER_API,
  API_URL,
  ACCOUNTANT_API,
  CAMPAIGN_API,
  LOGIN_API_URL
} from '@/utils/API_URL'
import { FORM_IMAGES, objectToQueryParams, FORM_DATA1 } from '@/utils/format'

const request = useAxios()

const fixedBaseURL = API_URL
export const addCustomerRatings = async (params): Promise<IResponse> => {
  const res = await request.post(
    {
      url: `${CUSTOMER_API.ADD_CUSTOMER_RATINGS}`,
      data: params
    },
    fixedBaseURL
  )
  return res && res.data
}
export const getCustomerRatings = async (): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${CUSTOMER_API.GET_CUSTOMER_RATINGS}`
    },
    fixedBaseURL
  )
  return res && res.data
}

export const getPotentialCustomerList = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${CUSTOMER_API.GET_POTENTIAL_CUSTOMERS}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res.data && res.data.data
}

export const getPotentialCustomerById = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${CUSTOMER_API.GET_POTENTIAL_CUSTOMER_BY_ID}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

export const addNewPotentialCustomer = async (params: any): Promise<IResponse> => {
  const res = await request.post(
    {
      url: CUSTOMER_API.ADD_POTENTIAL_CUSTOMER,
      data: params
    },
    fixedBaseURL
  )
  return res.data && res.data.data
}

export const updatePotentialCustomer = async (params: any): Promise<IResponse> => {
  const res = await request.put(
    {
      url: CUSTOMER_API.UPDATE_POTENTIAL_CUSTOMER,
      data: params
    },
    fixedBaseURL
  )
  return res.data && res.data.data
}

export const UpdatePotentialCustomerHistory = async (params: any): Promise<IResponse> => {
  const res = await request.put(
    {
      url: CUSTOMER_API.UPDATE_POTENTIAL_CUSTOMER_HISTORY,
      data: params
    },
    fixedBaseURL
  )
  return res.data && res.data.data
}

export const deletePotentialCustomer = async (params): Promise<IResponse> => {
  const res = await request.delete(
    {
      url: `${CUSTOMER_API.DELETE_POTENTIAL_CUSTOMER}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

export const deletePotentialCustomerHistory = async (params): Promise<IResponse> => {
  const res = await request.delete(
    {
      url: `${CUSTOMER_API.DELETE_POTENTIAL_CUSTOMER_HISTORY}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

export const deletePotentialCustomerHistoryOfSale = async (params): Promise<IResponse> => {
  const res = await request.delete(
    {
      url: `${CUSTOMER_API.DELETE_POTENTIAL_CUSTOMER_HISTORY_CHILD}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

export const getCustomer = async (params): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${CUSTOMER_API.ALL_CUSTOMER}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

export const getCustomerById = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${CUSTOMER_API.GET_CUSTOMER_BY_ID}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

export const getGenCodeCustomers = async (params): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${CUSTOMER_API.GET_GEN_CODE_CUSTOMER}`,
      data: params
    },
    fixedBaseURL
  )
  return res && res.data
}

export const addNewCustomer = async (params: any): Promise<IResponse> => {
  const res = await request.post(
    {
      url: CUSTOMER_API.ADD_CUSTOMER,
      data: params
    },
    fixedBaseURL
  )
  return res.data && res.data.data
}

export const addNewAuthRegister = async (params: any): Promise<IResponse> => {
  const res = await request.post(
    {
      url: CUSTOMER_API.POST_AUTH_REGISTER,
      data: params
    },
    LOGIN_API_URL
  )
  return res.data && res.data.data
}

// Tạo mới đơn hàng
export const addNewOrderList = async (params: any): Promise<IResponse> => {
  const res = await request.post(
    {
      url: ORDER_API.ADD_NEW_ORDER,
      data: params
    },
    fixedBaseURL
  )
  return res.data && res.data.data
}

// Thêm nhanh khách hàng
export const addQuickCustomer = async (params: any): Promise<IResponse> => {
  const res = await request.post(
    {
      url: ORDER_API.ADD_QUICK_CUSTOMER,
      data: params
    },
    fixedBaseURL
  )
  return res.data && res.data.data
}

// Thêm nhanh sản phẩm
export const createQuickProduct = async (params: any): Promise<IResponse> => {
  const res = await request.post(
    {
      url: ORDER_API.CREATE_QUICK_PRODUCT,
      data: params
    },
    fixedBaseURL
  )
  return res.data && res.data.data
}

// check product
export const getCheckProduct = async (params?: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${ORDER_API.CHECK_PRODUCT}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

// Lấy tất cả thuộc tính sản phẩm theo check product
export const getproductId = async (params?: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${ORDER_API.GET_PRODUCT_ID}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}
// Lấy danh sách đơn hàng
export const getProductsList = async (params?: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${PRODUCTS_AND_SERVICES_API.GET_PRODUCTS}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

// Lấy danh sách cộng tác viên
export const getCollaboratorsInOrderList = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${PRODUCTS_AND_SERVICES_API.GET_COLLABORATORS}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

// Lấy danh sách khách hàng
export const getAllCustomer = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${PRODUCTS_AND_SERVICES_API.GET_ALL_CUSTOMER}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

// Lấy danh sách mã giảm giá
export const getPromotionsList = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${PRODUCTS_AND_SERVICES_API.GET_PROMOTIONS}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

// Tính tổng đơn hàng
export const getTotalOrder = async (params: any): Promise<IResponse> => {
  const res = await request.post(
    {
      url: ORDER_API.TOTAL_ORDER,
      data: params
    },
    fixedBaseURL
  )
  return res.data && res.data.data
}

// Lấy danh sách dịch vụ Spa
export const getSpaList = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${PRODUCTS_AND_SERVICES_API.GET_SPA}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

export const getCustomerList = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${CUSTOMER_API.GET_LIST_CUSTOMER}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res.data && res.data
}
// post đơn hàng spa
export const addNewSpaOrders = async (params: any): Promise<IResponse> => {
  const res = await request.post(
    {
      url: PRODUCTS_AND_SERVICES_API.POST_SPA_ORDER,
      data: params
    },
    fixedBaseURL
  )
  return res.data && res.data.data
}

// Lấy danh sách đơn hàng
export const getSellOrderList = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${ORDER_API.GET_ORDER_LIST}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

export const getRentalorderList = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${ORDER_API.GET_ORDER_LIST}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

export const getOrderDepositList = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${ORDER_API.GET_ORDER_LIST}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

export const getOrderPawnList = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${ORDER_API.GET_ORDER_LIST}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

export const getOrderSpaList = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${ORDER_API.GET_ORDER_LIST}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

export const getCollaboratorsList = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${CUSTOMER_API.GET_COLLABORATOR_API}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res.data && res.data
}
export const getCollaboratorsById = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${CUSTOMER_API.GET_COLLABORATOR_BY_ID}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res.data && res.data
}
export const getGenCodeCollaborators = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${CUSTOMER_API.GET_GEN_CODE_COLLABORATOR}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res.data && res.data
}
export const addNewCollaborators = async (data): Promise<IResponse> => {
  const res = await request.post(
    { url: `${CUSTOMER_API.POST_COLLABORATOR_API}`, data },
    fixedBaseURL
  )
  return res && res.data
}
export const getCustomerRanking = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${CUSTOMER_API.GET_CUSTOMER_RANKING}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}
export const getCustomerRatingsById = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${CUSTOMER_API.GET_CUSTOMER_RAINGS_BY_ID}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}
export const updateCustomerRatings = async (data): Promise<IResponse> => {
  const res = await request.put(
    { url: `${CUSTOMER_API.UPDATE_CUSTOMER_RATINGS}`, data },
    fixedBaseURL
  )
  return res && res.data
}
export const deleteCustomerRating = async (params): Promise<IResponse> => {
  const res = await request.delete(
    {
      url: `${CUSTOMER_API.DELETE_CUSTOMER_RATING}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}
export const updateCollaborators = async (data): Promise<IResponse> => {
  data = FORM_DATA1(data)
  const res = await request.put({ url: `${CUSTOMER_API.PUT_COLLABORATOR_API}`, data }, fixedBaseURL)
  return res && res.data
}
export const getFlashSaleList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/flash-sale/List', params })
  return res && res.data
}

export const getcollectionList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/collection/List', params })
  return res && res.data
}
export const getNewProductList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/newproduct/List', params })
  return res && res.data
}
export const getServiceSurveyList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/servicesurvey/List', params })
  return res && res.data
}
export const getWareHouseList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/warehouse/List', params })
  return res && res.data
}
export const getCustomerPointsList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/customerPoints', params })
  return res && res.data
}
export const getCustomerVirtualEWalletList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/customervirtualWallet', params })
  return res && res.data
}
export const getCampaignList = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    { url: `${CAMPAIGN_API.GET_CAMPAIGN}?${objectToQueryParams(params)}` },
    fixedBaseURL
  )
  return res && res.data
}

// post campaign
export const addNewCampaign = async (params: any): Promise<IResponse> => {
  const res = await request.post(
    {
      url: CAMPAIGN_API.POST_CAMPAIGN,
      data: params
    },
    fixedBaseURL
  )
  return res.data && res.data.data
}

//UPDATE CAMPAIGN
export const updateCampaign = async (data): Promise<IResponse> => {
  const res = await request.put({ url: `${CAMPAIGN_API.UPDATE_CAMPAIGN}`, data }, fixedBaseURL)
  return res && res.data
}

export const getComboList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/combo', params })
  return res && res.data
}
export const getAuctionList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/auction', params })
  return res && res.data
}
export const getEmployeeList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/employee', params })
  return res && res.data
}

// Lấy danh sách đề nghị thanh toán
export const getPaymentList = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${ACCOUNTANT_API.PAYMENT_LIST}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}
export const addNewPaymentRequest = async (data): Promise<IResponse> => {
  const res = await request.post(
    { url: `${ACCOUNTANT_API.POST_COMMISSION_PAYMENT_API}`, data },
    fixedBaseURL
  )
  return res && res.data
}

export const updateCommissionPayment = async (data): Promise<IResponse> => {
  data = FORM_IMAGES(data)
  const res = await request.put(
    { url: `${ACCOUNTANT_API.PUT_COMMISSION_PAYMENT_API}`, data },
    fixedBaseURL
  )
  return res && res.data
}
export const getReceiptPaymentList = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${ACCOUNTANT_API.GET_RECEIPT_PAYMENT_BY_ID_API}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}
export const getCommissionPaymentList = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${CUSTOMER_API.GET_COMMISSION_PAYMENT_API}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res.data && res.data
}
export const getCommissionPaymentByIdList = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${CUSTOMER_API.GET_COMMISSION_PAYMENT_BY_ID_API}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res.data && res.data
}
export const getReceiptsExpendituresList = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${ACCOUNTANT_API.PAYMENT_LIST}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

export const getBalanceList = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${ACCOUNTANT_API.BALANCE_SHEET_LIST}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  console.log('data: ', res.data)
  return res && res.data
}

export const getaddNewPotenialCustomerList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/addNewPotenialCustomer/List', params })
  return res && res.data
}
