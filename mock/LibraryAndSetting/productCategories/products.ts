/* eslint-disable prefer-const */
import Mock from 'mockjs'
import { type } from 'os'
interface productList {
  id: string
  image: string
  createDate: Date
  position: number
  status: string
  title: string
  children: Array<productList>
}

let productList: productList[] = []
for (let i = 0; i < 15; i++) {
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
interface SpaProductList {
  id: string
  image: string
  createDate: Date
  position: number
  status: string
  title: string
  children: Array<SpaProductList>
}
let SpaProductList: SpaProductList[] = []

for (let i = 0; i < 15; i++) {
  if (SpaProductList !== undefined) {
    SpaProductList?.push(
      Mock.mock({
        id: i,
        image:
          'https://ap.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-petite-malle-v-monogram-handbags--M46309_PM2_Front%20view.png?wid=656&hei=656',
        createDate: '@date("dd/MM/yyyy")',
        position: '@integer(1, 3)',
        status: 'Đang hoạt động',
        title: '@title(5, 10)',
        children: [
          {
            id: ++i,
            image:
              'https://ap.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-petite-malle-v-monogram-handbags--M46309_PM1_Side%20view.png?wid=656&hei=656',
            createDate: '@date("dd/MM/yyyy")',
            position: '@integer(1, 3)',
            status: 'Đang hoạt động',
            title: '@title(5,10)'
          },
          {
            id: ++i,
            image:
              'https://ap.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-petite-malle-v-monogram-handbags--M46309_PM1_Other%20view.png?wid=656&hei=656',
            createDate: '@date("dd/MM/yyyy")',
            position: '@integer(1, 3)',
            status: 'Đang hoạt động',
            title: '@title(5,10)'
          }
        ]
      })
    )
  }
}
interface PropertyProductList {
  id: string
  image: string
  createDate: Date
  position: number
  status: string
  title: string
  children: Array<PropertyProductList>
}
let PropertyProductList: PropertyProductList[] = []
for (let i = 0; i < 15; i++) {
  PropertyProductList.push(
    Mock.mock({
      id: i,
      image:
        'https://ap.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-cit%C3%A9-monogram-handbags--M46321_PM2_Front%20view.png?wid=656&hei=656',
      createDate: '@date("dd/MM/yyyy")',
      position: '@integer(1, 3)',
      status: 'Đang hoạt động',
      title: '@title(5, 10)',
      children: [
        {
          id: ++i,
          image:
            'https://ap.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-cit%C3%A9-monogram-handbags--M46321_PM1_Side%20view.png?wid=656&hei=656',
          createDate: '@date("dd/MM/yyyy")',
          position: '@integer(1, 3)',
          status: 'Đang hoạt động',
          title: '@title(5,10)'
        },
        {
          id: ++i,
          image:
            'https://ap.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-cit%C3%A9-monogram-handbags--M46321_PM1_Back%20view.png?wid=656&hei=656',
          createDate: '@date("dd/MM/yyyy")',
          position: '@integer(1, 3)',
          status: 'Đang hoạt động',
          title: '@title(5,10)'
        }
      ]
    })
  )
}

export { productList, SpaProductList, PropertyProductList }
