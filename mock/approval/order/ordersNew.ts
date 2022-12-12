const OrderNew: {
  id: number
  orderCode: Date
  orderType: string
  customer: string
  createdAt: string
  createdBy: string
  browsingConditions: number
  status: number
}[] = []

const OrderNewListMock = {
  id: '@id',
  orderCode: '@natural(100,200)',
  orderType: '@natural',
  customer: '@name',
  createdAt: '@date("dd/MM/yyyy")',
  createdBy: '@name',
  browsingConditions: '@natural(1,5)',
  status: '@natural(1,3)'
}

export { OrderNew, OrderNewListMock }
