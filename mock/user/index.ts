import { config } from '@/config/axios/config'
import { serviceResponse } from '../_reponseStructure'
import { MockMethod } from 'vite-plugin-mock'

const { result_code } = config

const timeout = 1000

const List: {
  username: string
  password: string
  role: string
  roleId: string
  permissions: string | string[]
}[] = [
  {
    username: 'admin',
    password: 'admin',
    role: 'admin',
    roleId: '1',
    permissions: ['*.*.*']
  },
  {
    username: 'test',
    password: 'test',
    role: 'test',
    roleId: '2',
    permissions: ['example:dialog:create', 'example:dialog:delete']
  },
  {
    username: 'NoahKhalifa',
    password: 'NoahKhalifa',
    role: 'SuperAdmin',
    roleId: '3',
    permissions: ['*.*.*']
  }
]

export default [
  // List interface
  {
    url: '/user/list',
    method: 'get',
    response: ({ query }) => {
      const { username, pageIndex, pageSize } = query

      const mockList = List.filter((item) => {
        if (username && item.username.indexOf(username) < 0) return false
        return true
      })
      const pageList = mockList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )

      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: mockList.length
      })
      return {
        ...responseStructure
      }
    }
  },
  // Login interface
  {
    url: '/user/login',
    method: 'post',
    timeout,
    response: ({ body }) => {
      const data = body
      let hasUser = false
      for (const user of List) {
        if (user.username === data.username && user.password === data.password) {
          hasUser = true

          const responseStructure = new serviceResponse(
            user,
            200,
            true,
            result_code,
            'Succeed',
            null
          )
          return {
            ...responseStructure
          }
        }
      }
      if (!hasUser) {
        return {
          code: '500',
          message: 'Incorrect username or password'
        }
      }
    }
  },
  // Exit interface
  {
    url: '/user/loginOut',
    method: 'get',
    timeout,
    response: () => {
      const responseStructure = new serviceResponse(null, 200, true, result_code, 'Succeed', null)
      return {
        ...responseStructure
      }
    }
  }
] as MockMethod[]
