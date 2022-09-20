import { useI18n } from '@/hooks/web/useI18n'
import {
  filterTableStatus,
  filterTableCategory,
  filterIventory,
  filterDeposit
} from '@/utils/filters'
import {
  dateTimeFormat,
  businessIventoryStatusTransferToText,
  businessStatusTransferToText
} from '@/utils/format'
import { reactive, h } from 'vue'
//const tableBase01 = ref<ComponentRef<typeof TableType01>>()
// const seeDetail = (...param) => {
//   const array = Array.isArray(unref(tableBase01)?.tableObject.tableList)
//     ? unref(tableBase01)?.tableObject.tableList
//     : []
//   if (array && array.length > 0) {
//     array.forEach((el) => {
//       if (el.id === param[0].id) el['approveOrNot'] = !param[2]
//     })
//   }
// }
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
    field: 'name',
    label: t('reuse.productName'),
    minWidth: '250'
  },
  {
    field: 'description',
    label: t('reuse.description'),
    minWidth: '250'
  },
  {
    field: 'categories[1].value',
    label: t('reuse.category'),
    minWidth: '150',
    filters: filterTableCategory
  },
  {
    field: 'productStat.tonKho',
    label: t('reuse.inventory'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'productStat.dangThue',
    label: t('reuse.currentlyLeased'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'productStat.daBan',
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
    field: 'productStat.kiGui',
    label: t('reuse.numberOfTimesDeposited'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'productStat.camDo',
    label: t('reuse.numberOfTimesPawn'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'productStat.spa',
    label: t('reuse.numberOfTimesSpa'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'productStat.datTonKhoBan',
    label: t('reuse.setInventoryForSale'),
    minWidth: '150',
    filters: filterIventory,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return h('div', businessIventoryStatusTransferToText(cellValue))
    }
  },
  {
    field: 'productStat.datTonKhoThue',
    label: t('reuse.setInventoryForRent'),
    minWidth: '150',
    filters: filterIventory,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return h('div', businessIventoryStatusTransferToText(cellValue))
    }
  },
  {
    field: 'price',
    label: t('reuse.sellingPriceFrom'),
    minWidth: '150',
    align: 'right'
  },
  {
    field: 'hirePrice',
    label: t('reuse.rentalPriceFrom'),
    minWidth: '150',
    align: 'right'
  },
  {
    field: 'categories[2].value',
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
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
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
    minWidth: '150',
    filters: filterTableStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return h('div', businessStatusTransferToText(cellValue))
    }
  }
]
export const columnProfileProduct = reactive<FormSchema[]>([
  {
    field: 'Divider',
    label: t('router.productCategoryProducts'),
    component: 'Divider'
  },
  {
    field: 'Select01',
    label: t('reuse.selectCategory'),
    component: 'Select',
    componentProps: {
      allowCreate: true,
      filterable: true,
      multiple: true,
      placeholder: 'Chọn danh mục cấp 1',
      style: 'width: 400px',
      options: [
        {
          label: t('reuse.active'),
          value: '1'
        },
        {
          label: t('reuse.stopActive'),
          value: '2'
        }
      ]
    },
    colProps: {
      span: 10
    }
  },
  {
    field: 'Select02',
    component: 'Select',
    componentProps: {
      allowCreate: true,
      filterable: true,
      multiple: true,
      style: 'width: 400px',
      placeholder: 'Chọn danh mục cấp 2',
      options: [
        {
          label: t('reuse.active'),
          value: '1'
        },
        {
          label: t('reuse.stopActive'),
          value: '2'
        }
      ]
    },
    colProps: {
      span: 10
    }
  },
  {
    field: 'Select03',
    label: t('router.productCategoryBrand'),
    component: 'Select',
    componentProps: {
      allowCreate: true,
      filterable: true,
      multiple: true,
      placeholder: 'Chọn thương hiệu cấp 1',
      style: 'width: 400px',
      options: [
        {
          label: t('reuse.active'),
          value: '1'
        },
        {
          label: t('reuse.stopActive'),
          value: '2'
        }
      ]
    },
    colProps: {
      span: 10
    }
  },
  {
    field: 'Select04',
    component: 'Select',
    componentProps: {
      allowCreate: true,
      filterable: true,
      multiple: true,
      style: 'width: 400px',
      placeholder: 'Chọn thương hiệu cấp 2',
      options: [
        {
          label: t('reuse.active'),
          value: '1'
        },
        {
          label: t('reuse.stopActive'),
          value: '2'
        }
      ]
    },
    colProps: {
      span: 10
    }
  },
  {
    field: 'Select05',
    label: t('router.productCategoryOrigin'),
    component: 'Select',
    componentProps: {
      allowCreate: true,
      filterable: true,
      multiple: true,
      placeholder: 'Chọn xuất xứ cấp 1',
      style: 'width: 400px',
      options: [
        {
          label: t('reuse.active'),
          value: '1'
        },
        {
          label: t('reuse.stopActive'),
          value: '2'
        }
      ]
    },
    colProps: {
      span: 10
    }
  },
  {
    field: 'Select06',
    component: 'Select',
    componentProps: {
      allowCreate: true,
      filterable: true,
      multiple: true,
      style: 'width: 400px',
      placeholder: 'Chọn xuất xứ cấp 2',
      options: [
        {
          label: t('reuse.active'),
          value: '1'
        },
        {
          label: t('reuse.stopActive'),
          value: '2'
        }
      ]
    },
    colProps: {
      span: 10
    }
  },
  {
    field: 'Divider02',
    label: t('reuse.generalProductInformation'),
    component: 'Divider'
  },
  {
    field: 'Input01',
    label: t('reuse.productCode'),
    component: 'Input',
    componentProps: {
      placeholder: 'Nhập mã sản phẩm'
    },
    colProps: {
      span: 20
    }
  },
  {
    field: 'Input02',
    label: t('reuse.productName'),
    component: 'Input',
    componentProps: {
      placeholder: 'Nhập tên sản phẩm'
    },
    colProps: {
      span: 20
    }
  },
  {
    field: 'Input03',
    label: t('reuse.shortDescription'),
    component: 'Input',
    componentProps: {
      placeholder: 'Nhập mô tả'
    },
    colProps: {
      span: 20
    }
  },
  {
    field: 'Input04',
    label: t('reuse.inspectionInformation'),
    component: 'Input',
    componentProps: {
      placeholder: 'Thêm Link ...'
    },
    colProps: {
      span: 20
    }
  },
  {
    field: 'Divider03',
    label: t('reuse.descriptionParameters'),
    component: 'Divider'
  },
  {
    field: 'Editor',
    label: t('reuse.descriptions'),
    component: 'Editor',
    componentProps: {
      placeholder: 'Hello'
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'Divider04',
    label: t('reuse.statusAndFunction'),
    component: 'Divider'
  },
  {
    field: 'Radio01',
    label: t('reuse.setInventoryForSale'),
    component: 'Radio',

    colProps: {
      span: 24
    },
    componentProps: {
      options: [
        {
          label: t('reuse.stocking'),
          value: '1'
        },
        {
          label: t('reuse.orders'),
          value: '2'
        },
        {
          label: t('reuse.outOfStock'),
          value: '3'
        },
        {
          label: t('reuse.displayed'),
          value: '4'
        }
      ]
    }
  },
  {
    field: 'Radio02',
    label: t('reuse.setInventoryForRent'),
    component: 'Radio',

    colProps: {
      span: 24
    },
    componentProps: {
      options: [
        {
          label: t('reuse.stocking'),
          value: '1'
        },
        {
          label: t('reuse.orders'),
          value: '2'
        },
        {
          label: t('reuse.outOfStock'),
          value: '3'
        },
        {
          label: t('reuse.displayed'),
          value: '4'
        }
      ]
    }
  },
  {
    field: 'Radio03',
    label: t('reuse.productStatus'),
    component: 'Radio',

    colProps: {
      span: 24
    },
    componentProps: {
      options: [
        {
          label: t('reuse.pending'),
          value: '1'
        },
        {
          label: t('reuse.active'),
          value: '2'
        },
        {
          label: t('reuse.pauseOperation'),
          value: '3'
        }
      ]
    }
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
    component: 'Input',
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
    field: 'unitPrices',
    label: t('reuse.unitPrices'),
    minWidth: '130'
  },
  {
    field: 'promotionPrice',
    label: t('reuse.promotionPrice'),
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
    field: 'switch',
    label: t('reuse.businessManagement'),
    minWidth: '120',
    align: 'center'
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
    label: t('reuse.dateEditCreate'),
    minWidth: '130'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '130'
  },
  {
    field: 'switch',
    label: t('reuse.businessManagement'),
    minWidth: '120',
    align: 'center'
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
    field: 'switch',
    label: t('reuse.businessManagement'),
    minWidth: '120',
    align: 'center'
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
    field: 'switch',
    label: t('reuse.businessManagement'),
    minWidth: '120',
    align: 'center'
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
    field: 'switch',
    label: t('reuse.businessManagement'),
    minWidth: '120',
    align: 'center'
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
    minWidth: '150'
  },
  {
    field: 'dayRentalUnitPrice',
    label: t('reuse.dayRentalUnitPrice'),
    minWidth: '150'
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
    headerFilter: 'Date'
  },
  {
    field: 'importExportCode',
    label: t('reuse.importExportCode'),
    minWidth: '150'
  },
  {
    field: 'importExportForm',
    label: t('reuse.importExportForm'),
    minWidth: '150',
    headerFilter: 'Name'
  },
  {
    field: 'importExportWarehouse',
    label: t('reuse.importExportWarehouse'),
    minWidth: '150',
    headerFilter: 'Name'
  },
  {
    field: 'internalWarehouse',
    label: t('reuse.internalWarehouse'),
    minWidth: '110'
  },
  {
    field: 'consignmentWarehouse',
    label: t('reuse.consignmentWarehouse'),
    minWidth: '110'
  },
  {
    field: 'pawnStore',
    label: t('reuse.pawnStore'),
    minWidth: '110'
  },
  {
    field: 'spaWarehouse',
    label: t('reuse.spaWarehouse'),
    minWidth: '110'
  },
  {
    field: 'totalInventory',
    label: t('reuse.totalInventory'),
    minWidth: '110'
  },
  {
    field: 'dram',
    label: t('reuse.dram'),
    minWidth: '110'
  }
])
