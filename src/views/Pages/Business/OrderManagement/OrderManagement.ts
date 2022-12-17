import { useI18n } from '@/hooks/web/useI18n'
import {
  filtersReceiptExpenditure,
  filtersStatus,
  filterRentTerm,
  filterDeposit,
  filterSpaService,
  filtersCustomerType
} from '@/utils/filters'
import { h } from 'vue'
import { dateTimeFormat } from '@/utils/format'
const { t } = useI18n()

const changeMoney = new Intl.NumberFormat('vi', {
  style: 'currency',
  currency: 'vnd',
  minimumFractionDigits: 0
})

//Đơn bán hàng
export const sellOrder = [
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'code',
    label: t('reuse.orderCode'),
    minWidth: '150'
  },
  {
    field: 'collaboratorId',
    label: t('reuse.collaboratorsCode'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'promotionCode',
    label: t('reuse.promotionCode'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'userName',
    label: t('reuse.customerName'),
    minWidth: '170',
    filters: filtersCustomerType
  },

  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '120',
    filters: filtersStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return h('div', cellValue ? 'Đang hoạt động' : 'Ngưng hoạt động')
    }
  }
]
//Đơn hàng cho thuê
export const rentalorder = [
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'code',
    label: t('reuse.orderCode'),
    minWidth: '150'
  },
  {
    field: 'collaboratorId',
    label: t('reuse.collaboratorsCode'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'promotionCode',
    label: t('reuse.promotionCode'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'userName',
    label: t('reuse.customerName'),
    minWidth: '170',
    filters: filtersCustomerType
  },
  {
    field: 'description',
    label: t('reuse.explain'),
    minWidth: '170'
  },

  {
    field: 'totalQuantity',
    label: t('reuse.rentingNumber'),
    minWidth: '200',
    align: 'right',
    sortable: true
  },

  {
    field: 'createdBy',
    label: t('reuse.creator'),
    minWidth: '150',
    headerFilter: 'Name'
  },
  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '120',
    filters: filtersStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return h('div', cellValue ? 'Đang hoạt động' : 'Ngưng hoạt động')
    }
  }
]
//Đơn hàng ký gửi
export const orderDeposit = [
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'code',
    label: t('reuse.orderCode'),
    minWidth: '150'
  },
  {
    field: 'collaboratorId',
    label: t('reuse.collaboratorsCode'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'promotionCode',
    label: t('reuse.promotionCode'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'userName',
    label: t('reuse.customerName'),
    minWidth: '170',
    filters: filtersCustomerType
  },
  {
    field: 'description',
    label: t('reuse.explain'),
    minWidth: '170'
  },

  {
    field: 'depositNumber',
    label: t('reuse.depositNumber'),
    minWidth: '200',
    align: 'right',
    sortable: true
  },

  {
    field: 'endDate',
    label: t('reuse.endDate'),
    minWidth: '150',
    align: 'center',
    sortable: true
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
    minWidth: '120',
    filters: filterDeposit
  }
]
//Đơn hàng cầm đồ
export const orderPawn = [
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'code',
    label: t('reuse.orderCode'),
    minWidth: '150'
  },
  {
    field: 'collaboratorId',
    label: t('reuse.collaboratorsCode'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'promotionCode',
    label: t('reuse.promotionCode'),
    minWidth: '150',
    sortable: true
  },

  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '120',
    filters: filterDeposit
  }
]
//Đơn hàng SPA
export const orderSpa = [
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'code',
    label: t('reuse.orderCode'),
    minWidth: '150'
  },
  {
    field: 'collaboratorId',
    label: t('reuse.collaboratorsCode'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'promotionCode',
    label: t('reuse.promotionCode'),
    minWidth: '150',
    sortable: true
  },

  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '120',
    filters: filtersStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return h('div', cellValue ? 'Đang hoạt động' : 'Ngưng hoạt động')
    }
  }
]
