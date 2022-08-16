import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
//Đơn bán hàng
export const wareHouse = [
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'productCode',
    label: t('reuse.productCode'),
    minWidth: '150'
  },
  {
    field: 'managementCode',
    label: t('reuse.managementCode'),
    minWidth: '150'
  },
  {
    field: 'productInformation',
    label: t('reuse.productInformation'),
    minWidth: '100'
  },
  {
    field: 'characteristic',
    label: t('reuse.characteristic'),
    minWidth: '100'
  },
  {
    field: 'accessory',
    label: t('reuse.accessory'),
    minWidth: '100'
  },
  {
    field: 'firstEntryDate',
    label: t('reuse.firstEntryDate'),
    minWidth: '100'
  },
  {
    field: 'singleEntryCode',
    label: t('reuse.singleEntryCode'),
    minWidth: '100'
  },
  {
    field: 'typeOfFirstEntry',
    label: t('reuse.typeOfFirstEntry'),
    minWidth: '100'
  },
  {
    field: 'typeOfTransfer',
    label: t('reuse.typeOfTransfer'),
    minWidth: '100'
  },
  {
    field: 'warehouseManagement',
    label: t('router.warehouseManagement'),
    minWidth: '100'
  },
  {
    field: 'location',
    label: t('reuse.location'),
    minWidth: '100'
  },
  {
    field: 'amountImport',
    label: t('reuse.amountImport'),
    minWidth: '100'
  },
  {
    field: 'inventory',
    label: t('reuse.inventory'),
    minWidth: '100'
  },
  {
    field: 'priceImport',
    label: t('reuse.priceImport'),
    minWidth: '100'
  },
  {
    field: 'CashIntoInventory',
    label: t('reuse.CashIntoInventory'),
    minWidth: '100'
  },
  {
    field: 'businessManagement',
    label: t('reuse.businessManagement'),
    minWidth: '100'
  },
  {
    field: 'stockCard',
    label: t('reuse.stockCard'),
    minWidth: '100'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '100'
  }
]
