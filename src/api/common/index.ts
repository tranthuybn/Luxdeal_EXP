import { useAxios } from '@/hooks/web/useAxios'

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
