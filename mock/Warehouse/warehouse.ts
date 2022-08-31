const warehouseList: {
  id: number
  productCode: string
  managementCode: string
  productName: string
  characteristic: string
  description: string
  accessory: string
  firstEntryDate: Date
  singleEntryCode: string
  typeOfFirstEntry: string
  typeOfTransfer: string
  warehouseManagement: string
  location: string
  amountImport: number
  dram: string
  inventory: number
  priceImport: number
  CashIntoInventory: string
  businessManagement: string
  stockCard: string
  status: string
}[] = []

const warehouseListMock = {
  id: '@id',
  productCode: '@natural',
  managementCode: '@natural',
  productName: '@string',
  characteristic: '@string',
  description: '@name',
  accessory: '@string',
  firstEntryDate: '@date("dd/MM/yyyy")',
  singleEntryCode: '@string',
  typeOfFirstEntry: '@string',
  typeOfTransfer: '@string',
  warehouseManagement: '@string',
  location: '@string',
  amountImport: '@natural',
  dram: '@natural',
  inventory: '@natural',
  priceImport: '@natural',
  CashIntoInventory: '@natural',
  businessManagement: '@string(5,15)',
  stockCard: '@string(5,10)',
  status: '@string(5,10)'
}

export { warehouseList, warehouseListMock }
