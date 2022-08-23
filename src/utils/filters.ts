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
