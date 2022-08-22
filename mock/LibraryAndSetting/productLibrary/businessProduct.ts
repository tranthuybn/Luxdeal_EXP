import Mock from 'mockjs'
const BusinessProductLibrary: {
  id: string
  createDate: Date
  productCode: string
  productName: string
  description: string
  category: string
  image: string
  creator: string
  status: string
}[] = []

for (let i = 0; i < 15; i++) {
  BusinessProductLibrary.push(
    Mock.mock({
      id: i,
      createDate: '@date("dd/MM/yyyy")',
      productCode: '@sentence(3, 5)',
      productName: '@sentence(3, 5)',
      description: '@sentence(3, 5)',
      category: '@sentence(3, 5)',
      image: 'https://protkd.com/wp-content/uploads/2017/04/default-image.jpg',
      creator: '@first',
      status: 'Đang hoạt động'
    })
  )
}
export { BusinessProductLibrary }
