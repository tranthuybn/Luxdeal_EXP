<script setup lang="ts">
import { ref } from 'vue'
import TableAddBusinessProduct from '@/views/Pages/Components/TableAddBusinessProduct.vue'
import { getBranchList, getTypePersonnelList } from '@/api/HumanResourceManagement'
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
import { ElCollapse, ElCollapseItem, ElButton } from 'element-plus'
import { RendererElement, RendererNode, VNode } from 'vue'
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

const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })

type apiType = <T = any>(option: any) => Promise<IResponse<T>>
interface Collapse {
  icon: VNode<RendererNode, RendererElement, { [key: string]: any }>
  name: string
  title: string
  columns: TableColumn[]
  api: apiType | undefined
  buttonAdd: string
  buttons: number
  expand: boolean
  apiTableChild: apiType | undefined
  columnsTableChild: TableColumn[] | undefined
}
const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'information',
    title: 'Thông tin sản phẩm',
    columns: columnProfileProduct,
    api: getBranchList,
    buttonAdd: '',
    buttons: 1,
    expand: false,
    apiTableChild: undefined,
    columnsTableChild: undefined
  },
  {
    icon: plusIcon,
    name: 'priceCharacteristics',
    title: 'Bảng đặc tính và giá bán',
    columns: featuresPrice,
    api: getFeaturesPrices,
    buttonAdd: 'Thêm đặc tính và giá bán',
    buttons: 2,
    expand: true,
    apiTableChild: getPriceByQuantity,
    columnsTableChild: columnsPriceByQuantity
  },
  {
    icon: plusIcon,
    name: 'rentalPriceCharacteristics ',
    title: 'Bảng đặc tính và giá cho thuê',
    columns: featuresRentalPrice,
    api: getFeaturesRentalPrice,
    buttonAdd: 'Thêm đặc tính và giá cho thuê',
    buttons: 2,
    expand: true,
    apiTableChild: getPriceByQuantity,
    columnsTableChild: columnsPriceByQuantity
  },
  {
    icon: plusIcon,
    name: 'depositFee',
    title: 'Bảng đặc tính và phí kí gửi',
    columns: featuresDepositFee,
    api: getFeaturesDepositFee,
    buttonAdd: 'Thêm đặc tính và phí kí gửi',
    buttons: 2,
    expand: false,
    apiTableChild: undefined,
    columnsTableChild: undefined
  },
  {
    icon: plusIcon,
    name: 'pawnFee',
    title: 'Bảng đặc tính và phí cầm đồ',
    columns: featuresPawnFee,
    api: getFeaturesPawnFee,
    buttonAdd: 'Thêm đặc tính và phí cầm đồ',
    buttons: 2,
    expand: false,
    apiTableChild: undefined,
    columnsTableChild: undefined
  },
  {
    icon: plusIcon,
    name: 'SpaPrice',
    title: 'Bảng giá dịch vụ spa',
    columns: spaPrice,
    api: getSpaLPrice,
    buttonAdd: 'Thêm dịch vụ và phí spa',
    buttons: 2,
    expand: false,
    apiTableChild: undefined,
    columnsTableChild: undefined
  },
  {
    icon: plusIcon,
    name: 'inventoryTrading',
    title: 'Tổng hợp tồn kho & kinh doanh',
    columns: inventoryTrading,
    api: getInventoryTrading,
    buttonAdd: 'Thêm đặc tính',
    buttons: 2,
    expand: true,
    apiTableChild: getImportAndExportHistory,
    columnsTableChild: columnsImportAndExportHistory
  },
  {
    icon: plusIcon,
    name: 'managementSeo',
    title: 'Quản lý SEO',
    columns: columnManagementSeo,
    api: getTypePersonnelList,
    buttonAdd: '',
    buttons: 3,
    expand: false,
    apiTableChild: undefined,
    columnsTableChild: undefined
  }
]
let currentCollapse = ref<string>(collapse[0].name)
const collapseChangeEvent = (val) => {
  if (val) {
    collapse.forEach((el) => {
      if (val.includes(el.name)) el.icon = minusIcon
      else if (el.icon == minusIcon) el.icon = plusIcon
    })
  } else
    collapse.forEach((el) => {
      el.icon = plusIcon
    })
}
const activeName = ref('information')
</script>
<template>
  <div class="demo-collapse">
    <el-collapse v-model="activeName" :collapse="collapse" @change="collapseChangeEvent">
      <el-collapse-item
        v-for="(item, index) in collapse"
        :key="index"
        :name="item.name"
        v-model="currentCollapse"
      >
        <template #title>
          <el-button class="header-icon" :icon="item.icon" link />
          <span class="text-center">{{ item.title }}</span>
        </template>
        <TableAddBusinessProduct
          :schema="item.columns"
          :title="item.title"
          :buttons="item.buttons"
          :backButton="false"
          :titleButtons="item.buttonAdd"
          :api="item.api"
          :key="index"
          :columns="item.columns"
          :expand="item.expand"
          :apiTableChild="item.apiTableChild"
          :columnsTableChild="item.columnsTableChild"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<style scoped>
.header-icon {
  margin: 10px;
}
.text-center {
  font-size: 20px;
}
</style>
