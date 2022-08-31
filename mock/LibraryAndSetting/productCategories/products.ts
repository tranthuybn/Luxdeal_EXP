/* eslint-disable prefer-const */
import Mock from 'mockjs'
interface productList {
  id: string
  image: string
  createDate: Date
  position: number
  status: string
  title: string
  children: Array<productList>
}
const count = 77
let productList: productList[] = []
for (let i = 0; i < count; i++) {
  productList.push(
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
export { productList }
