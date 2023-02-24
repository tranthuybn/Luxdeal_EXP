import { h, reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { filterAuctionResult, filterPromotionPrice, filterSubject, filterTableCategory, filterTableStatus, filterVoucherCondition, filterVoucherType } from '@/utils/filters'
import { businessStatusTransferToText, dateTimeFormat, formatStatusVoucher, formatSubjectVoucher, VoucherType } from '@/utils/format'

const { t } = useI18n()


const combo = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'code',
    label: t('reuse.flashSaleCode'),
    minWidth: '130'
  },
  {
    field: 'description',
    label: t('reuse.descriptions'),
    minWidth: '250'
  },
  {
    field: 'targetType',
    label: t('reuse.subject'),
    minWidth: '130',
    filters: filterSubject,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return formatSubjectVoucher(cellValue)
    }
  },
  {
    field: 'reduce',
    label: t('reuse.promotion'),
    minWidth: '150',
    filters: filterPromotionPrice
  },
  {
    field: 'fromDate',
    label: t('reuse.start'),
    minWidth: '130',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'toDate',
    label: t('common.doneLabel'),
    minWidth: '130',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '130',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdBy',
    label: t('reuse.creator'),
    minWidth: '130',
    headerFilter: 'Name'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterTableStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return formatStatusVoucher(cellValue)
    }
  }
])

const auction = reactive<TableColumn[]>([
  {
    field: 'id',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'code',
    label: t('reuse.auctionCode'),
    minWidth: '130'
  },
  {
    field: 'description',
    label: t('reuse.descriptions'),
    minWidth: '250'
  },
  {
    field: 'productCode',
    label: t('reuse.productCode'),
    minWidth: '200'
  },
  {
    field: 'floorPrice',
    label: t('reuse.floorPrice'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'priceStep',
    label: t('reuse.priceStep'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'highestBid',
    label: t('reuse.highestBid'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'joined',
    label: t('reuse.joined'),
    minWidth: '150',
    align: 'right'
  },
  {
    field: 'result',
    label: t('reuse.result'),
    minWidth: '150',
    filters: filterAuctionResult
  },
  {
    field: 'fromDate',
    label: t('reuse.start'),
    minWidth: '130',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'toDate',
    label: t('common.doneLabel'),
    minWidth: '130',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '130',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'creator',
    label: t('reuse.creator'),
    minWidth: '130',
    headerFilter: 'Name'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterTableStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return formatStatusVoucher(cellValue)
    }
  }
])
const collection = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'code',
    label: t('reuse.flashSaleCode'),
    minWidth: '130'
  },
  {
    field: 'description',
    label: t('reuse.descriptions'),
    minWidth: '250'
  },
  {
    field: 'targetType',
    label: t('reuse.subject'),
    minWidth: '130',
    filters: filterSubject,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return formatSubjectVoucher(cellValue)
    }
  },
  {
    field: 'reduce',
    label: t('reuse.promotion'),
    minWidth: '150',
    filters: filterPromotionPrice
  },
  {
    field: 'fromDate',
    label: t('reuse.start'),
    minWidth: '130',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'toDate',
    label: t('common.doneLabel'),
    minWidth: '130',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '130',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdBy',
    label: t('reuse.creator'),
    minWidth: '130',
    headerFilter: 'Name'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterTableStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return formatStatusVoucher(cellValue)
    }
  }
])

const flashSale =  reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'code',
    label: t('reuse.flashSaleCode'),
    minWidth: '130'
  },
  {
    field: 'description',
    label: t('reuse.descriptions'),
    minWidth: '250'
  },
  {
    field: 'targetType',
    label: t('reuse.subject'),
    minWidth: '130',
    filters: filterSubject,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return formatSubjectVoucher(cellValue)
    }
  },
  {
    field: 'reduce',
    label: t('reuse.promotion'),
    minWidth: '150',
    filters: filterPromotionPrice,
    formatter: (row: Recordable, __: TableColumn, cellValue: boolean) => {
      return h('div', `${cellValue}(${row['maximumReduce']} đ)`)
    }
  },
  {
    field: 'fromDate',
    label: t('reuse.start'),
    minWidth: '130',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'toDate',
    label: t('common.doneLabel'),
    minWidth: '130',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '130',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdBy',
    label: t('reuse.creator'),
    minWidth: '130',
    headerFilter: 'Name'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterTableStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return formatStatusVoucher(cellValue)
    }
  }
])
const newProduct = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'code',
    label: t('reuse.flashSaleCode'),
    minWidth: '130'
  },
  {
    field: 'description',
    label: t('reuse.descriptions'),
    minWidth: '250'
  },
  {
    field: 'targetType',
    label: t('reuse.subject'),
    minWidth: '130',
    filters: filterSubject,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return formatSubjectVoucher(cellValue)
    }
  },
  {
    field: 'reduce',
    label: t('reuse.promotion'),
    minWidth: '150',
    filters: filterPromotionPrice
  },
  {
    field: 'fromDate',
    label: t('reuse.start'),
    minWidth: '130',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'toDate',
    label: t('common.doneLabel'),
    minWidth: '130',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '130',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdBy',
    label: t('reuse.creator'),
    minWidth: '130',
    headerFilter: 'Name'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterTableStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return formatStatusVoucher(cellValue)
    }
  }
])

const voucher = reactive<TableColumn[]>([
  {
    field: 'id',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'code',
    label: t('router.voucherCode'),
    minWidth: '130'
  },
  {
    field: 'description',
    label: t('reuse.descriptions'),
    minWidth: '250'
  },
  {
    field: 'voucherType',
    label: t('reuse.type'),
    minWidth: '200',
    filters: filterVoucherType,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return VoucherType(cellValue)
    }
  },
  {
    field: 'condition',
    label: t('formDemo.condition'),
    minWidth: '130',
    filters: filterVoucherCondition,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return formatSubjectVoucher(cellValue)
    }
  },
  {
    field: 'targetType',
    label: t('reuse.subject'),
    minWidth: '200',
    filters: filterSubject,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return formatSubjectVoucher(cellValue)
    }
  },
  {
    field: 'reduce',
    label: t('reuse.promotion'),
    minWidth: '150',
    filters: filterPromotionPrice
  },
  {
    field: 'fromDate',
    label: t('reuse.start'),
    minWidth: '130',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'toDate',
    label: t('common.doneLabel'),
    minWidth: '130',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '130',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdBy',
    label: t('reuse.creator'),
    minWidth: '130',
    headerFilter: 'Name'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterTableStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return formatStatusVoucher(cellValue)
    }
  }
])

export { 
  combo,
  auction,
  collection,
  flashSale,
  newProduct,
  voucher
}