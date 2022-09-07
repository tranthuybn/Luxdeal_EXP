import Mock from 'mockjs'
const featuresPrices: {
  managementCode: string
  featureGroup: string
  quantityTo: number
  productCategoryUnit: string
  unitPrices: number
  promotionPrice: number
  createDate: Date
  status: string
  businessManagement: boolean
}[] = []
const status = ['Đã duyệt', 'Chờ duyệt']
for (let i = 0; i < 100; i++) {
  const random = Math.floor(Math.random() * status.length)
  featuresPrices.push(
    Mock.mock({
      managementCode: '@sentence(3, 5)',
      featureGroup: '@sentence(3, 5)',
      quantityTo: '@natural(20,30)',
      productCategoryUnit: 'Chiếc',
      unitPrices: '@natural(0,3000) đ',
      promotionPrice: '@natural(0,3000) đ',
      createDate: '@date("dd/MM/yyyy")',
      status: status[random],
      businessManagement: '@boolean'
    })
  )
}
export { featuresPrices }
