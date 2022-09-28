const NotificationList: {
  id: number
  notificationCode: string
  title: string
  shortDescription: string
  notificationType: string
  subject: string
  image: string
  sendDate: string
  createDate: Date
  creator: string
  status: string
}[] = []
const NotificationListMock = {
  id: '@id',
  notificationCode: '@string(5,10)',
  title: '@title',
  shortDescription: '@string(10,20)',
  notificationType: 'Tự động',
  subject: '@string(10,20)',
  image: '@image',
  sendDate: '@date("dd/MM/yyyy")',
  createDate: '@date("dd/MM/yyyy")',
  creator: '@first',
  status: 'Đã gửi'
}
export { NotificationList, NotificationListMock }
