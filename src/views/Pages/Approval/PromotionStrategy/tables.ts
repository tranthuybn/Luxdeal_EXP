import { reactive, h } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { filterAuctionResult, filterPromotionPrice, filterSubject, filterTableStatus, filterVoucherCondition, filterVoucherType, filterApproveCampaign } from '@/utils/filters'
import { dateTimeFormat, formatStatusVoucher, formatSubjectVoucher, VoucherType } from '@/utils/format'

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
    label: t('reuse.comboCode'),
    minWidth: '130',
    headerAlign: 'left',
  },
  {
    field: 'description',
    label: t('reuse.descriptions'),
    minWidth: '250',
    headerAlign: 'left',
  },
  {
    field: 'spaService',
    label: t('reuse.spaService'),
    headerAlign: 'left',
    minWidth: '200',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        // assuming `items` is a ref with array value
        row?.productProperties.map((item) => {
          if (item.code) {
            return h('p', `${item.spaServiceNames}`)
          }
        })
      )
    }
  },
  {
    field: 'condition',
    label: t('formDemo.condition'),
    minWidth: '130',
    headerAlign: 'left',
    filters: filterVoucherCondition,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${formatSubjectVoucher(cellValue)}`)
    }
  },
  {
    field: 'productCode',
    label: t('reuse.productCode'),
    headerAlign: 'left',
    minWidth: '200',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        // assuming `items` is a ref with array value
        row?.productProperties.map((item) => {
          if (item.code) {
            return h('span', `${item.code}`)
          }
        })
      )
    }
  },
  {
    field: 'spaService',
    label: t('reuse.comboPrice'),
    headerAlign: 'left',
    sortable: true,
    minWidth: '200',
  },
  {
    field: 'createdAt',
    label: t('formDemo.createdAtEdit'),
    minWidth: '170',
    headerAlign: 'left',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdBy',
    label: t('formDemo.createdByEdit'),
    minWidth: '180',
    headerAlign: 'left',
    headerFilter: 'Name'
  },
  {
    field: 'approveAction',
    label: t('reuse.approveCondition'),
    minWidth: '150',
    headerAlign: 'left',
    filters: filterApproveCampaign,
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    headerAlign: 'left',
    filters: filterTableStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
     return t(`${formatStatusVoucher(cellValue)}`)
    }
  },
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
    minWidth: '130',
    headerAlign: 'left',
  },
  {
    field: 'description',
    label: t('reuse.descriptions'),
    minWidth: '250',
    headerAlign: 'left',
  },
  {
    field: 'productCode',
    label: t('reuse.productCode'),
    minWidth: '200',
    headerAlign: 'left',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        // assuming `items` is a ref with array value
        row?.productProperties.map((item) => {
          if (item.code) {
            return h('span', `${item.code}`)
          }
        })
      )
    }
  },
  {
    field: 'floorPrice',
    label: t('reuse.floorPrice'),
    minWidth: '150',
    headerAlign: 'left',
    align: 'right',
    sortable: true
  },
  {
    field: 'priceStep',
    label: t('reuse.priceStep'),
    minWidth: '150',
    align: 'right',
    headerAlign: 'left',
    sortable: true
  },
  {
    field: 'highestBid',
    label: t('reuse.highestBid'),
    minWidth: '150',
    align: 'right',
    headerAlign: 'left',
    sortable: true
  },
  {
    field: 'joined',
    label: t('reuse.joined'),
    minWidth: '150',
    headerAlign: 'left',
  },
  {
    field: 'result',
    label: t('reuse.result'),
    minWidth: '150',
    headerAlign: 'left',
    filters: filterAuctionResult
  },
  {
    field: 'createdAt',
    label: t('formDemo.createdAtEdit'),
    minWidth: '170',
    headerAlign: 'left',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdBy',
    label: t('formDemo.createdByEdit'),
    minWidth: '180',
    headerAlign: 'left',
    headerFilter: 'Name'
  },
  {
    field: 'approveAction',
    label: t('reuse.approveCondition'),
    minWidth: '150',
    headerAlign: 'left',
    filters: filterApproveCampaign,
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    headerAlign: 'left',
    filters: filterTableStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
     return t(`${formatStatusVoucher(cellValue)}`)
    }
  }
])

const flashSale =  reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center',
  },
  {
    field: 'code',
    label: t('reuse.flashSaleCode'),
    minWidth: '130',
    headerAlign: 'left',
  },
  {
    field: 'description',
    label: t('reuse.descriptions'),
    minWidth: '250',
    headerAlign: 'left',

  },
  {
    field: 'targetType',
    justifyContent: 'between',
    label: t('reuse.subject'),
    headerAlign: 'left',
    minWidth: '130',
    filters: filterSubject,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${formatSubjectVoucher(cellValue)}`)
    }
  },
  {
    field: 'reduce',
    label: t('reuse.promotion'),
    minWidth: '150',
    headerAlign: 'left',
    filters: filterPromotionPrice,
  },
  {
    field: 'createdAt',
    label: t('formDemo.createdAtEdit'),
    minWidth: '160',
    headerAlign: 'left',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdBy',
    label: t('formDemo.createdByEdit'),
    minWidth: '160',
    headerAlign: 'left',
    headerFilter: 'Name'
  },
  {
    field: 'approveAction',
    label: t('reuse.approveCondition'),
    minWidth: '150',
    headerAlign: 'left',
    filters: filterApproveCampaign,
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    headerAlign: 'left',
    filters: filterTableStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
     return t(`${formatStatusVoucher(cellValue)}`)
    }
  }
])
const newProduct = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center',

  },
  {
    field: 'code',
    label: t('reuse.newproductCode'),
    minWidth: '130',
    headerAlign: 'left',
  },
  {
    field: 'description',
    label: t('reuse.descriptions'),
    minWidth: '250',
    headerAlign: 'left',
  },
  {
    field: 'targetType',
    label: t('reuse.subject'),
    minWidth: '130',
    headerAlign: 'left',
    filters: filterSubject,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${formatSubjectVoucher(cellValue)}`)
    }
  },
  {
    field: 'reduce',
    label: t('reuse.promotion'),
    minWidth: '150',
    headerAlign: 'left',
    filters: filterPromotionPrice
  },
  {
    field: 'createdAt',
    label: t('formDemo.createdAtEdit'),
    minWidth: '160',
    headerAlign: 'left',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdBy',
    label: t('formDemo.createdByEdit'),
    minWidth: '160',
    headerAlign: 'left',
    headerFilter: 'Name'
  },
  {
    field: 'approveAction',
    label: t('reuse.approveCondition'),
    minWidth: '150',
    headerAlign: 'left',
    filters: filterApproveCampaign,
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    headerAlign: 'left',
    filters: filterTableStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
     return t(`${formatStatusVoucher(cellValue)}`)
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
    label: t('reuse.voucherCode'),
    minWidth: '130',
    headerAlign: 'left',
  },
  {
    field: 'description',
    label: t('reuse.descriptions'),
    minWidth: '250',
    headerAlign: 'left',
  },
  {
    field: 'voucherType',
    label: t('reuse.type'),
    headerAlign: 'left',
    minWidth: '200',
    filters: filterVoucherType,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return VoucherType(cellValue)
    }
  },
  {
    field: 'voucherConditionTypeName',
    label: t('formDemo.condition'),
    headerAlign: 'left',
    minWidth: '130',
    filters: filterVoucherCondition,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${formatSubjectVoucher(cellValue)}`)
    }
  },
  {
    field: 'targetType',
    label: t('reuse.subject'),
    headerAlign: 'left',
    minWidth: '200',
    filters: filterSubject,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${formatSubjectVoucher(cellValue)}`)
    }
  },
  {
    field: 'reduce',
    label: t('reuse.promotion'),
    headerAlign: 'left',
    minWidth: '150',
    filters: filterPromotionPrice
  },
  {
    field: 'createdAt',
    label: t('formDemo.createdAtEdit'),
    minWidth: '170',
    headerAlign: 'left',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdBy',
    label: t('formDemo.createdByEdit'),
    minWidth: '180',
    headerAlign: 'left',
    headerFilter: 'Name'
  },
  {
    field: 'approveAction',
    label: t('reuse.approveCondition'),
    minWidth: '150',
    headerAlign: 'left',
    filters: filterApproveCampaign,
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    headerAlign: 'left',
    filters: filterTableStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
     return t(`${formatStatusVoucher(cellValue)}`)
    }
  },
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
    label: t('reuse.collectionCode'),
    minWidth: '130',
    headerAlign: 'left',
  },
  {
    field: 'description',
    label: t('reuse.descriptions'),
    minWidth: '250',
    headerAlign: 'left',
  },
  {
    field: 'targetType',
    label: t('reuse.subject'),
    minWidth: '130',
    headerAlign: 'left',
    filters: filterSubject,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${formatSubjectVoucher(cellValue)}`)
    }
  },
  {
    field: 'reduce',
    label: t('reuse.promotion'),
    minWidth: '150',
    headerAlign: 'left',
    filters: filterPromotionPrice
  },
  {
    field: 'createdAt',
    label: t('formDemo.createdAtEdit'),
    minWidth: '160',
    headerAlign: 'left',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdBy',
    label: t('formDemo.createdByEdit'),
    minWidth: '160',
    headerAlign: 'left',
    headerFilter: 'Name'
  },
  {
    field: 'approveAction',
    label: t('reuse.approveCondition'),
    minWidth: '150',
    headerAlign: 'left',
    filters: filterApproveCampaign,
  },
  {
    field: 'status',
    label: t('reuse.status'),
    headerAlign: 'left',
    minWidth: '150',
    filters: filterTableStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
     return t(`${formatStatusVoucher(cellValue)}`)
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