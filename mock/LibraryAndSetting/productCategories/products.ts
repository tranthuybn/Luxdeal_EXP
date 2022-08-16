import { toAnyString } from '@/utils'
import Mock from 'mockjs'
const productList: {
  id: string
  createDate: Date
  position: number
  status: string
  title: string
  children: [{}]
}[] = []

const productListMock = {
  id: toAnyString(),
  createDate: '@date("dd/MM/yyyy")',
  position: '@integer(1, 3)',
  status: 'Đang hoạt động',
  title: '@title(5, 10)',
  children: [
    {
      id: toAnyString(),
      createDate: '@date("dd/MM/yyyy")',
      position: '@integer(1, 3)',
      status: 'Đang hoạt động',
      title: '@title(5,10)'
    }
  ]
}

for (let i = 0; i < 100; i++) {
  productList.push(
    Mock.mock({
      id: i,
      createDate: '@date("dd/MM/yyyy")',
      position: '@integer(1, 3)',
      status: 'Đang hoạt động',
      title: '@title(5, 10)',
      children: [
        {
          id: ++i,
          createDate: '@date("dd/MM/yyyy")',
          position: '@integer(1, 3)',
          status: 'Đang hoạt động',
          title: '@title(5,10)'
        },
        {
          id: ++i,
          createDate: '@date("dd/MM/yyyy")',
          position: '@integer(1, 3)',
          status: 'Đang hoạt động',
          title: '@title(5,10)'
        }
      ]
    })
  )
}
export { productList }
