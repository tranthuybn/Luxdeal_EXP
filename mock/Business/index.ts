import { config } from '@/config/axios/config'
import Mock from 'mockjs'
import {
  potentialCustomerCareTable,
  potentialCustomerCareTableMock
} from './potentialCustomerCareTable'
import { customerList, customerListMock } from './customer'
import { collaboratorsList, collaboratorsListMock } from './collaborators'
import { flashsaleList, flashsaleListMock } from './promotionstrategy/flashsale'
import { collectionList, collectionListMock } from './promotionstrategy/collection'
import { newproductList, newproductListMock } from './promotionstrategy/newproduct'
import { servicesurveyList, servicesurveyListMock } from './servicesurvey'
import { customerPointsList, customerPointsListMock } from './customerpoints'
import { employeeRatingList, employeeRatingListMock } from './employeeRating'
import { customerVirtualWalletList, customerVirtualWalletListMock } from './customervirtualwallet'
import { voucherList, voucherListMock } from './promotionstrategy/voucher'
import { comboList, comboListMock } from './promotionstrategy/combo'
import { auctionList, auctionListMock } from './promotionstrategy/auction'
import { employeeList, employeeListMock } from './promotionstrategy/employeeList'
import { serviceResponse } from '../_reponseStructure'
import { paymentList, paymentListMock } from './paymentproposallist'
import {
  receiptsAndExpendituresList,
  receiptsAndExpendituresListMock
} from './receiptsandexpenditures'
import {
  potenialCustomerList,
  potenialCustomerListMock
} from './promotionstrategy/newPotenialCustomer'
const { result_code } = config
const timeout = 1000
const count = 100
for (let i = 0; i < count; i++) {
  potentialCustomerCareTable.push(Mock.mock(potentialCustomerCareTableMock))
  customerList.push(Mock.mock(customerListMock))
  collaboratorsList.push(Mock.mock(collaboratorsListMock))
  flashsaleList.push(Mock.mock(flashsaleListMock))
  collectionList.push(Mock.mock(collectionListMock))
  newproductList.push(Mock.mock(newproductListMock))
  servicesurveyList.push(Mock.mock(servicesurveyListMock))
  customerPointsList.push(Mock.mock(customerPointsListMock))
  employeeRatingList.push(Mock.mock(employeeRatingListMock))
  customerVirtualWalletList.push(Mock.mock(customerVirtualWalletListMock))
  voucherList.push(Mock.mock(voucherListMock))
  comboList.push(Mock.mock(comboListMock))
  auctionList.push(Mock.mock(auctionListMock))
  employeeList.push(Mock.mock(employeeListMock))
  paymentList.push(Mock.mock(paymentListMock))
  receiptsAndExpendituresList.push(Mock.mock(receiptsAndExpendituresListMock))
  potenialCustomerList.push(Mock.mock(potenialCustomerListMock))
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: potentialCustomerCareTable.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: customerList.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: collaboratorsList.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: flashsaleList.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: collectionList.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: newproductList.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: servicesurveyList.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: customerPointsList.length
      })
      return {
        ...responseStructure
      }
    }
  },
  {
    url: '/employeeRating',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = employeeRatingList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: employeeRatingList.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: customerVirtualWalletList.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: voucherList.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: comboList.length
      })
      return {
        ...responseStructure
      }
    }
  },
  {
    url: '/auction',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = auctionList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: auctionList.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: employeeList.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: paymentList.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: receiptsAndExpendituresList.length
      })
      return {
        ...responseStructure
      }
    }
  },
  {
    url: '/addNewPotenialCustomer/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = potenialCustomerList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: potenialCustomerList.length
      })
      return {
        ...responseStructure
      }
    }
  }
]
