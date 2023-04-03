import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
interface Filter {
  text: string
  value: any
}
export const filterLotStatus: Array<Filter> = [
  { text: t('reuse.inStock'), value: 1 },
  { text: t('reuse.outOfStockInventory'), value: 2 },
  { text: t('reuse.exporting'), value: 3 },
  { text: t('reuse.importing'), value: 4 }
]
export const filterPaymentCheckbox: Array<Filter> = [
  { text: t('reuse.alreadyPaid'), value: true },
  { text: t('reuse.notPaid'), value: false }
]
export const filterPaymentWalletStatus: Array<Filter> = [
  { text: t('reuse.waitingConfirm'), value: 1 },
  { text: t('reuse.confirmed'), value: 2 },
  { text: t('common.doneLabel'), value: 3 },
  { text: t('reuse.cancelled'), value: 4 }
]
export const filterStatusCustomerRatings: Array<Filter> = [
  { text: t('reuse.active'), value: 1 },
  { text: t('reuse.inactive'), value: 2 },
  { text: t('common.cancel'), value: 3 }
]
export const filterRankCustomer: Array<Filter> = [
  { text: t('reuse.silver'), value: 0 },
  { text: t('reuse.gold'), value: 1 },
  { text: t('reuse.platinum'), value: 2 },
  { text: 'Titan', value: 3 }
]
export const filterPotentialCustomerStatus: Array<Filter> = [
  { text: t('reuse.newData'), value: 1 },
  { text: t('reuse.takingCare'), value: 2 },
  { text: t('common.doneLabel'), value: 3 }
]
export const filterTransactionType: Array<Filter> = [
  { text: t('reuse.import'), value: 1 },
  { text: t('reuse.export'), value: 2 },
  { text: t('reuse.transfer'), value: 3 }
]
export const filterIventory: Array<Filter> = [
  { text: t('reuse.outOfStock'), value: 0 },
  { text: t('reuse.stocking'), value: 1 }
]
export const filterSentStatus: Array<Filter> = [
  { text: t('reuse.sented'), value: 1 },
  { text: t('reuse.notSent'), value: 2 }
]
export const filterNotification: Array<Filter> = [
  { text: t('reuse.auto'), value: 1 },
  { text: t('reuse.manual'), value: 2 }
]
export const filterSpaService: Array<Filter> = [
  { text: t('reuse.cleaning'), value: 1 },
  { text: t('reuse.steaming'), value: 2 }
]
export const filterDeposit: Array<Filter> = [
  { text: t('reuse.deposit'), value: 1 },
  { text: t('reuse.sell'), value: 2 },
  { text: t('reuse.rent'), value: 3 }
]
export const filterRentTerm: Array<Filter> = [
  { text: t('reuse.byDay'), value: 1 },
  { text: t('reuse.byWeek'), value: 2 },
  { text: t('reuse.byMonth'), value: 3 },
  { text: t('reuse.byYear'), value: 4 }
]
export const filterBranch: Array<Filter> = [
  { text: t('reuse.hanoi'), value: true },
  { text: t('reuse.hochiminh'), value: false }
]
export const filterDepartment: Array<Filter> = [
  { text: t('reuse.active'), value: true },
  { text: t('reuse.inactive'), value: false }
]
export const filterRankEmployee: Array<Filter> = [
  { text: t('reuse.employee'), value: 1 },
  { text: t('reuse.boss'), value: 2 }
]
export const filterTypeEmployee: Array<Filter> = [
  { text: t('reuse.official'), value: 1 },
  { text: t('reuse.unofficial'), value: 2 }
]
export const filterWalletStatus: Array<Filter> = [
  { text: t('reuse.using'), value: 1 },
  { text: t('reuse.lockMoney'), value: 2 }
]
export const filterPointStatus: Array<Filter> = [
  { text: t('reuse.using'), value: 1 },
  { text: t('reuse.lockPoint'), value: 2 }
]
export const filterSeen: Array<Filter> = [
  { text: t('reuse.seen'), value: 1 },
  { text: t('reuse.notSeen'), value: 2 }
]
export const filterYesNo: Array<Filter> = [
  { text: t('reuse.yes'), value: 1 },
  { text: t('reuse.no'), value: 2 }
]
export const filterRating: Array<Filter> = [
  { text: '1', value: 1 },
  { text: '2', value: 2 },
  { text: '3', value: 3 },
  { text: '4', value: 4 },
  { text: '5', value: 5 }
]
export const filterAuctionResult: Array<Filter> = [
  { text: t('reuse.buyProduct'), value: 1 },
  { text: t('reuse.notBuy'), value: 2 }
]
export const filterProductStatus: Array<Filter> = [
  { text: t('reuse.active'), value: 1 },
  { text: t('reuse.inactive'), value: 2 }
]
export const filterPending: Array<Filter> = [
  { text: t('reuse.pending'), value: 1 },
  { text: t('reuse.finishPending'), value: 2 }
]
export const filterTableStatus: Array<Filter> = [
  { text: t('reuse.active'), value: 1 },
  { text: t('reuse.inactive'), value: 2 },
  { text: t('reuse.pending'), value: 3 },
  { text: t('reuse.finishPending'), value: 4 }
]
export const filterCampaignStatus: Array<Filter> = [
  { text: t('reuse.pending'), value: 0 },
  { text: t('reuse.active'), value: 1 },
  { text: t('reuse.inactive'), value: 2 },
  { text: t('reuse.lock'), value: 3 }
]
export const filterTableCategory: Array<Filter> = [
  { text: t('reuse.bag'), value: 1 },
  { text: t('reuse.wallet'), value: 2 },
  { text: t('reuse.balo'), value: 3 }
]
export const filtersReceiptExpenditure: Array<Filter> = [
  { text: t('reuse.haveToCollect'), value: 1 },
  { text: t('reuse.havetoPay'), value: 0 }
]
export const filterPaymentMethod: Array<Filter> = [
  { text: t('reuse.payThroughMoney'), value: 1 },
  { text: t('reuse.payThroughCard'), value: 2 }
]
export const filtersCustomerType: Array<Filter> = [
  { text: t('reuse.customerName'), value: 1 },
  { text: t('formDemo.companyName'), value: 2 }
]

export const filtersStatus: Array<Filter> = [
  { text: t('reuse.pending'), value: 1 },
  { text: t('reuse.closedTheOrder'), value: 2 },
  { text: t('reuse.delivery'), value: 3 },
  { text: t('reuse.successfulDelivery'), value: 4 },
  { text: t('reuse.paying'), value: 5 },
  { text: t('reuse.deliveryFailed'), value: 6 },
  { text: t('common.doneLabel'), value: 7 },
  { text: t('reuse.cancelled'), value: 8 }
]


export const filtersStatusOrder: Array<Filter> = [
  { text: t('reuse.pending'), value: '0, 1, 4, 14, 22, 32, 42, 44, 45, 54, 55, 61, 65'},
  { text: t('reuse.closedTheOrder'), value: 2 },
  { text: t('reuse.depositing'), value: 5 },
  { text: t('formDemo.completeOrder'), value: '13, 15, 27, 37, 66' },
  { text: t('formDemo.exchangeReturnGoods'), value: '15, 66, 24, 27, 28, 29, 34, 37, 48, 49, 52, 56, 57, 58, 66' },
  { text: t('common.doneLabel'), value: '3, 26, 36, 47' },
  { text: t('reuse.cancelled'), value: -1 }
]

export const filterStatusOrder: Array<Filter> = [
  { text: t('reuse.deliveryFailed'), value: -1 },
  { text: t('formDemo.waitingDelivery'), value: 0 },
  { text: t('reuse.delivery'), value: 2 },
  { text: t('reuse.successfulDelivery'), value: 3 },
  { text: t('formDemo.receivedDelivery'), value: 4 }
]

export const filterStatus: Array<Filter> = [
  { text: t('reuse.notSeen'), value: 2 },
  { text: t('reuse.takingCare'), value: 1 },
  { text: t('common.doneLabel'), value: 0 }
]
export const filterGender: Array<Filter> = [
  { text: t('reuse.male'), value: true },
  { text: t('reuse.female'), value: false }
]
export const filterApproveCampaign: Array<Filter> = [
  { text: t('reuse.initialization'), value: 0 },
  { text: t('reuse.cancel'), value: 1 },
  { text: t('reuse.change'), value: 2 }
]

export const filterStatusCustomer: Array<Filter> = [
  { text: t('reuse.pending'), value: 2 },
  { text: t('reuse.active'), value: 1 }
]

export const filterStatusRatingEmployee: Array<Filter> = [
  { text: t('reuse.isWorking'), value: true },
  { text: t('reuse.stopWorking'), value: false },
]

export const filterResultTable: Array<Filter> = [
  { text: t('reuse.success'), value: 1 },
  { text: t('reuse.outOfStock'), value: 2 },
  { text: t('reuse.fail'), value: 3 }
]
export const filterStatusTagTable: Array<Filter> = [
  { text: t('reuse.finishConsult'), value: 1 },
  { text: t('reuse.pendingConsult'), value: 2 }
]
export const filterService: Array<Filter> = [
  { text: t('reuse.sell'), value: 1 },
  { text: t('reuse.deposit'), value: 2 },
  { text: t('reuse.rent'), value: 3 },
  { text: t('workplace.mortgage'), value: 4 },
  { text: t('workplace.spa'), value: 5 },
  { text: t('workplace.spa'), value: 6 },
  { text: t('reuse.internal'), value: 7 }
]
export const filterSource: Array<Filter> = [
  { text: 'Facebook', value: 1 },
  { text: 'App', value: 2 }
]
export const filterApproaching: Array<Filter> = [
  { text: t('reuse.online'), value: 1 },
  { text: t('reuse.booking'), value: 2 },
  { text: t('reuse.offline'), value: 3 }
]
export const filterTransactionStatus: Array<Filter> = [
  { text: t('reuse.online'), value: 1 },
  { text: t('reuse.booking'), value: 2 },
  { text: t('reuse.offline'), value: 3 }
]
export const filterTransaction: Array<Filter> = [
  { text: t('reuse.firstTime'), value: 1 },
  { text: t('reuse.secondTime'), value: 2 }
]
export const filterPromotionCode: Array<Filter> = [
  { text: t('reuse.voucherCode'), value: 1 },
  { text: t('reuse.flashSaleCode'), value: 2 },
  { text: t('reuse.comboCode'), value: 3 }
]
export const filterType: Array<Filter> = [
  { text: t('reuse.enterprise'), value: 1 },
  { text: t('reuse.personal'), value: 2 }
]
export const filterAccount: Array<Filter> = [
  { text: t('reuse.customer'), value: 0 },
  { text: t('reuse.supplier'), value: 1 },
  { text: t('formDemo.joint'), value: 2 }
]
export const filterSubject: Array<Filter> = [
  { text: t('reuse.allCustomer'), value: 2 },
  { text: t('reuse.groupCustomer'), value: 3 }
]
export const filterPromotionPrice: Array<Filter> = [
  { text: t('reuse.sale30'), value: 1 },
  { text: t('reuse.sale500k'), value: 2 },
  { text: t('reuse.mix'), value: 3 }
]
export const filterVoucherType: Array<Filter> = [
  { text: t('formDemo.voucherDiscount'), value: 1 },
  { text: t('formDemo.voucherGiftSpa'), value: 2 }
]

export const filterVoucherStatus: Array<Filter> = [
  { text: t('reuse.pending'), value: 1 },
  { text: t('reuse.closedTheOrder'), value: 2 },
  { text: t('reuse.finishPending'), value: 3 },
  { text: t('common.doneLabel'), value: 4 },
  { text: t('reuse.cancelled'), value: 5 }
]
export const filterVoucherCondition: Array<Filter> = [
  { text: t('reuse.freeReceive'), value: 1 },
  { text: t('reuse.exchangeByPoints'), value: 2 },
  { text: 'Affiliate', value: 3 },
  { text: t('reuse.buyByVirtualWallet'), value: 4 }
]
export const filterAuctionStatus: Array<Filter> = [
  { text: t('reuse.pending'), value: 1 },
  { text: t('reuse.finishPending'), value: 2 },
  { text: t('reuse.auctioning'), value: 3 }
]
export const filterLocation: Array<Filter> = [
  { text: t('Tầng 1'), value: 1 },
  { text: t('Tầng 2'), value: 2 },
  { text: t('Tầng 3'), value: 3 }
]
export const filterWarehouseManagement: Array<Filter> = [
  { text: t('Kho 1'), value: 1 },
  { text: t('Kho 2'), value: 2 },
  { text: t('Kho 3'), value: 3 }
]
export const filterStatusRevenueExpenditure: Array<Filter> = [
  { text: t('reuse.pending'), value: 1 },
  { text: t('reuse.finishPending'), value: 2 },
  { text: t('reuse.auctioning'), value: 3 },
  
]
export const filterStatusAccounting: Array<Filter> = [
  { text: t('reuse.pending'), value: 1 },
  { text: t('reuse.finishPending'), value: 2 },
  { text: t('reuse.accounted'), value: 3 },
  { text: t('reuse.cancelled'), value: 4 }
]
export const filterStatusGeneral: Array<Filter> = [
  { text: t('reuse.pending'), value: 0 },
  { text: t('reuse.finishPending'), value: 1 },
  { text: t('reuse.cancelled'), value: 2 }
]
export const filterReciprocalProfile: Array<Filter> = [
  { text: t('reuse.yes'), value: 1 },
  { text: t('reuse.no'), value: 2 }
]
export const filterTypeNotification: Array<Filter> = [
  { text: t('reuse.auto'), value: 1 },
  { text: t('reuse.handmade'), value: 2 }
]
export const filterTypePolicies: Array<Filter> = [
  { text: t('reuse.showing'), value: 1 },
  { text: t('reuse.hiding'), value: 2 }
]
export const filterShow: Array<Filter> = [
  { text: t('reuse.home'), value: 1 },
  { text: t('reuse.trending'), value: 2 }
]
export const filterPointSettingType: Array<Filter> = [
  { text: t('router.buyPointsPackage'), value: 1 },
  { text: t('reuse.pointsForSellOrder'), value: 2 },
  { text: t('reuse.pointsForRentOrder'), value: 3 },
  { text: t('reuse.pointsForDepositOrder'), value: 4 },
  { text: t('reuse.pointsForPawnOrder'), value: 5 },
  { text: t('reuse.pointsForSpaOrder'), value: 6 },
  { text: t('reuse.pointsForAffiliate'), value: 7 }
]
export const filterStatusSettingPoint: Array<Filter> = [
  { text: t('reuse.active'), value: 1 },
  { text: t('reuse.inactive'), value: 0 }
]

export const filterStatusBalance: Array<Filter> = [
  { text: t('reuse.active'), value: true},
  { text: t('reuse.stopActive'), value: false }
]

export const filterStatusProductAndService: Array<Filter> = [
  { text: t('reuse.approval'), value: 0 },
  { text: t('reuse.active'), value: 1 },
  { text: t('reuse.pause'), value: 2 },
]
