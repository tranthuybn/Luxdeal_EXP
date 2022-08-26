/* eslint-disable prefer-const */
import Mock from 'mockjs'
interface OriginCategoriesList {
  id: string
  image: string
  createDate: Date
  position: number
  status: string
  title: string
  children: Array<OriginCategoriesList>
}
const count = 77
let OriginCategoriesList: OriginCategoriesList[] = []
for (let i = 0; i < count; i++) {
  OriginCategoriesList.push(
    Mock.mock({
      id: i,
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Flag_of_the_United_States_%28Pantone%29.svg/1200px-Flag_of_the_United_States_%28Pantone%29.svg.png',
      createDate: '@date("dd/MM/yyyy")',
      position: '@integer(1, 3)',
      status: 'Đang hoạt động',
      title: '@title(5, 10)',
      children: [
        {
          id: ++i,
          image:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/2560px-Flag_of_Vietnam.svg.png',
          createDate: '@date("dd/MM/yyyy")',
          position: '@integer(1, 3)',
          status: 'Đang hoạt động',
          title: '@title(5,10)'
        },
        {
          id: ++i,
          image:
            'https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/1200px-Flag_of_the_United_Kingdom.svg.png',
          createDate: '@date("dd/MM/yyyy")',
          position: '@integer(1, 3)',
          status: 'Đang hoạt động',
          title: '@title(5,10)'
        }
      ]
    })
  )
}
export { OriginCategoriesList }
