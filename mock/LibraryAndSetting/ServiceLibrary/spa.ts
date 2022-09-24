import Mock from 'mockjs'
const SpaLibrary: {
  id: string
  code: string
  name: string
  description: string
  cost: number
  time: Date
  warranty: string
  imageList: string
  createdAt: Date
  creator: string
  isActive: string
}[] = []
const status = ['Đang hoạt động', 'Chờ duyệt', 'Ngưng hoạt động']
for (let i = 0; i < 100; i++) {
  const random = Math.floor(Math.random() * status.length)
  SpaLibrary.push(
    Mock.mock({
      id: i,
      createdAt: '@date("dd/MM/yyyy")',
      code: '@sentence(3, 5)',
      name: '@sentence(3, 5)',
      description: '@sentence(3, 5)',
      cost: '@natural(0,10000) đ',
      time: '@natural(0,20)',
      warranty: '@natural(0,20)',
      imageList: '@image',
      creator: '@first',
      isActive: status[random]
    })
  )
}
export { SpaLibrary }
