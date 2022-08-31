import Mock from 'mockjs'
interface News {
  id: Number
  title: string
  shortDescription: string
  category: string
  show: string
  image: string
  createDate: Date
  creator: string
  status: string
}

const count = 77
const NewsList: News[] = []
for (let i = 0; i < count; i++) {
  NewsList.push(
    Mock.mock({
      id: i,
      title: '@string(5,10)',
      shortDescription: '@string(10,20)',
      category: '@category',
      show: '@integer(0,10)',
      image: '@image',
      createDate: '@date("dd/MM/yyyy")',
      creator: '@first',
      status: 'Chờ duyệt'
    })
  )
}

export { NewsList }
