import Mock from 'mockjs'
const BusinessProductLibrary: {
  id: string
  productCode: string
  productName: string
  description: string
  category: string
  inventory: number
  currentlyLeased: number
  quantitySold: number
  numberOfTimesRented: number
  numberOfTimesDeposited: number
  numberOfTimesPawn: number
  numberOfTimesSpa: number
  setInventoryForSale: string
  setInventoryForRent: string
  sellingPriceFrom: string
  rentalPriceFrom: string
  dram: string
  businessManagement: string
  image: string
  createDate: Date
  creator: string
  status: string
}[] = []
const status = ['Đang hoạt động', 'Chờ duyệt', 'Ngưng hoạt động']
for (let i = 0; i < 100; i++) {
  const random = Math.floor(Math.random() * status.length)
  BusinessProductLibrary.push(
    Mock.mock({
      id: i,
      createDate: '@date("dd/MM/yyyy")',
      productCode: '@sentence(3, 5)',
      productName: '@sentence(3, 5)',
      description: '@sentence(3, 5)',
      category: '@sentence(3, 5)',
      inventory: '@natural(20,30)',
      currentlyLeased: '@natural(20,30)',
      quantitySold: '@natural(20,30)',
      numberOfTimesRented: '@natural(20,30)',
      numberOfTimesDeposited: '@natural(20,30)',
      numberOfTimesPawn: '@natural(20,30)',
      numberOfTimesSpa: '@natural(20,30)',
      setInventoryForSale: 'Còn hàng',
      setInventoryForRent: 'Hết hàng',
      sellingPriceFrom: '@natural(0,3000) đ',
      rentalPriceFrom: '@natural(0,3000) đ',
      dram: 'Chiếc',
      businessManagement: '@sentence(3, 5)',
      image: '@image',
      creator: '@first',
      status: status[random]
    })
  )
}
export { BusinessProductLibrary }
