import Mock from 'mockjs'
const featuresPrices: {
  id: number
  managementCode: string
  featureGroup: string
  quantityTo: number
  productCategoryUnit: string
  unitPrices: number
  promotionPrice: number
  createDate: Date
  status: string
  switch: boolean
  childrenTable: any
}[] = []
const status = ['Đã duyệt', 'Chờ duyệt']
for (let i = 0; i < 100; i++) {
  const random = Math.floor(Math.random() * status.length)
  featuresPrices.push(
    Mock.mock({
      id: i,
      managementCode: '@sentence(3, 5)',
      featureGroup: '@sentence(3, 5)',
      quantityTo: '@natural(20,30)',
      unitPrices: '@natural(0,3000) đ',
      promotionPrice: '@natural(0,3000) đ',
      createDate: '@date("dd/MM/yyyy")',
      status: status[random],
      switch: '@boolean',
      childrenTable: [
        {
          id: '@id',
          quantityTo: '@natural(20,30)',
          unitPrices: '@natural(0,3000) đ',
          promotionPrice: '@natural(0,3000) đ'
        }
      ]
    })
  )
}
export { featuresPrices }
