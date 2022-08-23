import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
export const filterTableStatus = [
  { text: t('reuse.active'), value: 'Đang hoạt động' },
  { text: t('reuse.inactive'), value: 'Ngưng hoạt động' },
  { text: t('reuse.pending'), value: 'Chờ duyệt' }
]
export const filterTableCategory = [
  { text: t('reuse.bag'), value: 1 },
  { text: t('reuse.wallet'), value: 2 },
  { text: t('reuse.balo'), value: 3 }
]
