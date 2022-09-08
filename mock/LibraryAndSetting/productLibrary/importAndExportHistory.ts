import Mock from 'mockjs'
const importAndExportHistory: {
  id: number
  importExportDate: Date
  importExportCode: string
  importExportForm: string
  importExportWarehouse: string
  internalWarehouse: number
  consignmentWarehouse: number
  pawnStore: number
  spaWarehouse: number
  totalInventory: number
  dram: string
}[] = []
for (let i = 0; i < 100; i++) {
  importAndExportHistory.push(
    Mock.mock({
      id: i,
      importExportDate: '@date("dd/MM/yyyy")',
      importExportCode: '@string(10,20)',
      importExportForm: '@string(10,20)',
      importExportWarehouse: '@string(10,20)',
      internalWarehouse: '@natural(0,3000) đ',
      consignmentWarehouse: '@natural(0,3000) đ',
      pawnStore: '@natural(0,3000) đ',
      spaWarehouse: '@natural(0,3000) đ',
      totalInventory: '@natural(0,3000) đ',
      dram: 'Chiếc'
    })
  )
}
export { importAndExportHistory }
