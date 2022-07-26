import { config } from '@/config/axios/config'
import { MockMethod } from 'vite-plugin-mock'

const { result_code } = config

const timeout = 1000

const dictObj: Recordable = {
  importance: [
    {
      value: 0,
      label: 'tableDemo.commonly'
    },
    {
      value: 1,
      label: 'tableDemo.good'
    },
    {
      value: 2,
      label: 'tableDemo.important'
    }
  ]
}

export default [
  //Dictionary
  {
    url: '/dict/list',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: result_code,
        data: dictObj
      }
    }
  },
  // Get a dictionary
  {
    url: '/dict/one',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: result_code,
        data: [
          {
            label: 'test1',
            value: 0
          },
          {
            label: 'test2',
            value: 1
          },
          {
            label: 'test3',
            value: 2
          }
        ]
      }
    }
  }
] as MockMethod[]
