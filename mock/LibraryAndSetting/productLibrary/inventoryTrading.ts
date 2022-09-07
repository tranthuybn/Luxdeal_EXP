import Mock from 'mockjs'
const inventoryTrading: {
  managementCode: string
  featureGroup: string
  quantitySold: number
  numberOfTimesRented: number
  numberOfTimesDeposited: number
  numberOfTimesPawn: number
  numberOfTimesSpa: number
  internalInventory: number
  consignmentInventory: number
  pawnInventory: number
  spaInventory: number
  currentlyLeased
  total: number
  productCategoryUnit: string
}[] = []
inventoryTrading.push(
  Mock.mock({
    managementCode: '@sentence(3, 5)',
    featureGroup: '@sentence(3, 5)',
    quantitySold: '@natural(20,30)',
    numberOfTimesRented: '@natural(20,30)',
    numberOfTimesDeposited: '@natural(20,30)',
    numberOfTimesPawn: '@natural(20,30)',
    numberOfTimesSpa: '@natural(20,30)',
    internalInventory: '@natural(20,30)',
    consignmentInventory: '@natural(20,30)',
    pawnInventory: '@natural(20,30)',
    spaInventory: '@natural(20,30)',
    currentlyLeased: '@natural(20,30)',
    total: '@natural(20,30)',
    productCategoryUnit: 'Chiếc'
  })
)

export { inventoryTrading }
