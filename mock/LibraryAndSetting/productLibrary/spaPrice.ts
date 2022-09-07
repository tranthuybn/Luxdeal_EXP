import Mock from 'mockjs'
const spaPrice: {
  managementCode: string
  serviceOrGroupService: string
  spaTime: number
  numberUses: number
  spaPrice: string
  status: string
  businessManagement: boolean
}[] = []
const status = ['Đã duyệt', 'Chờ duyệt']
for (let i = 0; i < 100; i++) {
  const random = Math.floor(Math.random() * status.length)
  spaPrice.push(
    Mock.mock({
      managementCode: '@sentence(3, 5)',
      serviceOrGroupService: '@sentence(3, 5)',
      spaTime: '@natural(20,30)',
      numberUses: '@natural(1,100)',
      spaPrice: '@natural(0,3000) đ',
      status: status[random],
      businessManagement: '@boolean'
    })
  )
}
export { spaPrice }
