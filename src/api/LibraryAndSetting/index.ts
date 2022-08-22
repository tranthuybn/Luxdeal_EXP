import { useAxios } from '@/hooks/web/useAxios'

const request = useAxios()

export const getProductCategories = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/products/List', params })
  return res && res.data
}
export const getSpaProductCategories = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/SpaProduct/List', params })
  return res && res.data
}
export const getPropertyProductCategories = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/PropertyProduct/List', params })
  return res && res.data
}
export const getColorCategories = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/ColorCategories/List', params })
  return res && res.data
}
export const getSizeCategories = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/SizeCategories/List', params })
  return res && res.data
}
export const getMaterialCategories = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/MaterialCategories/List', params })
  return res && res.data
}
export const getStatusCategories = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/StatusCategories/List', params })
  return res && res.data
}
export const getGenderCategories = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/GenderCategories/List', params })
  return res && res.data
}
export const getUnitCategories = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/UnitCategories/List', params })
  return res && res.data
}
export const getBrandCategories = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/BrandCategories/List', params })
  return res && res.data
}
export const getOriginCategories = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/OriginCategories/List', params })
  return res && res.data
}
export const getBusinessProductLibrary = async (params: any): Promise<IResponse> => {
  const res = await request.get({ url: '/BusinessProductLibrary/List', params })
  return res && res.data
}
