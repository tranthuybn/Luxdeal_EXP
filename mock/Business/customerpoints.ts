const customerPointsList: {
  id: number
  customerCode: string
  customerName: string
  totalRechargePoints: number
  pointsUsed: number
  remainingPoints: number
  mostRecentChange: Date
  status: boolean
  monthlyRevenue: string
  quarterlySales: string
  salesYear: string
  rankMonth: string
  quarterlyRanking: string
  rankingYear: string
}[] = []

const customerPointsListMock = {
  id: '@id',
  customerCode: '@string(10,20)',
  customerName: '@string(10,20)',
  totalRechargePoints: '@natural',
  pointsUsed: '@natural',
  remainingPoints: '@natural',
  mostRecentChange: '@date("dd/MM/yyyy")',
  status: '@boolean()',
  monthlyRevenue: '10.000.000đ',
  quarterlySales: '40.000.000đ',
  salesYear: '100.000.000đ',
  rankMonth: 'Vàng',
  quarterlyRanking: 'Vàng',
  rankingYear: 'Vàng'
}
export { customerPointsList, customerPointsListMock }
