import { config } from '@/config/axios/config'
import Mock from 'mockjs'
import { rentalorderList, rentalorderListMock } from './rentalorder'
import { orderDepositList, orderDepositListMock } from './orderDeposit'
import { orderPawnList, orderPawnListMock } from './orderPawn'
import { orderSpaList, orderSpaListMock } from './orderSpa'
import { SellOrder, SellOrderListMock } from './sellOrder'
import { serviceResponse } from '../../_reponseStructure'
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: rentalorderList.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: orderDepositList.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: orderPawnList.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: orderSpaList.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: SellOrder.length
      })
      return {
        ...responseStructure
      }
    }
  },
  {
    url: '/order/getPriceOfSpecificProduct',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { id, serviceType, period } = query
      const price = (Math.floor(Math.random() * 100) + 1) * 10000
      const deposit = (Math.floor(Math.random() * 100) + 1) * 10000
      const responseStructure = new serviceResponse(
        {
          id: id,
          price: price,
          deposit: serviceType == 3 ? deposit : null
        },
        200,
        true,
        result_code,
        'Succeed',
        {
          pageSize: 0,
          pageIndex: 0,
          count: 0
        }
      )
      return {
        ...responseStructure
      }
    }
  }
]
