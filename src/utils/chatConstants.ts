import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
export const TYPE_OF_MESSAGE = [
  {
    label: t('reuse.shoppingConsult'),
    value: 'TuVanMuaHang',
    isActive: false
  },
  {
    label: t('reuse.rentalConsult'),
    value: 'CamDo',
    isActive: false
  },
  {
    label: t('reuse.depositConsult'),
    value: 'ChoThue',
    isActive: false
  },
  {
    label: t('reuse.pawnConsult'),
    value: 'KyGui',
    isActive: false
  },
  {
    label: t('reuse.customerCareConsult'),
    value: 'CSKH',
    isActive: false
  }
]

export const TYPE_OF_MESSAGE_SELECTED = 'TuVanMuaHang'
export const TYPE_OF_MESSAGE_PAWN = 'CamDo'
export const TYPE_OF_MESSAGE_LEASE = 'ChoThue'
export const TYPE_OF_MESSAGE_DEPOSIT = 'KyGui'
export const TYPE_OF_MESSAGE_CSKH = 'CSKH'
export const PAGE_SIZE_ARRAY = [10, 20, 50, 100]
