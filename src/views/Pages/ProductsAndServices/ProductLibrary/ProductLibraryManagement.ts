import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
import {
  filterTableStatus,
  filterTableCategory,
  filterIventory,
  filterDeposit
} from '@/utils/filters'
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
    minWidth: '150'
  },
  {
    field: 'productName',
    label: t('reuse.productName'),
    minWidth: '250'
  },
  {
    field: 'description',
    label: t('reuse.description'),
    minWidth: '250'
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
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'currentlyLeased',
    label: t('reuse.currentlyLeased'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'quantitySold',
    label: t('reuse.quantitySold'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'numberOfTimesRented',
    label: t('reuse.numberOfTimesRented'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'numberOfTimesDeposited',
    label: t('reuse.numberOfTimesDeposited'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'numberOfTimesPawn',
    label: t('reuse.numberOfTimesPawn'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'numberOfTimesSpa',
    label: t('reuse.numberOfTimesSpa'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'setInventoryForSale',
    label: t('reuse.setInventoryForSale'),
    minWidth: '150',
    filters: filterIventory
  },
  {
    field: 'setInventoryForRent',
    label: t('reuse.setInventoryForRent'),
    minWidth: '150',
    filters: filterIventory
  },
  {
    field: 'sellingPriceFrom',
    label: t('reuse.sellingPriceFrom'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'rentalPriceFrom',
    label: t('reuse.rentalPriceFrom'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'dram',
    label: t('reuse.dram'),
    minWidth: '150'
  },
  {
    field: 'image',
    label: t('reuse.image'),
    minWidth: '150',
    align: 'center'
  },
  {
    field: 'businessManagement',
    label: t('reuse.businessManagement'),
    minWidth: '150',
    filters: filterDeposit
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
    headerFilter: 'Name'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterTableStatus
  }
]
