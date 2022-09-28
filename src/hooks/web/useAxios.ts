import { service } from '@/config/axios'

import { AxiosPromise } from 'axios'

import { config } from '@/config/axios/config'
import { API_URL } from '@/utils/API_URL'

const { default_headers } = config

const request = (option: AxiosConfig, fixedBaseURL: boolean) => {
  const { url, method, params, data, headersType, responseType } = option
  let baseURL = ''
  fixedBaseURL ? (baseURL = API_URL) : (baseURL = '')
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

function getFn<T = any>(option: AxiosConfig, fixedBaseURL?: boolean): AxiosPromise<T> {
  fixedBaseURL == undefined ? (fixedBaseURL = false) : fixedBaseURL
  return request({ method: 'get', ...option }, fixedBaseURL)
}

function postFn<T = any>(option: AxiosConfig, fixedBaseURL?: boolean): AxiosPromise<T> {
  fixedBaseURL == undefined ? (fixedBaseURL = false) : fixedBaseURL
  return request({ method: 'post', ...option }, fixedBaseURL)
}

function deleteFn<T = any>(option: AxiosConfig, fixedBaseURL?: boolean): AxiosPromise<T> {
  fixedBaseURL == undefined ? (fixedBaseURL = false) : fixedBaseURL
  return request({ method: 'delete', ...option }, fixedBaseURL)
}

function putFn<T = any>(option: AxiosConfig, fixedBaseURL?: boolean): AxiosPromise<T> {
  fixedBaseURL == undefined ? (fixedBaseURL = false) : fixedBaseURL
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
