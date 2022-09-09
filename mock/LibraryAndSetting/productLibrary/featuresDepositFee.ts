import Mock from 'mockjs'
const featuresDepositFee: {
  id: number
  managementCode: string
  featureGroup: string
  quantityTo: number
  productCategoryUnit: string
  depositFee: number
  status: string
  businessManagement: boolean
}[] = []
const status = ['Đã duyệt', 'Chờ duyệt']
for (let i = 0; i < 100; i++) {
  const random = Math.floor(Math.random() * status.length)
  featuresDepositFee.push(
    Mock.mock({
      id: i,
      managementCode: '@sentence(3, 5)',
      featureGroup: '@sentence(3, 5)',
      quantityTo: '@natural(20,30)',
      productCategoryUnit: 'Chiếc',
      depositFee: '@natural(1,100)',
      status: status[random],
      businessManagement: '@boolean'
    })
  )
}
export { featuresDepositFee }
