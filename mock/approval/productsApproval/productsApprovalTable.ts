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
  productName: '@natural',
  description: '@natural',
  category: '@natural',
  image: '@image',
  status: 'Chờ duyệt'
}
export { ProductsApprovalList, ProductsApprovalListMock }
