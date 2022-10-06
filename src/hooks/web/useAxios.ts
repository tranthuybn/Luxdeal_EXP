import { service } from '@/config/axios'

import { AxiosPromise } from 'axios'

import { config } from '@/config/axios/config'
import { LOGIN_API_URL, API_URL } from '@/utils/API_URL'

const { default_headers } = config

const request = (option: AxiosConfig, fixedBaseURL: number | undefined) => {
  const { url, method, params, data, headersType, responseType } = option
  let baseURL = ''
  switch (fixedBaseURL) {
    case 0: {
      baseURL = API_URL
      break
    }
    case 1: {
      baseURL = LOGIN_API_URL
      break
    }
    default: {
      baseURL = ''
      break
    }
  }
  return service({
    baseURL: baseURL,
    url: url,
    method,
    params,
    data,
    responseType: responseType,
    headers: {
      'Content-Type': headersType || default_headers
    }
  })
}

function getFn<T = any>(option: AxiosConfig, fixedBaseURL?: number): AxiosPromise<T> {
  return request({ method: 'get', ...option }, fixedBaseURL)
}

function postFn<T = any>(option: AxiosConfig, fixedBaseURL?: number): AxiosPromise<T> {
  return request({ method: 'post', ...option }, fixedBaseURL)
}

function deleteFn<T = any>(option: AxiosConfig, fixedBaseURL?: number): AxiosPromise<T> {
  return request({ method: 'delete', ...option }, fixedBaseURL)
}

function putFn<T = any>(option: AxiosConfig, fixedBaseURL?: number): AxiosPromise<T> {
  return request({ method: 'put', ...option }, fixedBaseURL)
}

export const useAxios = () => {
  return {
    get: getFn,
    post: postFn,
    delete: deleteFn,
    put: putFn
  }
}
