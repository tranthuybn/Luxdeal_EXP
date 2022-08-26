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
import { customerPointsList, customerPointsListMock } from './customerpoints'
import { customerVirtualWalletList, customerVirtualWalletListMock } from './customervirtualwallet'
import { voucherList, voucherListMock } from './promotionstrategy/voucher'
import { comboList, comboListMock } from './promotionstrategy/combo'
import { auctionList, auctionListMock } from './promotionstrategy/auction'
import { employeeList, employeeListMock } from './promotionstrategy/employeeList'
import { paymentList, paymentListMock } from './paymentproposallist'
import {
  receiptsAndExpendituresList,
  receiptsAndExpendituresListMock
} from './receiptsandexpenditures'
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
  customerPointsList.push(Mock.mock(customerPointsListMock))
  customerVirtualWalletList.push(Mock.mock(customerVirtualWalletListMock))
  voucherList.push(Mock.mock(voucherListMock))
  comboList.push(Mock.mock(comboListMock))
  auctionList.push(Mock.mock(auctionListMock))
  employeeList.push(Mock.mock(employeeListMock))
  paymentList.push(Mock.mock(paymentListMock))
  receiptsAndExpendituresList.push(Mock.mock(receiptsAndExpendituresListMock))
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
      if (startDate) potentialCustomerCareTable.filter((el) => el.createDate > startDate)
      if (endDate) potentialCustomerCareTable.filter((el) => el.createDate < endDate)
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
  },
  {
    url: '/customerPoints',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = customerPointsList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: customerPointsList.length,
          list: pageList
        }
      }
    }
  },
  {
    url: '/customervirtualWallet',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = customerVirtualWalletList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: customerVirtualWalletList.length,
          list: pageList
        }
      }
    }
  },
  {
    url: '/voucher',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = voucherList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: voucherList.length,
          list: pageList
        }
      }
    }
  },
  {
    url: '/combo',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = comboList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: comboList.length,
          list: pageList
        }
      }
    }
  },
  {
    url: '/employee',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = employeeList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: employeeList.length,
          list: pageList
        }
      }
    }
  },
  {
    url: '/payment',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = paymentList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: paymentList.length,
          list: pageList
        }
      }
    }
  },
  {
    url: '/receipts-expenditures',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = receiptsAndExpendituresList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: receiptsAndExpendituresList.length,
          list: pageList
        }
      }
    }
  }
]
