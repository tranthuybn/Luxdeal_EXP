/* eslint-disable prefer-const */
import Mock from 'mockjs'
interface UnitCategoriesList {
  id: string
  image: string
  createDate: Date
  position: number
  status: string
  title: string
  children: Array<UnitCategoriesList>
}
let UnitCategoriesList: UnitCategoriesList[] = []
for (let i = 0; i < 15; i++) {
  UnitCategoriesList.push(
    Mock.mock({
      id: i,
      image: 'https://protkd.com/wp-content/uploads/2017/04/default-image.jpg',
      createDate: '@date("dd/MM/yyyy")',
      position: '@integer(1, 3)',
      status: 'Đang hoạt động',
      title: '@title(5, 10)',
      children: [
        {
          id: ++i,
          image: 'https://protkd.com/wp-content/uploads/2017/04/default-image.jpg',
          createDate: '@date("dd/MM/yyyy")',
          position: '@integer(1, 3)',
          status: 'Đang hoạt động',
          title: '@title(5,10)'
        },
        {
          id: ++i,
          image: 'https://protkd.com/wp-content/uploads/2017/04/default-image.jpg',
          createDate: '@date("dd/MM/yyyy")',
          position: '@integer(1, 3)',
          status: 'Đang hoạt động',
          title: '@title(5,10)'
        }
      ]
    })
  )
}
export { UnitCategoriesList }
