<script setup lang="ts">
import productCategoryTable from '../../Components/TabsBase.vue'
import {
  colorCategories,
  sizeCategories,
  materialCategories,
  statusCategories,
  genderCategories
} from './CategoryManagement'
import { Tab } from '../../Components/Type'
import { useI18n } from '@/hooks/web/useI18n'
import { onBeforeMount, provide, reactive, ref, watch } from 'vue'
import { PRODUCTS_AND_SERVICES } from '@/utils/API.Variables'
import { getCategories, deleteCategory } from '@/api/LibraryAndSetting'
import { useRoute } from 'vue-router'
let params = reactive({ TypeName: '' })
provide('parameters', {
  params
})
const { t } = useI18n()
const tabs: Array<Tab> = [
  {
    name: PRODUCTS_AND_SERVICES[1].key,
    label: t('reuse.color'),
    api: getCategories,
    column: colorCategories,
    delApi: deleteCategory,
    titleAdd: 'reuse.addNewCharacteristicColor',
  },
  {
    name: PRODUCTS_AND_SERVICES[2].key,
    label: t('reuse.size'),
    api: getCategories,
    column: sizeCategories,
    delApi: deleteCategory,
    titleAdd: 'reuse.addNewCharacteristicSize',
  },
  {
    name: PRODUCTS_AND_SERVICES[3].key,
    label: t('reuse.material'),
    api: getCategories,
    column: materialCategories,
    delApi: deleteCategory,
    titleAdd: 'reuse.addNewCharacteristicMaterial',
  },
  {
    name: PRODUCTS_AND_SERVICES[4].key,
    label: t('reuse.status'),
    api: getCategories,
    column: statusCategories,
    delApi: deleteCategory,
    titleAdd: 'reuse.addNewCharacteristicStatus',
  },
  {
    name: PRODUCTS_AND_SERVICES[5].key,
    label: t('reuse.gender'),
    api: getCategories,
    column: genderCategories,
    delApi: deleteCategory,
    titleAdd: 'reuse.addNewCharacteristicGender',
  }
]

// const router = useRouter()
const route = useRoute()

const getCurrentTab = () => {
  const tab = String(route.params.tab)
  if (tab != ':tab') {
    changeParam(tab)
  } else {
    params.TypeName = 'mausac'
  }
}
let currentTab = ref('')

watch(
  () => params.TypeName,
  () => {
    currentTab.value = params.TypeName
  }
)

const changeParam = (val = '') => {
  if (val.length > 0) {
    params.TypeName = val
    currentTab.value = val
  }
  provide('parameters', {
    params
  })
}

onBeforeMount(() => {
  getCurrentTab()
})
</script>
<template>
  <productCategoryTable :tabs="tabs" @tab-change-event="changeParam" />
</template>
<style scoped>
::v-deep(.custom-empty > .el-empty) {
  padding: 5px 0;
}

::v-deep(.custom-empty .el-empty > .el-empty__description) {
  margin-top: 5px;
}

::v-deep(.el-table__row--level-1 > td > .cell > .custom-empty) {
  padding-left: 5rem;
}
</style>
