import Mock from 'mockjs'
import { config } from '@/config/axios/config'

interface PoliciesGuidelines {
  id: Number
  title: string
  content: string
  type: string
  show: string
  image: string
  createDate: Date
  creator: string
  status: string
}

const count = 77
const PoliciesGuidelinesList: PoliciesGuidelines[] = []
for (let i = 0; i < count; i++) {
  PoliciesGuidelinesList.push(
    Mock.mock({
      id: i,
      title: '@string(5,10)',
      content: '@string(10,20)',
      type: '@string(10,20)',
      show: '@integer(0,10)',
      image: '@image',
      createDate: '@date("dd/MM/yyyy")',
      creator: '@first',
      status: 'Chờ duyệt'
    })
  )
}
const { result_code } = config
const timeout = 1000

export default [
  {
    url: '/PoliciesGuidelinesList',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = PoliciesGuidelinesList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: PoliciesGuidelinesList.length,
          list: pageList
        }
      }
    }
  }
]
