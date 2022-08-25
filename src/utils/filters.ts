import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()

interface Filter {
  text: string
  value: any
}
export const filterTableStatus: Array<Filter> = [
  { text: t('reuse.active'), value: 'Đang hoạt động' },
  { text: t('reuse.inactive'), value: 'Ngưng hoạt động' },
  { text: t('reuse.pending'), value: 'Chờ duyệt' }
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
export const filterCustomer: Array<Filter> = [
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
