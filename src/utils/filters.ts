import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()

interface Filter {
  text: string
  value: any
}
export const filterIventory: Array<Filter> = [
  { text: t('reuse.outOfStock'), value: 1 },
  { text: t('reuse.stocking'), value: 2 }
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
  { text: t('reuse.hanoi'), value: 1 },
  { text: t('reuse.hochiminh'), value: 2 }
]
export const filterDepartment: Array<Filter> = [
  { text: t('reuse.administrative'), value: 1 },
  { text: t('reuse.humanResources'), value: 2 }
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
export const filterTableStatus: Array<Filter> = [
  { text: t('reuse.active'), value: 1 },
  { text: t('reuse.inactive'), value: 2 },
  { text: t('reuse.pending'), value: 3 },
  { text: t('reuse.finishPending'), value: 4 }
]
export const filterTableCategory: Array<Filter> = [
  { text: t('reuse.bag'), value: 1 },
  { text: t('reuse.wallet'), value: 2 },
  { text: t('reuse.balo'), value: 3 }
]
export const filtersReceiptExpenditure: Array<Filter> = [
  { text: t('reuse.haveToCollect'), value: true },
  { text: t('reuse.havetoPay'), value: false }
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
export const filterStatus: Array<Filter> = [
  { text: t('reuse.notSeen'), value: 2 },
  { text: t('reuse.takingCare'), value: 1 },
  { text: t('common.doneLabel'), value: 0 }
]
export const filterGender: Array<Filter> = [
  { text: t('reuse.male'), value: true },
  { text: t('reuse.female'), value: false }
]
export const filterStatusCustomer: Array<Filter> = [
  { text: t('reuse.active'), value: 1 },
  { text: t('reuse.pause'), value: 2 },
  { text: t('reuse.lockAccount'), value: 0 }
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
  { text: t('reuse.buying'), value: 1 },
  { text: t('reuse.deposit'), value: 2 },
  { text: t('reuse.pawn'), value: 3 }
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
export const filterAccount: Array<Filter> = [{ text: t('reuse.customer'), value: 1 }]
export const filterSubject: Array<Filter> = [
  { text: t('reuse.allCustomer'), value: 1 },
  { text: t('reuse.groupCustomer'), value: 2 },
  { text: t('reuse.onlyCustomer'), value: 3 }
]
export const filterPromotionPrice: Array<Filter> = [
  { text: t('reuse.sale30'), value: 1 },
  { text: t('reuse.sale500k'), value: 2 },
  { text: t('reuse.mix'), value: 3 }
]
export const filterVoucherType: Array<Filter> = [
  { text: t('reuse.voucherCart'), value: 1 },
  { text: t('reuse.voucherSpa'), value: 2 },
  { text: 'Affiliate', value: 3 }
]
export const filterAuctionStatus: Array<Filter> = [
  { text: t('reuse.pending'), value: 1 },
  { text: t('reuse.finishPending'), value: 2 },
  { text: t('reuse.auctioning'), value: 3 }
]
