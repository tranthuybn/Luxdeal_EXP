import Mock from 'mockjs'
import { config } from '@/config/axios/config'

interface accountBallance {
  id: Number
  accountCode: string
  accountName: string
  openingBalanceOwed: Number
  openingBalanceCash: number
  owedArisingInThePeriod: Number
  cashArisingInThePeriod: Number
  owedArisingInTheEndOfPeriod: Number
  cashArisingInTheEndOfPeriod: Number
  children: Array<accountBallance>
}

const count = 77
const accountBallance: accountBallance[] = []
for (let i = 0; i < count; i++) {
  accountBallance.push(
    Mock.mock({
      id: i,
      accountCode: '@integer(0,100)',
      accountName: '@title(5, 10)',
      openingBalanceOwed: '@integer(1, 3)',
      openingBalanceCash: '@integer(1, 3)',
      owedArisingInThePeriod: '@integer(1, 3)',
      cashArisingInThePeriod: '@integer(1, 3)',
      owedArisingInTheEndOfPeriod: '@integer(1, 3)',
      cashArisingInTheEndOfPeriod: '@integer(1, 3)',
      children: [
        {
          id: ++i,
          accountCode: '@integer(0,100)',
          accountName: '@title(5, 10)',
          openingBalanceOwed: '@integer(1, 3)',
          openingBalanceCash: '@integer(1, 3)',
          owedArisingInThePeriod: '@integer(1, 3)',
          cashArisingInThePeriod: '@integer(1, 3)',
          owedArisingInTheEndOfPeriod: '@integer(1, 3)',
          cashArisingInTheEndOfPeriod: '@integer(1, 3)'
        },
        {
          id: ++i,
          accountCode: '@integer(0,100)',
          accountName: '@title(5, 10)',
          openingBalanceOwed: '@integer(1, 3)',
          openingBalanceCash: '@integer(1, 3)',
          owedArisingInThePeriod: '@integer(1, 3)',
          cashArisingInThePeriod: '@integer(1, 3)',
          owedArisingInTheEndOfPeriod: '@integer(1, 3)',
          cashArisingInTheEndOfPeriod: '@integer(1, 3)'
        }
      ]
    })
  )
}
const { result_code } = config
const timeout = 1000

export default [
  {
    url: '/accountBallance/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = accountBallance.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: accountBallance.length,
          list: pageList
        }
      }
    }
  }
]
