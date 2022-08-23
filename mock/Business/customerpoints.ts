const customerPointsList: {
  customerCode: string
  customerName: string
  totalRechargePoints: number
  pointsUsed: number
  remainingPoints: number
  mostRecentChange: Date
  status: boolean
}[] = []

const customerPointsListMock = {
  customerCode: '@string(10,20)',
  customerName: '@string(10,20)',
  totalRechargePoints: '@natural',
  pointsUsed: '@natural',
  remainingPoints: '@natural',
  mostRecentChange: '@date("dd/MM/yyyy")',
  status: '@boolean()'
}
export { customerPointsList, customerPointsListMock }
