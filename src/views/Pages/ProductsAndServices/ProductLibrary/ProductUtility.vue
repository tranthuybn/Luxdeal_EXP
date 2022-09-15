<script setup lang="ts">
import CollapseBase from '@/views/Pages/Components/CollapseBase.vue'
import { getTypePersonnelList } from '@/api/HumanResourceManagement'
import {
  getFeaturesDepositFee,
  getFeaturesPawnFee,
  getFeaturesPrices,
  getFeaturesRentalPrice,
  getSpaLPrice,
  getInventoryTrading,
  getPriceByQuantity,
  getImportAndExportHistory
} from '@/api/LibraryAndSetting'
import { useIcon } from '@/hooks/web/useIcon'
import {
  columnProfileProduct,
  featuresPrice,
  featuresRentalPrice,
  featuresDepositFee,
  featuresPawnFee,
  spaPrice,
  inventoryTrading,
  columnManagementSeo,
  columnsPriceByQuantity,
  columnsImportAndExportHistory
} from './ProductLibraryManagement'
import { Collapse } from '../../Components/Type'
import { useRouter } from 'vue-router'
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })

const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'information',
    title: 'Thông tin sản phẩm',
    columns: columnProfileProduct,
    api: undefined,
    buttonAdd: '',
    typeForm: 'form',
    typeButton: 'form01',
    expand: false,
    apiTableChild: undefined,
    columnsTableChild: undefined,
    pagination: false,
    removeHeaderFilter: true,
    removeDrawer: true,
    selection: false,
    customOperator: 3
  },
  {
    icon: plusIcon,
    name: 'priceCharacteristics',
    title: 'Bảng đặc tính và giá bán',
    columns: featuresPrice,
    api: getFeaturesPrices,
    buttonAdd: 'Thêm đặc tính và giá bán',
    typeForm: 'table',
    typeButton: 'table',
    expand: true,
    apiTableChild: getPriceByQuantity,
    columnsTableChild: columnsPriceByQuantity,
    pagination: false,
    removeHeaderFilter: true,
    removeDrawer: true,
    selection: false,
    customOperator: 2,
    titleChilden: 'reuse.rentalPriceTableByQuantity'
  },
  {
    icon: plusIcon,
    name: 'rentalPriceCharacteristics ',
    title: 'Bảng đặc tính và giá cho thuê',
    columns: featuresRentalPrice,
    api: getFeaturesRentalPrice,
    buttonAdd: 'Thêm đặc tính và giá cho thuê',
    typeForm: 'table',
    typeButton: 'table',
    expand: true,
    apiTableChild: getPriceByQuantity,
    columnsTableChild: columnsPriceByQuantity,
    pagination: false,
    removeHeaderFilter: true,
    removeDrawer: true,
    selection: false,
    customOperator: 2,
    titleChilden: 'reuse.rentalPriceTableByQuantity'
  },
  {
    icon: plusIcon,
    name: 'depositFee',
    title: 'Bảng đặc tính và phí kí gửi',
    columns: featuresDepositFee,
    api: getFeaturesDepositFee,
    buttonAdd: 'Thêm đặc tính và phí kí gửi',
    typeForm: 'table',
    typeButton: 'table',
    expand: false,
    apiTableChild: undefined,
    columnsTableChild: undefined,
    pagination: false,
    removeHeaderFilter: true,
    removeDrawer: true,
    selection: false,
    customOperator: 2
  },
  {
    icon: plusIcon,
    name: 'pawnFee',
    title: 'Bảng đặc tính và phí cầm đồ',
    columns: featuresPawnFee,
    api: getFeaturesPawnFee,
    buttonAdd: 'Thêm đặc tính và phí cầm đồ',
    typeForm: 'table',
    typeButton: 'table',
    expand: false,
    apiTableChild: undefined,
    columnsTableChild: undefined,
    pagination: false,
    removeHeaderFilter: true,
    removeDrawer: true,
    selection: false,
    customOperator: 2
  },
  {
    icon: plusIcon,
    name: 'SpaPrice',
    title: 'Bảng giá dịch vụ spa',
    columns: spaPrice,
    api: getSpaLPrice,
    buttonAdd: 'Thêm dịch vụ và phí spa',
    typeForm: 'table',
    typeButton: 'table',
    expand: false,
    apiTableChild: undefined,
    columnsTableChild: undefined,
    pagination: false,
    removeHeaderFilter: true,
    removeDrawer: true,
    selection: false,
    customOperator: 2
  },
  {
    icon: plusIcon,
    name: 'inventoryTrading',
    title: 'Tổng hợp tồn kho & kinh doanh',
    columns: inventoryTrading,
    api: getInventoryTrading,
    buttonAdd: 'Thêm đặc tính',
    typeForm: 'table',
    typeButton: 'table',
    expand: true,
    apiTableChild: getImportAndExportHistory,
    columnsTableChild: columnsImportAndExportHistory,
    titleChilden: 'reuse.importAndExportHistoryByProductLine',
    pagination: false,
    removeHeaderFilter: true,
    removeDrawer: true,
    selection: false,
    customOperator: 2
  },
  {
    icon: plusIcon,
    name: 'managementSeo',
    title: 'Quản lý SEO',
    columns: columnManagementSeo,
    api: getTypePersonnelList,
    buttonAdd: '',
    typeForm: 'form',
    typeButton: 'form02',
    expand: false,
    apiTableChild: undefined,
    columnsTableChild: undefined,
    pagination: false,
    removeHeaderFilter: true,
    removeDrawer: true,
    selection: false,
    customOperator: 3,
    hasImage: false
  }
]
//lay du lieu tu router
const router = useRouter()
const id = String(router.currentRoute.value.params.id)
</script>
<template> <CollapseBase :collapse="collapse" :id="id" :default="'information'" /></template>
