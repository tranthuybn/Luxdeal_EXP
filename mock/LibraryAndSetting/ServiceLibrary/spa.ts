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
      unitPrice: '@natural(20,30)',
      time: '@date("dd/MM/yyyy")',
      insurance: '@string',
      image: 'https://protkd.com/wp-content/uploads/2017/04/default-image.jpg',
      creator: '@first',
      status: status[random]
    })
  )
}
export { SpaLibrary }
