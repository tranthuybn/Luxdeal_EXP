<script setup lang="ts">
import tableDatetimeFilterBasicVue from '../../Components/TabsBase.vue'
import { getCategories } from '@/api/LibraryAndSetting'
import { getWareHouseList, getWareHouseTransactionList, getListWareHouse } from '@/api/Business'
import { wareHouse, wareHouseContainer } from '../Warehouse'
import { Tab } from '../../Components/Type'
import { provide } from 'vue';
import { PRODUCTS_AND_SERVICES } from '@/utils/API.Variables'

const tabs: Array<Tab> = [
  {
    name: 'followinventory',
    label: 'Theo dõi tồn kho',
    api: getWareHouseList,
    column: wareHouse,
    customOperator: 4
  },
  {
    name: 'wareHouse',
    label: 'Lịch sử nhập/xuất/chuyển kho',
    api: getWareHouseTransactionList,
    column: wareHouseContainer,
    customOperator: 3
  }
]
const apiToFilter = {
  ['typeOfTransfer']: getCategories,
  ['warehouse']: getListWareHouse
}
const paramsToFilter = {
  ['typeOfTransfer']: {TypeName: PRODUCTS_AND_SERVICES[0].key}
}

const typeOfSearch = {
  ['warehouse']: 'Keyword'
}

provide('apiToFilter', apiToFilter)
provide('paramsToFilter', paramsToFilter)
provide('typeOfSearch', typeOfSearch)

const typeTable = 'Warehouse'
</script>
<template>
  <tableDatetimeFilterBasicVue title="orderList" :tabs="tabs" :customHeaderButton="typeTable" />
</template>
<style scoped>
::v-deep(.custom-empty > .el-empty) {
  padding: 5px 0;
}

::v-deep(.custom-empty .el-empty > .el-empty__description) {
  margin-top: 5px;
}
</style>
