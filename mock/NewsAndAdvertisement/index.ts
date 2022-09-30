import { config } from '@/config/axios/config'
import { NotificationList, NotificationListMock } from './notification'
import { manageNews } from './managenews'
import { PoliciesGuidelinesList } from './policiesGuidelines'
import { NewsList } from './newslist'
import { bannerAdvertisementList, bannerAdvertisementListMock } from './bannerAdvertisement'
import { members, MemberListMock } from './Forum/member'
import Mock from 'mockjs'
import { serviceResponse } from '../_reponseStructure'
const { result_code } = config
const count = 77
const timeout = 1000
for (let i = 0; i < count; i++) {
  NotificationList.push(Mock.mock(NotificationListMock))
  bannerAdvertisementList.push(Mock.mock(bannerAdvertisementListMock))
  members.push(Mock.mock(MemberListMock))
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: NotificationList.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: bannerAdvertisementList.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: manageNews.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: PoliciesGuidelinesList.length
      })
      return {
        ...responseStructure
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
      const responseStructure = new serviceResponse(pageList, 200, true, result_code, 'Succeed', {
        pageSize: pageSize,
        pageIndex: pageIndex,
        count: NewsList.length
      })
      return {
        ...responseStructure
      }
    }
  },
  {
    url: '/member/List',
    method: 'get',
    timeout,
    response: () => {
      const responseStructure = new serviceResponse(
        members,
        200,
        true,
        result_code,
        'Succeed',
        null
      )
      return {
        ...responseStructure
      }
    }
  }
]
