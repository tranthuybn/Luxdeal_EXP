import { useI18n } from '@/hooks/web/useI18n'
import { ref, unref } from 'vue'
import TableType01 from '@/views/Pages/Components/TableBase/src/TableType01.vue'
import {
  filterTableStatus,
  filterTableCategory,
  filterIventory,
  filterDeposit
} from '@/utils/filters'
import { h } from 'vue'
import { ElSwitch } from 'element-plus'
import { reactive } from 'vue'
const tableBase01 = ref<ComponentRef<typeof TableType01>>()
const seeDetail = (...param) => {
  const array = Array.isArray(unref(tableBase01)?.tableObject.tableList)
    ? unref(tableBase01)?.tableObject.tableList
    : []
  if (array && array.length > 0) {
    array.forEach((el) => {
      if (el.id === param[0].id) el['approveOrNot'] = !param[2]
    })
  }
}
const { t } = useI18n()
export const businessProductLibrary = [
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
    align: 'right'
  },
  {
    field: 'currentlyLeased',
    label: t('reuse.currentlyLeased'),
    minWidth: '150',
    align: 'right'
  },
  {
    field: 'quantitySold',
    label: t('reuse.quantitySold'),
    minWidth: '150',
    align: 'right'
  },
  {
    field: 'numberOfTimesRented',
    label: t('reuse.numberOfTimesRented'),
    minWidth: '150',
    align: 'right'
  },
  {
    field: 'numberOfTimesDeposited',
    label: t('reuse.numberOfTimesDeposited'),
    minWidth: '150',
    align: 'right'
  },
  {
    field: 'numberOfTimesPawn',
    label: t('reuse.numberOfTimesPawn'),
    minWidth: '150',
    align: 'right'
  },
  {
    field: 'numberOfTimesSpa',
    label: t('reuse.numberOfTimesSpa'),
    minWidth: '150',
    align: 'right'
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
    align: 'right'
  },
  {
    field: 'rentalPriceFrom',
    label: t('reuse.rentalPriceFrom'),
    minWidth: '150',
    align: 'right'
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
    align: 'center'
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
export const columnProfileProduct = reactive<FormSchema[]>([
  {
    field: 'field1',
    label: t('mã quản lý'),
    component: 'Divider'
  },
  {
    field: 'field41',
    label: t('Thông tin sản phẩm'),
    component: 'Divider'
  },
  {
    field: 'field42',
    label: t('Kho xuất'),
    component: 'Divider'
  },
  {
    field: 'field41',
    label: t('Tồn kho'),
    component: 'Divider'
  },
  {
    field: 'field41',
    label: t('Số lượng'),
    component: 'Divider'
  },
  {
    field: 'field41',
    label: t('Đơn giá'),
    component: 'Divider'
  },
  {
    field: 'field41',
    label: t('Thành tiền'),
    component: 'Divider'
  }
])
export const columnManagementSeo = reactive<FormSchema[]>([
  {
    field: 'field1',
    label: t('reuse.informationSeo'),
    component: 'Divider'
  },
  {
    field: 'field5',
    label: t('reuse.title'),
    component: 'Input',
    componentProps: {
      placeholder: 'Nhập vị trí hiển thị'
    },
    colProps: {
      span: 16
    }
  },
  {
    field: 'field5',
    label: t('reuse.path'),
    component: 'Input',
    componentProps: {
      placeholder: 'Nhập đường dẫn'
    },
    colProps: {
      span: 16
    }
  },
  {
    field: 'field2',
    label: 'Tag',
    component: 'Select',
    componentProps: {
      allowCreate: true,
      filterable: true,
      multiple: true,
      placeholder: 'Tag',
      style: 'width: 400px',
      options: [
        {
          label: 'Túi hàng hiệu',
          value: '1'
        },
        {
          label: 'LV',
          value: '2'
        }
      ]
    },
    colProps: {
      span: 16
    }
  },
  {
    field: 'field43',
    label: t('reuse.descriptions'),
    component: 'Editor',
    componentProps: {
      placeholder: 'Hello'
    },
    colProps: {
      span: 24
    }
  }
])
export const featuresPrice = reactive<TableColumn[]>([
  {
    field: 'managementCode',
    label: t('reuse.managementCode'),
    minWidth: '250'
  },
  {
    field: 'featureGroup',
    label: t('Thông tin sản phẩm'),
    minWidth: '200'
  },
  {
    field: 'quantityTo',
    label: t('Kho xuất'),
    minWidth: '130'
  },
  {
    field: 'productCategoryUnit',
    label: t('Số lượng'),
    minWidth: '130'
  },
  {
    field: 'unitPrices',
    label: t('Đơn giá'),
    minWidth: '130'
  },
  {
    field: 'promotionPrice',
    label: t('Thành tiền'),
    minWidth: '130'
  }
])
export const featuresRentalPrice = reactive<TableColumn[]>([
  {
    field: 'managementCode',
    label: t('reuse.managementCode'),
    minWidth: '250'
  },
  {
    field: 'featureGroup',
    label: t('reuse.featureGroup'),
    minWidth: '200'
  },
  {
    field: 'quantityTo',
    label: t('reuse.quantityTo'),
    minWidth: '130'
  },
  {
    field: 'productCategoryUnit',
    label: t('router.productCategoryUnit'),
    minWidth: '130'
  },
  {
    field: 'dayRentalUnitPrice',
    label: t('reuse.dayRentalUnitPrice'),
    minWidth: '130'
  },
  {
    field: 'weeklyRent',
    label: t('reuse.weeklyRent'),
    minWidth: '130'
  },
  {
    field: 'monthlyRent',
    label: t('reuse.monthlyRent'),
    minWidth: '130'
  },
  {
    field: 'rentDeposit',
    label: t('reuse.rentDeposit'),
    minWidth: '130'
  },
  {
    field: 'createDate',
    label: t('reuse.createDate'),
    minWidth: '130'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '130'
  },
  {
    field: 'businessManagement',
    label: t('reuse.businessManagement'),
    minWidth: '120',
    fixed: false,
    align: 'center',
    formatter: (record: Recordable, column: TableColumn, cellValue: TableSlotDefault) => {
      return h(ElSwitch, {
        style: { margin: 'auto' },
        modelValue: record.approveOrNot,
        onClick: () => seeDetail(record, column, cellValue)
      })
    }
  }
])
export const featuresDepositFee = reactive<TableColumn[]>([
  {
    field: 'managementCode',
    label: t('reuse.managementCode'),
    minWidth: '250'
  },
  {
    field: 'featureGroup',
    label: t('reuse.featureGroup'),
    minWidth: '200'
  },
  {
    field: 'quantityTo',
    label: t('reuse.quantityTo'),
    minWidth: '130'
  },
  {
    field: 'productCategoryUnit',
    label: t('router.productCategoryUnit'),
    minWidth: '130'
  },
  {
    field: 'depositFee',
    label: t('reuse.depositFee'),
    minWidth: '130'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '130'
  },
  {
    field: 'businessManagement',
    label: t('reuse.businessManagement'),
    minWidth: '120',
    fixed: false,
    align: 'center',
    formatter: (record: Recordable, column: TableColumn, cellValue: TableSlotDefault) => {
      return h(ElSwitch, {
        style: { margin: 'auto' },
        modelValue: record.approveOrNot,
        onClick: () => seeDetail(record, column, cellValue)
      })
    }
  }
])
export const featuresPawnFee = reactive<TableColumn[]>([
  {
    field: 'managementCode',
    label: t('reuse.managementCode'),
    minWidth: '250'
  },
  {
    field: 'featureGroup',
    label: t('reuse.featureGroup'),
    minWidth: '200'
  },
  {
    field: 'quantityTo',
    label: t('reuse.quantityTo'),
    minWidth: '130'
  },
  {
    field: 'productCategoryUnit',
    label: t('router.productCategoryUnit'),
    minWidth: '130'
  },
  {
    field: 'interest',
    label: t('reuse.interest'),
    minWidth: '130'
  },
  {
    field: 'InsuranceMoney',
    label: t('reuse.InsuranceMoney'),
    minWidth: '130'
  },
  {
    field: 'intoMoney',
    label: t('reuse.intoMoney'),
    minWidth: '130'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '130'
  },
  {
    field: 'businessManagement',
    label: t('reuse.businessManagement'),
    minWidth: '120',
    fixed: false,
    align: 'center',
    formatter: (record: Recordable, column: TableColumn, cellValue: TableSlotDefault) => {
      return h(ElSwitch, {
        style: { margin: 'auto' },
        modelValue: record.approveOrNot,
        onClick: () => seeDetail(record, column, cellValue)
      })
    }
  }
])
export const spaPrice = reactive<TableColumn[]>([
  {
    field: 'managementCode',
    label: t('reuse.managementCode'),
    minWidth: '250'
  },
  {
    field: 'serviceOrGroupService',
    label: t('reuse.serviceOrGroupService'),
    minWidth: '200'
  },
  {
    field: 'spaTime',
    label: t('reuse.spaTime'),
    minWidth: '130'
  },
  {
    field: 'numberUses',
    label: t('reuse.numberUses'),
    minWidth: '130'
  },
  {
    field: 'spaPrice',
    label: t('reuse.spaPrice'),
    minWidth: '130'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '130'
  },
  {
    field: 'businessManagement',
    label: t('reuse.businessManagement'),
    minWidth: '120',
    fixed: false,
    align: 'center',
    formatter: (record: Recordable, column: TableColumn, cellValue: TableSlotDefault) => {
      return h(ElSwitch, {
        style: { margin: 'auto' },
        modelValue: record.approveOrNot,
        onClick: () => seeDetail(record, column, cellValue)
      })
    }
  }
])
export const inventoryTrading = [
  {
    field: 'managementCode',
    label: t('reuse.managementCode'),
    minWidth: '250'
  },
  {
    field: 'featureGroup',
    label: t('reuse.featureGroup'),
    minWidth: '200'
  },
  {
    field: 'businessSynthesis',
    label: t('reuse.businessSynthesis'),
    children: [
      {
        field: 'numberOfTimesRented',
        label: t('reuse.quantitySold'),
        minWidth: '100',
        align: 'right'
      },
      {
        field: 'numberOfTimesRented',
        label: t('reuse.numberOfTimesRented'),
        minWidth: '100',
        align: 'right'
      },
      {
        field: 'numberOfTimesDeposited',
        label: t('reuse.numberOfTimesDeposited'),
        minWidth: '100',
        align: 'right'
      },
      {
        field: 'numberOfTimesPawn',
        label: t('reuse.numberOfTimesPawn'),
        minWidth: '100',
        align: 'right'
      },
      {
        field: 'numberOfTimesSpa',
        label: t('reuse.numberOfTimesSpa'),
        minWidth: '100',
        align: 'right'
      }
    ]
  },
  {
    field: 'inventoryConsolidation',
    label: t('reuse.inventoryConsolidation'),
    children: [
      {
        field: 'internalInventory',
        label: t('reuse.internalInventory'),
        minWidth: '100',
        align: 'right'
      },
      {
        field: 'consignmentInventory',
        label: t('reuse.consignmentInventory'),
        minWidth: '100',
        align: 'right'
      },
      {
        field: 'pawnInventory',
        label: t('reuse.pawnInventory'),
        minWidth: '100',
        align: 'right'
      },
      {
        field: 'spaInventory',
        label: t('reuse.spaInventory'),
        minWidth: '100',
        align: 'right'
      },
      {
        field: 'currentlyLeased',
        label: t('reuse.currentlyLeased'),
        minWidth: '100',
        align: 'right'
      },
      {
        field: 'total',
        label: t('reuse.total'),
        minWidth: '100',
        align: 'right'
      }
    ]
  },
  {
    field: 'productCategoryUnit',
    label: t('reuse.dram'),
    minWidth: '150'
  }
]
export const columnsPriceByQuantity = reactive<TableColumn[]>([
  {
    field: 'quantityTo',
    label: t('reuse.quantityTo'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'dayRentalUnitPrice',
    label: t('reuse.dayRentalUnitPrice'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'weeklyRent',
    label: t('reuse.weeklyRent'),
    minWidth: '150'
  },
  {
    field: 'monthlyRent',
    label: t('reuse.monthlyRent'),
    minWidth: '150'
  },
  {
    field: 'rentDeposit',
    label: t('reuse.rentDeposit'),
    minWidth: '150'
  },
  {
    field: 'adjustmentDate',
    label: t('reuse.adjustmentDate'),
    minWidth: '150'
  }
])
export const columnsImportAndExportHistory = reactive<TableColumn[]>([
  {
    field: 'importExportDate',
    label: t('reuse.importExportDate'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'importExportCode',
    label: t('reuse.importExportCode'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'importExportForm',
    label: t('reuse.importExportForm'),
    minWidth: '150'
  },
  {
    field: 'importExportWarehouse',
    label: t('reuse.importExportWarehouse'),
    minWidth: '150'
  },
  {
    field: 'internalWarehouse',
    label: t('reuse.internalWarehouse'),
    minWidth: '150'
  },
  {
    field: 'consignmentWarehouse',
    label: t('reuse.consignmentWarehouse'),
    minWidth: '150'
  },
  {
    field: 'pawnStore',
    label: t('reuse.pawnStore'),
    minWidth: '150'
  },
  {
    field: 'spaWarehouse',
    label: t('reuse.spaWarehouse'),
    minWidth: '150'
  },
  {
    field: 'totalInventory',
    label: t('reuse.totalInventory'),
    minWidth: '150'
  },
  {
    field: 'dram',
    label: t('reuse.dram'),
    minWidth: '150'
  }
])
