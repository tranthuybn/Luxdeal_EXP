const flashsaleList: {
  surveyDate: Date
  customerName: string
  orderCode: string
  service: string
  serviceRating: number
  surveyContent: number
  picture: string
  status: boolean
}[] = []

const flashsaleListMock = {
  surveyDate: '@date("dd/MM/yyyy")',
  customerName: '@name',
  orderCode: '@natural',
  service: '@string(10,20)',
  serviceRating: '@misc',
  surveyContent: '@misc',
  picture: '@image',
  status: '@boolean'
}

export { flashsaleList, flashsaleListMock }
