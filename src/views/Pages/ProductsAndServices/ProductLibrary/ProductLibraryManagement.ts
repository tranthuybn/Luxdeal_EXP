import { getCategories, getTags } from '@/api/LibraryAndSetting'
import { useI18n } from '@/hooks/web/useI18n'
import { PRODUCTS_AND_SERVICES } from '@/utils/API.Variables'
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
import { ElNotification } from 'element-plus'
import { reactive, h } from 'vue'
import { setImageDisplayInDOm } from '@/utils/domUtils'

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
    minWidth: '250',
    formatter: (_: Recordable, __: TableColumn, cellValue: any) => {
      return h('span', { innerHTML: cellValue })
    }
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
    align: 'right',
    sortable: true
  },
  {
    field: 'hirePrice',
    label: t('reuse.rentalPriceFrom'),
    minWidth: '150',
    align: 'right',
    sortable: true
  },
  {
    field: 'categories[2].value',
    label: t('reuse.dram'),
    minWidth: '150'
  },
  {
    field: 'productImages[0].path',
    label: t('reuse.image'),
    minWidth: '150',
    align: 'center',
    formatter: (record: Recordable, column: TableColumn, _cellValue: TableSlotDefault) =>
      setImageDisplayInDOm(record, column, record.productImages[0]?.path)
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
let brandSelect = reactive([])
export const getBrandSelectOptions = async () => {
  await getCategories({ TypeName: PRODUCTS_AND_SERVICES[7].key, pageSize: 10000, pageIndex: 1 })
    .then((res) => {
      if (res.data) {
        brandSelect = res.data
          .filter((data) => data.isActive == true)
          .map((index) => ({
            label: index.name,
            value: index.id
          }))
      }
    })
    .catch((err) => {
      console.error(err)
    })
  columnProfileProduct[7].componentProps!.options = brandSelect
}
let unitSelect = reactive([])
export const getUnitSelectOptions = async () => {
  await getCategories({ TypeName: PRODUCTS_AND_SERVICES[6].key, pageSize: 10000, pageIndex: 1 })
    .then((res) => {
      if (res.data) {
        unitSelect = res.data
          .filter((data) => data.isActive == true)
          .map((index) => ({
            label: index.name,
            value: index.id
          }))
      }
    })
    .catch((err) => {
      console.error(err)
    })
  columnProfileProduct[8].componentProps!.options = unitSelect
}
let originSelect = reactive([])
export const getOriginSelectOptions = async () => {
  await getCategories({ TypeName: PRODUCTS_AND_SERVICES[8].key, pageSize: 10000, pageIndex: 1 })
    .then((res) => {
      if (res.data) {
        originSelect = res.data
          .filter((data) => data.isActive == true)
          .map((index) => ({
            label: index.name,
            value: index.id
          }))
      }
    })
    .catch((err) => {
      console.error(err)
    })
  columnProfileProduct[9].componentProps!.options = originSelect
}
export const customPostData = async (data) => {
  if (originSelect.length == 0) {
    await getOriginSelectOptions()
  }
  if (unitSelect.length == 0) {
    await getUnitSelectOptions()
  }
  if (brandSelect.length == 0) {
    await getBrandSelectOptions()
  }
  const findBrand = brandSelect.find((brand) => brand['value'] == data.BrandId)
  const findUnit = unitSelect.find((unit) => unit['value'] == data.UnitId)
  const findOrigin = originSelect.find((origin) => origin['value'] == data.OriginId)
  if (findBrand == undefined) {
    ElNotification({
      message: t('reuse.cantFindBrandData'),
      type: 'warning'
    })
  }
  if (findUnit == undefined) {
    ElNotification({
      message: t('reuse.cantFindUnitData'),
      type: 'warning'
    })
  }
  if (findOrigin == undefined) {
    ElNotification({
      message: t('reuse.cantFindOriginData'),
      type: 'warning'
    })
  }
}
export { originSelect, unitSelect, brandSelect }

export const columnProfileProduct = reactive<FormSchema[]>([
  {
    field: 'Divider02',
    label: t('reuse.generalProductInformation'),
    component: 'Divider'
  },
  {
    field: 'ProductCode',
    label: t('reuse.productCode'),
    component: 'Select',
    componentProps: {
      placeholder: t('reuse.enterProductCode'),
      style: 'width: 100%',
      loading: true,
      allowCreate: true,
      filterable: true,
      options: []
    },
    colProps: {
      span: 20
    },
    formItemProps: {
      style: { height: '55px' }
    }
  },
  {
    field: 'Name',
    label: t('reuse.productName'),
    component: 'Select',
    componentProps: {
      placeholder: t('reuse.enterProductName'),
      style: 'width: 100%',
      loading: true,
      allowCreate: true,
      filterable: true,
      options: []
    },
    colProps: {
      span: 20
    }
  },
  {
    field: 'ShortDescription',
    label: t('reuse.shortDescription'),
    component: 'Input',
    componentProps: {
      placeholder: t('reuse.under256Characters')
    },
    colProps: {
      span: 20
    }
  },
  {
    field: 'VerificationInfo',
    label: t('reuse.inspectionInformation'),
    component: 'Input',
    componentProps: {
      placeholder: t('reuse.addLink')
    },
    colProps: {
      span: 20
    }
  },
  {
    field: 'Divider',
    label: t('router.productCategoryProducts'),
    component: 'Divider'
  },
  {
    field: 'ProductTypeId',
    label: t('reuse.selectCategory'),
    colProps: {
      span: 20
    }
  },
  {
    field: 'BrandId',
    label: t('router.productCategoryBrand'),
    component: 'Select',
    componentProps: {
      placeholder: t('reuse.chooseBrand'),
      style: 'width: 100%',
      options: []
    },
    colProps: {
      span: 20
    }
  },
  {
    field: 'UnitId',
    label: t('router.productCategoryUnit'),
    component: 'Select',
    componentProps: {
      style: 'width: 100%',
      placeholder: t('reuse.chooseUnit'),
      options: []
    },
    colProps: {
      span: 20
    }
  },
  {
    field: 'OriginId',
    label: t('router.productCategoryOrigin'),
    component: 'Select',
    componentProps: {
      placeholder: t('reuse.chooseOrigin'),
      style: 'width: 100%',
      options: []
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
    field: 'Description',
    label: ' ',
    component: 'Editor',
    componentProps: {
      style: 'width: 100%'
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
    field: 'HireInventoryStatus',
    label: t('reuse.setInventoryForSale'),
    component: 'Radio',
    colProps: {
      span: 24
    },
    value: 1,
    componentProps: {
      options: [
        {
          label: t('reuse.stocking'),
          value: 1
        },
        {
          label: t('reuse.orders'),
          value: 2
        },
        {
          label: t('reuse.outOfStock'),
          value: 3
        },
        {
          label: t('reuse.notDisplay'),
          value: 4
        }
      ]
    }
  },
  {
    field: 'SellInventoryStatus',
    label: t('reuse.setInventoryForRent'),
    component: 'Radio',
    colProps: {
      span: 24
    },
    value: 1,
    componentProps: {
      options: [
        {
          label: t('reuse.stocking'),
          value: 1
        },
        {
          label: t('reuse.orders'),
          value: 2
        },
        {
          label: t('reuse.outOfStock'),
          value: 3
        },
        {
          label: t('reuse.notDisplay'),
          value: 4
        }
      ]
    }
  },
  {
    field: 'ProductStatus',
    colProps: {
      span: 24
    },
    value: 1
  }
])
let callTagAPI = 0
let tagsSelect: ComponentOptions[] = reactive([])
const getTagsOptions = async () => {
  if (callTagAPI == 0) {
    await getTags({})
      .then((res) => {
        if (res.data) {
          tagsSelect = res.data.map((tag) => ({
            label: tag.key,
            value: tag.key,
            id: tag.id
          }))
        }
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => callTagAPI++)
    columnManagementSeo[3].componentProps!.options = tagsSelect
    columnManagementSeo[3].componentProps!.loading = false
  }
}
export const columnManagementSeo = reactive<FormSchema[]>([
  {
    field: 'field1',
    label: t('reuse.informationSeo'),
    component: 'Divider'
  },
  {
    field: 'SeoTitle',
    label: t('reuse.title'),
    component: 'Input',
    componentProps: {
      placeholder: t('reuse.enterTitle')
    },
    colProps: {
      span: 16
    }
  },
  {
    field: 'SeoUrl',
    label: t('reuse.path'),
    component: 'Input',
    componentProps: {
      placeholder: t('reuse.enterLink')
    },
    colProps: {
      span: 16
    }
  },
  {
    field: 'SeoTags',
    label: 'Tag',
    component: 'Select',
    componentProps: {
      onClick: () => getTagsOptions(),
      allowCreate: true,
      filterable: true,
      loading: true,
      multiple: true,
      placeholder: 'Tag',
      style: 'width: 100%',
      options: []
    },
    colProps: {
      span: 16
    }
  },
  {
    field: 'description',
    label: t('reuse.descriptions'),
    component: 'Editor',
    componentProps: { defaultHtml: '', style: 'width: 100%' },
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
let callAttribute = 0
export let colorData = reactive([])
export let sizeData = reactive([])
export let materialData = reactive([])
export let statusData = reactive([])
export let genderData = reactive([])
export const getCategoriesData = async () => {
  if (callAttribute == 0) {
    await getCategories({
      TypeName: PRODUCTS_AND_SERVICES[1].key,
      pageSize: 1000,
      pageIndex: 1
    }).then(
      (res) =>
        (colorData = res.data.map((color) => ({
          label: color.name,
          value: color.id,
          parentid: -1
        })))
    )
    await getCategories({
      TypeName: PRODUCTS_AND_SERVICES[2].key,
      pageSize: 1000,
      pageIndex: 1
    }).then(
      (res) =>
        (sizeData = res.data.map((size) => ({ label: size.name, value: size.id, parentid: -2 })))
    )
    await getCategories({
      TypeName: PRODUCTS_AND_SERVICES[3].key,
      pageSize: 1000,
      pageIndex: 1
    }).then(
      (res) =>
        (materialData = res.data.map((material) => ({
          label: material.name,
          value: material.id,
          parentid: -3
        })))
    )
    await getCategories({
      TypeName: PRODUCTS_AND_SERVICES[4].key,
      pageSize: 1000,
      pageIndex: 1
    }).then(
      (res) =>
        (statusData = res.data.map((status) => ({
          label: status.name,
          value: status.id,
          parentid: -4
        })))
    )
    await getCategories({
      TypeName: PRODUCTS_AND_SERVICES[5].key,
      pageSize: 1000,
      pageIndex: 1
    }).then(
      (res) =>
        (genderData = res.data.map((gender) => ({
          label: gender.name,
          value: gender.id,
          parentid: -5
        })))
    )

    // treeSelectData.value[0].children = colorData
    // treeSelectData.value[1].children = sizeData
    // treeSelectData.value[2].children = materialData
    // treeSelectData.value[3].children = statusData
    // treeSelectData.value[4].children = genderData

    callAttribute++
  }
}
