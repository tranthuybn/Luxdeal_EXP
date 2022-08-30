import { config } from '@/config/axios/config'
import Mock from 'mockjs'
import { rentalorderList, rentalorderListMock } from './rentalorder'
import { orderDepositList, orderDepositListMock } from './orderDeposit'
import { orderPawnList, orderPawnListMock } from './orderPawn'
import { orderSpaList, orderSpaListMock } from './orderSpa'
import { SellOrder, SellOrderListMock } from './sellOrder'
const count = 77
const { result_code } = config
const timeout = 1000
for (let i = 0; i < count; i++) {
  rentalorderList.push(Mock.mock(rentalorderListMock))
  orderDepositList.push(Mock.mock(orderDepositListMock))
  orderPawnList.push(Mock.mock(orderPawnListMock))
  orderSpaList.push(Mock.mock(orderSpaListMock))
  SellOrder.push(Mock.mock(SellOrderListMock))
}
export default [
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
    url: '/orderDeposit/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = orderDepositList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: orderDepositList.length,
          list: pageList
        }
      }
    }
  },
  {
    url: '/orderPawn/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = orderPawnList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: orderPawnList.length,
          list: pageList
        }
      }
    }
  },
  {
    url: '/orderSpa/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = orderSpaList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: orderSpaList.length,
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
      const pageList = SellOrder.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: SellOrder.length,
          list: pageList
        }
      }
    }
  }
]
