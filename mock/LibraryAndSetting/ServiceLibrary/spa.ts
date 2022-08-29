import Mock from 'mockjs'
const SpaLibrary: {
  id: string
  serviceCode: string
  serviceName: string
  description: string
  unitPrice: number
  time: Date
  insurance: string
  image: string
  createDate: Date
  creator: string
  status: string
}[] = []
const status = ['Đang hoạt động', 'Chờ duyệt', 'Ngưng hoạt động']
for (let i = 0; i < 100; i++) {
  const random = Math.floor(Math.random() * status.length)
  SpaLibrary.push(
    Mock.mock({
      id: i,
      createDate: '@date("dd/MM/yyyy")',
      serviceCode: '@sentence(3, 5)',
      serviceName: '@sentence(3, 5)',
      description: '@sentence(3, 5)',
      unitPrice: '@natural(0,10000) đ',
      time: '@natural(0,20)',
      insurance: '@natural(0,20)',
      image: '@image',
      creator: '@first',
      status: status[random]
    })
  )
}
export { SpaLibrary }
