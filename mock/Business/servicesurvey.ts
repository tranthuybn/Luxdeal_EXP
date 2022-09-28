const servicesurveyList: {
  id: number
  surveyDate: Date
  customerName: string
  orderCode: string
  service: string
  serviceRating: number
  surveyContent: string
  picture: string
  status: boolean
}[] = []

const servicesurveyListMock = {
  id: '@id',
  surveyDate: '@date("dd/MM/yyyy")',
  customerName: '@name',
  orderCode: '@natural',
  service: '@string(10,20)',
  serviceRating: '@natural(1,5)',
  surveyContent: '@string(20,30)',
  picture: '@image',
  status: '@boolean'
}

export { servicesurveyList, servicesurveyListMock }
