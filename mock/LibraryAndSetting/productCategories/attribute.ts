/* eslint-disable prefer-const */
import Mock from 'mockjs'
interface ColorCategoriesList {
  id: string
  image: string
  createDate: Date
  position: number
  status: string
  title: string
  children: Array<ColorCategoriesList>
}

let ColorCategoriesList: ColorCategoriesList[] = []
for (let i = 0; i < 15; i++) {
  ColorCategoriesList.push(
    Mock.mock({
      id: i,
      image: 'https://www.colorcombos.com/images/colors/42280E.png',
      createDate: '@date("dd/MM/yyyy")',
      position: '@integer(1, 3)',
      status: 'Đang hoạt động',
      title: '@title(5, 10)',
      children: [
        {
          id: ++i,
          image: 'https://www.colorcombos.com/images/colors/5F1E02.png',
          createDate: '@date("dd/MM/yyyy")',
          position: '@integer(1, 3)',
          status: 'Đang hoạt động',
          title: '@title(5,10)'
        },
        {
          id: ++i,
          image: 'https://www.colorcombos.com/images/colors/9C2A00.png',
          createDate: '@date("dd/MM/yyyy")',
          position: '@integer(1, 3)',
          status: 'Đang hoạt động',
          title: '@title(5,10)'
        }
      ]
    })
  )
}
interface SizeCategoriesList {
  id: string
  image: string
  createDate: Date
  position: number
  status: string
  title: string
  children: Array<SizeCategoriesList>
}
let SizeCategoriesList: SizeCategoriesList[] = []
for (let i = 0; i < 15; i++) {
  SizeCategoriesList.push(
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
interface MaterialCategoriesList {
  id: string
  image: string
  createDate: Date
  position: number
  status: string
  title: string
  children: Array<MaterialCategoriesList>
}
let MaterialCategoriesList: MaterialCategoriesList[] = []
for (let i = 0; i < 15; i++) {
  MaterialCategoriesList.push(
    Mock.mock({
      id: i,
      image:
        'https://5.imimg.com/data5/SELLER/Default/2021/1/FY/UQ/FQ/84248060/100-cotton-fabric-500x500.jpg',
      createDate: '@date("dd/MM/yyyy")',
      position: '@integer(1, 3)',
      status: 'Đang hoạt động',
      title: '@title(5, 10)',
      children: [
        {
          id: ++i,
          image: 'https://2.imimg.com/data2/KK/KK/MY-2264940/cotton-fabrics-500x500.jpg',
          createDate: '@date("dd/MM/yyyy")',
          position: '@integer(1, 3)',
          status: 'Đang hoạt động',
          title: '@title(5,10)'
        },
        {
          id: ++i,
          image: 'https://5.imimg.com/data5/UU/MB/MY-4317799/plain-cotton-fabric-500x500.jpg',
          createDate: '@date("dd/MM/yyyy")',
          position: '@integer(1, 3)',
          status: 'Đang hoạt động',
          title: '@title(5,10)'
        }
      ]
    })
  )
}
interface StatusCategoriesList {
  id: string
  image: string
  createDate: Date
  position: number
  status: string
  title: string
  children: Array<StatusCategoriesList>
}
let StatusCategoriesList: StatusCategoriesList[] = []

for (let i = 0; i < 15; i++) {
  StatusCategoriesList.push(
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
interface GenderCategoriesList {
  id: string
  image: string
  createDate: Date
  position: number
  status: string
  title: string
  children: Array<GenderCategoriesList>
}
let GenderCategoriesList: GenderCategoriesList[] = []
for (let i = 0; i < 15; i++) {
  GenderCategoriesList.push(
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
export {
  ColorCategoriesList,
  SizeCategoriesList,
  MaterialCategoriesList,
  StatusCategoriesList,
  GenderCategoriesList
}
