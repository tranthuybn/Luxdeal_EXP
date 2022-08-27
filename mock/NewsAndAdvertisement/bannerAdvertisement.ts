const bannerAdvertisementList: {
  bannerCode: string
  shortDescription: string
  linkBanner: string
  image: string
  position: string
  startDate: Date
  endDate: Date
  createDate: Date
  creator: string
  status: string
}[] = []
const bannerAdvertisementListMock = {
  bannerCode: '@string(5,10)',
  linkBanner: '@url',
  shortDescription: '@string(10,20)',
  position: '@integer(0,10)',
  image: '@image',
  startDate: '@date("dd/MM/yyyy")',
  endDate: '@date("dd/MM/yyyy")',
  createDate: '@date("dd/MM/yyyy")',
  creator: '@first',
  status: 'Chờ duyệt'
}
export { bannerAdvertisementList, bannerAdvertisementListMock }
