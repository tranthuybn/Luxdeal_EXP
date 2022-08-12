import { config } from '@/config/axios/config'
import {
  potentialCustomerCareTable,
  potentialCustomerCareTableMock
} from './potentialCustomerCareTable'
import { customerList, customerListMock } from './customer'
import { collaboratorsList, collaboratorsListMock } from './collaborators'
import { rentalorderList, rentalorderListMock } from './rentalorder'
import { SellOrder, SellOrderListMock } from './order'

const { result_code } = config
const timeout = 1000
const count = 100
import Mock from 'mockjs'

for (let i = 0; i < count; i++) {
  potentialCustomerCareTable.push(Mock.mock(potentialCustomerCareTableMock))
  customerList.push(Mock.mock(customerListMock))
  collaboratorsList.push(Mock.mock(collaboratorsListMock))
  rentalorderList.push(Mock.mock(rentalorderListMock))
  SellOrder.push(Mock.mock(SellOrderListMock))
}
export default [
  {
    url: '/potentialCustomerCareTable/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = potentialCustomerCareTable.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: potentialCustomerCareTable.length,
          list: pageList
        }
      }
    }
  },
  {
    url: '/customer/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = customerList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: customerList.length,
          list: pageList
        }
      }
    }
  },
  {
    url: '/collaborators/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = collaboratorsList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: collaboratorsList.length,
          list: pageList
        }
      }
    }
  },
  {
    url: '/rentalorder/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = rentalorderList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: rentalorderList.length,
          list: pageList
        }
      }
    }
  },
  {
    url: '/sell-order/list',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = customerList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: customerList.length,
          list: pageList
        }
      }
    }
  }
]
