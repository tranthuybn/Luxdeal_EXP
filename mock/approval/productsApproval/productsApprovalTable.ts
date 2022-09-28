const ProductsApprovalList: {
  id: number
  productCode: string
  productName: string
  description: string
  category: string
  image: string
  createDate: Date
  creator: string
  status: string
}[] = []

const ProductsApprovalListMock = {
  id: '@id',
  createDate: '@date("dd/MM/yyyy")',
  creator: '@name',
  productCode: '@natural',
  productName: '@title',
  description: '@paragraph(1)',
  category: '@title',
  image: '@image',
  status: 'Chờ duyệt'
}
export { ProductsApprovalList, ProductsApprovalListMock }
