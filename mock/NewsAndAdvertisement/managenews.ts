/* eslint-disable prefer-const */
import Mock from 'mockjs'
import { config } from '@/config/axios/config'
interface manageNews {
  id: string
  image: string
  createDate: Date
  position: number
  status: string
  title: string
  children: Array<manageNews>
}
const count = 77
let manageNews: manageNews[] = []
for (let i = 0; i < count; i++) {
  manageNews.push(
    Mock.mock({
      id: i,
      image:
        'https://ap.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-coussin-bb-h27-handbags--M21191_PM2_Front%20view.png?wid=656&hei=656',
      createDate: '@date("dd/MM/yyyy")',
      position: '@integer(1, 3)',
      status: 'Đang hoạt động',
      title: '@title(5, 10)',
      children: [
        {
          id: ++i,
          image:
            'https://ap.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-coussin-bb-h27-handbags--M21191_PM1_Side%20view.png?wid=656&hei=656',
          createDate: '@date("dd/MM/yyyy")',
          position: '@integer(1, 3)',
          status: 'Đang hoạt động',
          title: '@title(5,10)'
        },
        {
          id: ++i,
          image:
            'https://ap.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-coussin-bb-h27-handbags--M21191_PM1_Back%20view.png?wid=656&hei=656',
          createDate: '@date("dd/MM/yyyy")',
          position: '@integer(1, 3)',
          status: 'Đang hoạt động',
          title: '@title(5,10)'
        }
      ]
    })
  )
}

const { result_code } = config
const timeout = 1000
export default [
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
  }
]
