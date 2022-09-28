/* eslint-disable prefer-const */
import Mock from 'mockjs'
interface productStorageList {
  id: number
  image: string
  createDate: Date
  status: Array<string>
  title: string
  children: Array<productStorageList>
}
const count = 77
let productStorageList: productStorageList[] = []
for (let i = 0; i < count; i++) {
  productStorageList.push(
    Mock.mock({
      id: i,
      image: '@image',
      createDate: '@date("dd/MM/yyyy")',
      status: ['Đang hoạt động'],
      title: '@title(5, 10)',
      children: [
        {
          id: ++i,
          image: '@image',
          createDate: '@date("dd/MM/yyyy")',
          status: ['Đang hoạt động'],
          title: '@title(5,10)'
        },
        {
          id: ++i,
          image: '@image',
          createDate: '@date("dd/MM/yyyy")',
          status: ['Đang hoạt động'],
          title: '@title(5,10)'
        }
      ]
    })
  )
}
export { productStorageList }
