import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
import { filterTableStatus, filterTableCategory } from '@/utils/filters'
export const businessProductLibrary = [
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center',
    sortable: true
  },
  {
    field: 'productCode',
    label: t('reuse.productCode'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'productName',
    label: t('reuse.productName'),
    minWidth: '250',
    sortable: true
  },
  {
    field: 'description',
    label: t('reuse.description'),
    minWidth: '250',
    sortable: true
  },
  {
    field: 'category',
    label: t('reuse.category'),
    minWidth: '150',
    filters: filterTableCategory
  },
  {
    field: 'inventory',
    label: t('reuse.inventory'),
    minWidth: '150'
  },
  {
    field: 'currentlyLeased',
    label: t('reuse.currentlyLeased'),
    minWidth: '150'
  },
  {
    field: 'quantitySold',
    label: t('reuse.quantitySold'),
    minWidth: '150'
  },
  {
    field: 'numberOfTimesrRented',
    label: t('reuse.numberOfTimesrRented'),
    minWidth: '150'
  },
  {
    field: 'numberOfTimesDeposited',
    label: t('reuse.numberOfTimesDeposited'),
    minWidth: '150'
  },
  {
    field: 'numberOfTimesPawn',
    label: t('reuse.numberOfTimesPawn'),
    minWidth: '150'
  },
  {
    field: 'numberOfTimesSpa',
    label: t('reuse.numberOfTimesSpa'),
    minWidth: '150'
  },
  {
    field: 'setInventoryForSale',
    label: t('reuse.setInventoryForSale'),
    minWidth: '150'
  },
  {
    field: 'setInventoryForRent',
    label: t('reuse.setInventoryForRent'),
    minWidth: '150'
  },
  {
    field: 'sellingPriceFrom',
    label: t('reuse.sellingPriceFrom'),
    minWidth: '150'
  },
  {
    field: 'rentalPriceFrom',
    label: t('reuse.rentalPriceFrom'),
    minWidth: '150'
  },
  {
    field: 'dram',
    label: t('reuse.dram'),
    minWidth: '150'
  },
  {
    field: 'image',
    label: t('reuse.image'),
    minWidth: '150'
  },
  {
    field: 'businessManagement',
    label: t('reuse.businessManagement'),
    minWidth: '150'
  },
  {
    field: 'createDate',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'creator',
    label: t('reuse.creator'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterTableStatus
  }
]
