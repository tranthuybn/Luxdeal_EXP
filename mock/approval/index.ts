import Mock from 'mockjs'
import { config } from '@/config/axios/config'

interface ApprovalManagement {
  id: Number
  categoryInfo: string
  condition: string
  approveOrNot: boolean
  children: Array<ApprovalManagement>
}

const count = 77
const ApprovalManagementList: ApprovalManagement[] = []
for (let i = 0; i < count; i++) {
  ApprovalManagementList.push(
    Mock.mock({
      id: i,
      categoryInfo: '@title(5, 10)',
      condition: '@title(5, 10)',
      approveOrNot: '@boolean',
      children: [
        {
          id: i,
          categoryInfo: '@title(5, 10)',
          condition: '@title(5, 10)',
          approveOrNot: '@boolean'
        },
        {
          id: i,
          categoryInfo: '@title(5, 10)',
          condition: '@title(5, 10)',
          approveOrNot: '@boolean'
        }
      ]
    })
  )
}
const { result_code } = config
const timeout = 1000

export default [
  {
    url: '/ApprovalManagement/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = ApprovalManagementList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: ApprovalManagementList.length,
          list: pageList
        }
      }
    }
  }
]
