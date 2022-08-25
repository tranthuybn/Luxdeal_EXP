const auctionList: {
  createDate: Date
  auctionCode: string
  descriptions: string
  productCode: string
  start: Date
  doneLabel: Date
  comboPrice: number
  floorPrice: number
  priceStep: number
  highestBid: number
  joined: number
  result: boolean
  status: boolean
}[] = []

const auctionListMock = {
  createDate: '@date("dd/MM/yyyy")',
  auctionCode: '@natural',
  descriptions: '@string(10,20)',
  productCode: '@natural',
  start: '@date("dd/MM/yyyy")',
  doneLabel: '@date("dd/MM/yyyy")',
  comboPrice: '@natural(10,100000)',
  floorPrice: '@natural(10,100000)',
  priceStep: '@natural(10,100000)',
  highestBid: '@natural(10,100000)',
  joined: '@natural(10,100000)',
  result: '@boolean',
  status: '@boolean'
}

export { auctionList, auctionListMock }
