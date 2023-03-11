const employeeRatingList: {
  employeeCode: string
  employeeName: string
  phoneNumber: string
  email: string
  branch: string
  department: string
  typeEmployee: string
  rankEmployee:string
  orderCode: string
  orderValue: number
  percentageSale: number
  sales: number
  dateOrder: string
  }[] = []
  

const employeeRatingListMock = {
  employeeCode: '@string(10,20)',
  employeeName: '@string(10,20)',
  phoneNumber: '@string(10,20)',
  email: '@string(10,20)',
  branch: '@string(10,20)',
  department: '@string(10,20)',
  typeEmployee: '@string(10,20)',
  rankEmployee:'@string(10,20)',
  orderCode: '@string(10,20)',
  orderValue: '@natural',
  percentageSale: '@natural',
  sales: '@natural',
  dateOrder: '@string(10,20)',

}
  export { employeeRatingList, employeeRatingListMock }