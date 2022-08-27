import Mock from 'mockjs'
import { config } from '@/config/axios/config'

interface ApprovalManagement {
  categoryInfo: string
  condition: string
  children: Array<ApprovalManagement>
}

const count = 77
const ApprovalManagementList: ApprovalManagement[] = []
for (let i = 0; i < count; i++) {
  ApprovalManagementList.push(
    Mock.mock({
      categoryInfo: '@title(5, 10)',
      condition: '@title(5, 10)',
      children: [
        {
          categoryInfo: '@title(5, 10)',
          condition: '@title(5, 10)'
        },
        {
          categoryInfo: '@title(5, 10)',
          condition: '@title(5, 10)'
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
