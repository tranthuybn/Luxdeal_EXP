import Mock from 'mockjs'
const productList: {
  id: string
  createDate: Date
  position: number
  status: string
  title: string
  children: [{}]
}[] = []

for (let i = 0; i < 100; i++) {
  productList.push(
    Mock.mock({
      id: i,
      image: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      createDate: '@date("dd/MM/yyyy")',
      position: '@integer(1, 3)',
      status: 'Đang hoạt động',
      title: '@title(5, 10)',
      children: [
        {
          id: ++i,
          image:
            'https://static.scientificamerican.com/sciam/cache/file/7A715AD8-449D-4B5A-ABA2C5D92D9B5A21_source.png',
          createDate: '@date("dd/MM/yyyy")',
          position: '@integer(1, 3)',
          status: 'Đang hoạt động',
          title: '@title(5,10)'
        },
        {
          id: ++i,
          image:
            'https://www.thoughtco.com/thmb/YkksU0Xy_2kfdDolJLPja7NM8jI=/2121x1193/smart/filters:no_upscale()/swallowGE-57a109323df78c3276f5b8a0.jpg',
          createDate: '@date("dd/MM/yyyy")',
          position: '@integer(1, 3)',
          status: 'Đang hoạt động',
          title: '@title(5,10)'
        }
      ]
    })
  )
}
export { productList }
