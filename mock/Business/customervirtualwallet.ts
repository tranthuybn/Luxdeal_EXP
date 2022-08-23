const customerVirtualWalletList: {
  customerCode: string
  customerName: string
  totalRecharge: number
  usedMoney: number
  cashReturn: number
  mostRecentChange: Date
  status: boolean
}[] = []

const customerVirtualWalletListMock = {
  customerCode: '@string(10,20)',
  customerName: '@string(10,20)',
  totalRecharge: '@natural',
  usedMoney: '@natural',
  cashReturn: '@natural',
  mostRecentChange: '@date("dd/MM/yyyy")',
  status: '@boolean()'
}
export { customerVirtualWalletList, customerVirtualWalletListMock }
