/* eslint-disable prefer-const */
import Mock from 'mockjs'
interface BrandCategoriesList {
  id: string
  image: string
  createDate: Date
  position: number
  status: string
  title: string
  children: Array<BrandCategoriesList>
}
let BrandCategoriesList: BrandCategoriesList[] = []
for (let i = 0; i < 15; i++) {
  BrandCategoriesList.push(
    Mock.mock({
      id: i,
      image: 'https://menback.com/wp-content/uploads/2020/03/louis-vuitton-logo.jpg',
      createDate: '@date("dd/MM/yyyy")',
      position: '@integer(1, 3)',
      status: 'Đang hoạt động',
      title: '@title(5, 10)',
      children: [
        {
          id: ++i,
          image: 'https://wallpaperaccess.com/full/2038093.jpg',
          createDate: '@date("dd/MM/yyyy")',
          position: '@integer(1, 3)',
          status: 'Đang hoạt động',
          title: '@title(5,10)'
        },
        {
          id: ++i,
          image:
            'https://sidoni.net/upload/baiquet/hinhnd/lich-su-thuong-hieu-versace-y-nghia-bieu-tuong-cua-thuong-hieu-versace4.jpg',
          createDate: '@date("dd/MM/yyyy")',
          position: '@integer(1, 3)',
          status: 'Đang hoạt động',
          title: '@title(5,10)'
        }
      ]
    })
  )
}
export { BrandCategoriesList }
