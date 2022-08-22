import { config } from '@/config/axios/config'
import {
  potentialCustomerCareTable,
  potentialCustomerCareTableMock
} from './potentialCustomerCareTable'
import { customerList, customerListMock } from './customer'
import { collaboratorsList, collaboratorsListMock } from './collaborators'
import { rentalorderList, rentalorderListMock } from './rentalorder'
import { SellOrder, SellOrderListMock } from './order'
import { flashsaleList, flashsaleListMock } from './promotionstrategy/flashsale'
import { collectionList, collectionListMock } from './promotionstrategy/collection'
import { newproductList, newproductListMock } from './promotionstrategy/newproduct'
import { servicesurveyList, servicesurveyListMock } from './servicesurvey'
import { warehouseList, warehouseListMock } from './warehouse'

const { result_code } = config
const timeout = 1000
const count = 100
import Mock from 'mockjs'
import { el } from 'element-plus/es/locale'

for (let i = 0; i < count; i++) {
  potentialCustomerCareTable.push(Mock.mock(potentialCustomerCareTableMock))
  customerList.push(Mock.mock(customerListMock))
  collaboratorsList.push(Mock.mock(collaboratorsListMock))
  rentalorderList.push(Mock.mock(rentalorderListMock))
  SellOrder.push(Mock.mock(SellOrderListMock))
  flashsaleList.push(Mock.mock(flashsaleListMock))
  collectionList.push(Mock.mock(collectionListMock))
  newproductList.push(Mock.mock(newproductListMock))
  servicesurveyList.push(Mock.mock(servicesurveyListMock))
  warehouseList.push(Mock.mock(warehouseListMock))
}
export default [
  {
    url: '/potentialCustomerCareTable/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize, startDate, endDate, searchingKey } = query
      const pageList = potentialCustomerCareTable.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      if (startDate) potentialCustomerCareTable.filter((el) => el.receivedDate > startDate)
      if (endDate) potentialCustomerCareTable.filter((el) => el.receivedDate < endDate)
      if (searchingKey)
        potentialCustomerCareTable.filter(
          (el) => el.sale == searchingKey || el.customerInfo == searchingKey
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
  },
  {
    url: '/flash-sale/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = flashsaleList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: flashsaleList.length,
          list: pageList
        }
      }
    }
  },
  {
    url: '/collection/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = collectionList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: collectionList.length,
          list: pageList
        }
      }
    }
  },
  {
    url: '/newproduct/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = newproductList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: newproductList.length,
          list: pageList
        }
      }
    }
  },
  {
    url: '/servicesurvey/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = servicesurveyList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: servicesurveyList.length,
          list: pageList
        }
      }
    }
  },
  {
    url: '/warehouse/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = warehouseList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: warehouseList.length,
          list: pageList
        }
      }
    }
  }
]
