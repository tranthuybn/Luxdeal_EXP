const customerVirtualWalletList: {
  id: number
  customerCode: string
  customerName: string
  totalRecharge: number
  usedMoney: number
  cashReturn: number
  mostRecentChange: Date
  status: boolean
  amountOfMoney: string
  codeRequest: string
  attachments: string
  receiptOrPayment: string
  paymentProposal: string
  alreadyPaidForTt: boolean
  updatedAt: Date
  creator: string
  start: Date
  end: Date
  description: string
  moneyPaymentCode: string
}[] = []

const customerVirtualWalletListMock = {
  id: '@id',
  customerCode: '@string(10,20)',
  customerName: '@string(10,20)',
  totalRecharge: '@natural',
  amountOfMoney: '100.000.000đ',
  codeRequest: '@string(10,20)',
  attachments: '@string(10,20)',
  receiptOrPayment: '@string(10,20)',
  paymentProposal: 'Không',
  alreadyPaidForTt: '@boolean()',
  updatedAt: '@date',
  creator: '@first',
  usedMoney: '@natural',
  cashReturn: '@natural',
  mostRecentChange: '@date("dd/MM/yyyy")',
  status: '@boolean()',
  start: '@date',
  end: '@date',
  description: '@string(10,50)',
  moneyPaymentCode: '@string(10,20)'
}
export { customerVirtualWalletList, customerVirtualWalletListMock }
