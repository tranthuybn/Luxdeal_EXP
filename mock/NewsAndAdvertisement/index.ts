import { config } from '@/config/axios/config'
import { NotificationList, NotificationListMock } from './notification'
import { manageNews } from './managenews'
import { PoliciesGuidelinesList } from './policiesGuidelines'
import { NewsList } from './newslist'
import { bannerAdvertisementList, bannerAdvertisementListMock } from './bannerAdvertisement'

import Mock from 'mockjs'
const { result_code } = config
const count = 77
const timeout = 1000
for (let i = 0; i < count; i++) {
  NotificationList.push(Mock.mock(NotificationListMock))
  bannerAdvertisementList.push(Mock.mock(bannerAdvertisementListMock))
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
  },
  {
    url: '/bannerAdvertisement/List',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = bannerAdvertisementList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: bannerAdvertisementList.length,
          list: pageList
        }
      }
    }
  },
  {
    url: '/manageNews',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = manageNews.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: manageNews.length,
          list: pageList
        }
      }
    }
  },
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
  },
  {
    url: '/NewsList',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageIndex, pageSize } = query
      const pageList = NewsList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: result_code,
        data: {
          total: NewsList.length,
          list: pageList
        }
      }
    }
  }
]
