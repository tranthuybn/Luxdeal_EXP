import Mock from 'mockjs'

interface PoliciesGuidelines {
  id: Number
  title: string
  content: string
  type: string
  show: string
  image: string
  createDate: Date
  creator: string
  status: string
}

const count = 77
const PoliciesGuidelinesList: PoliciesGuidelines[] = []
for (let i = 0; i < count; i++) {
  PoliciesGuidelinesList.push(
    Mock.mock({
      id: i,
      title: '@string(5,10)',
      content: '@string(10,20)',
      type: '@string(10,20)',
      show: '@integer(0,10)',
      image: '@image',
      createDate: '@date("dd/MM/yyyy")',
      creator: '@first',
      status: 'Chờ duyệt'
    })
  )
}

export { PoliciesGuidelinesList }
