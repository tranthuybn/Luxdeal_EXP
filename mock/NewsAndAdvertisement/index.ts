import { config } from '@/config/axios/config'
import { NotificationList, NotificationListMock } from './notification'
import Mock from 'mockjs'
const { result_code } = config
const count = 77
const timeout = 1000
for (let i = 0; i < count; i++) {
  NotificationList.push(Mock.mock(NotificationListMock))
}
export default [
  {
    url: '/notification/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = NotificationList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: NotificationList.length,
          list: pageList
        }
      }
    }
  }
]
