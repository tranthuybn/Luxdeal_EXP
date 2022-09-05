const members: {
  id: number
  fullName: string
  accountName: string
  wallpaper: string
  avatar: string
  isPostProhibit: boolean
  email: string
  phone: string
}[] = []
const MemberListMock = {
  id: '@id',
  fullName: '@first',
  accountName: '@last',
  avatar: '@image',
  wallpaper: '@image',
  subject: '@string(10,20)',
  image: '@image',
  isPostProhibit: false,
  createDate: '@date("dd/MM/yyyy")',
  email: '@email',
  phone: '@integer(0,10000)'
}
export { members, MemberListMock }
