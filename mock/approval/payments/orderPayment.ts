const payment: {
  id: number
  PaymentRequestCode: string
  TypeOfferPayment: string
  customer: string
  createdAt: string
  createdBy: string
  browsingConditions: number
  status: number
}[] = []

const OrderPaymentsListMock = {
  id: '@id',
  PaymentRequestCode: '@natural(100,200)',
  TypeOfferPayment: '@natural',
  customer: '@name',
  createdAt: '@date("dd/MM/yyyy")',
  createdBy: '@name',
  browsingConditions: '@natural(1,5)',
  status: '@natural(1,3)'
}

export { payment, OrderPaymentsListMock }
