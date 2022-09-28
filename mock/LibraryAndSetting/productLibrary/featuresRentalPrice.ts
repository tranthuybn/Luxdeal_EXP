import Mock from 'mockjs'
const featuresRentalPrice: {
  id: number
  managementCode: string
  featureGroup: string
  quantityTo: number
  productCategoryUnit: string
  dayRentalUnitPrice: number
  weeklyRent: number
  monthlyRent: number
  rentDeposit: number
  createDate: Date
  status: string
  businessManagement: boolean
}[] = []
const status = ['Đã Duyệt', 'Chờ duyệt']
for (let i = 0; i < 100; i++) {
  const random = Math.floor(Math.random() * status.length)
  featuresRentalPrice.push(
    Mock.mock({
      id: i,
      managementCode: '@sentence(3, 5)',
      featureGroup: '@sentence(3, 5)',
      quantityTo: '@natural(20,30)',
      productCategoryUnit: 'Chiếc',
      dayRentalUnitPrice: '@natural(0,3000) đ',
      weeklyRent: '@natural(0,3000) đ',
      monthlyRent: '@natural(0,3000) đ',
      rentDeposit: '@natural(0,3000) đ',
      createDate: '@date("dd/MM/yyyy")',
      status: status[random],
      businessManagement: '@boolean'
    })
  )
}
export { featuresRentalPrice }
