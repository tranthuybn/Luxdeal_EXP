import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

import { ElMessage } from 'element-plus'

import qs from 'qs'

import { config } from '@/config/axios/config'

const { result_code, base_url } = config

export const PATH_URL = base_url[import.meta.env.VITE_API_BASEPATH]

// Create axios instance
const service: AxiosInstance = axios.create({
  baseURL: PATH_URL, // API's base_url
  timeout: config.request_timeout // Request timeout time
})
// Request interceptor
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (
      config.method === 'post' &&
      config!.headers!['Content-Type'] === 'application/x-www-form-urlencoded'
    ) {
      config.data = qs.stringify(config.data)
    }
    // Add token, you can modify it according to the actual business
    // config!.headers!['Authorization'] = 'something'
    // GET parameter encoding
    if (config.method === 'get' && config.params) {
      let url = config.url as string
      url += '?'
      const keys = Object.keys(config.params)
      for (const key of keys) {
        if (config.params[key] !== void 0 && config.params[key] !== null) {
          url += `${key}=${encodeURIComponent(config.params[key])}&`
        }
      }
      url = url.substring(0, url.length - 1)
      config.params = {}
      config.url = url
    }
    return config
  },
  (error: AxiosError) => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  (response: AxiosResponse<Recordable>) => {
    if (response.data.code === result_code || response.data.code == null) {
      return response
    } else {
      ElMessage.error(response.data.message)
    }
  },
  (error: AxiosError) => {
    ElMessage.error(error.message)
    return Promise.reject(error)
  }
)

export { service }
