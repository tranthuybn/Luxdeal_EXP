import { useAxios } from '@/hooks/web/useAxios'

const request = useAxios()

export const getPotentialCustomerList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/potentialCustomerCareTable/List', params })
  return res && res.data
}
export const getCustomerList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/customer/List', params })
  return res && res.data
}
export const getSellOrderList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/sell-order/list', params })
  return res && res.data
}
export const getCollaboratorsList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/collaborators/List', params })
  return res && res.data
}
export const getRentalorderList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/rentalorder/List', params })
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
export const getVoucherList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/voucher', params })
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
export const getOrderDepositList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/orderDeposit/List', params })
  return res && res.data
}
export const getOrderPawnList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/orderPawn/List', params })
  return res && res.data
}
export const getOrderSpaList = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/orderSpa/List', params })
  return res && res.data
}
