const warehouseList: {
  productCode: string
  managementCode: string
  productInformation: string
  characteristic: string
  accessory: string
  firstEntryDate: Date
  singleEntryCode: string
  typeOfFirstEntry: string
  typeOfTransfer: string
  warehouseManagement: string
  location: string
  amountImport: number
  inventory: number
  priceImport: number
  CashIntoInventory: string
  businessManagement: string
  stockCard: string
  status: string
}[] = []

const warehouseListMock = {
  productCode: '@natural',
  managementCode: '@natural',
  productInformation: '@string',
  characteristic: '@string',
  accessory: '@string',
  firstEntryDate: '@date("dd/MM/yyyy")',
  singleEntryCode: '@string',
  typeOfFirstEntry: '@string',
  typeOfTransfer: '@string',
  warehouseManagement: '@string',
  location: '@string',
  amountImport: '@natural',
  inventory: '@natural',
  priceImport: '@natural',
  CashIntoInventory: '@natural',
  businessManagement: '@string(5,15)',
  stockCard: '@string(5,10)',
  status: '@string(5,10)'
}

export { warehouseList, warehouseListMock }
