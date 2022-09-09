import Mock from 'mockjs'
const priceByQuantity: {
  id: number
  quantityTo: number
  dayRentalUnitPrice: string
  weeklyRent: number
  monthlyRent: number
  rentDeposit: Date
  adjustmentDate: string
}[] = []
for (let i = 0; i < 100; i++) {
  priceByQuantity.push(
    Mock.mock({
      id: i,
      quantityTo: '@natural(20,30)',
      dayRentalUnitPrice: '@natural(0,3000) đ',
      weeklyRent: '@natural(0,3000) đ',
      monthlyRent: '@natural(0,3000) đ',
      rentDeposit: '@natural(0,3000) đ',
      adjustmentDate: '@date("dd/MM/yyyy")'
    })
  )
}
export { priceByQuantity }
