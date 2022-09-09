import Mock from 'mockjs'
const featuresPawnFee: {
  id: number
  managementCode: string
  featureGroup: string
  quantityTo: number
  productCategoryUnit: string
  interest: number
  InsuranceMoney: number
  intoMoney: number
  status: string
  businessManagement: boolean
}[] = []
const status = ['Đã duyệt', 'Chờ duyệt']
for (let i = 0; i < 100; i++) {
  const random = Math.floor(Math.random() * status.length)
  featuresPawnFee.push(
    Mock.mock({
      id: i,
      managementCode: '@sentence(3, 5)',
      featureGroup: '@sentence(3, 5)',
      quantityTo: '@natural(20,30)',
      productCategoryUnit: 'Chiếc',
      interest: '@natural(20,30)',
      InsuranceMoney: '@natural(20,30)',
      intoMoney: '@natural(20,30)',
      status: status[random],
      businessManagement: '@boolean'
    })
  )
}
export { featuresPawnFee }
