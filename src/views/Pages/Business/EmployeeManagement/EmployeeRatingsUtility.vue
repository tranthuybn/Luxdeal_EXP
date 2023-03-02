<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Collapse } from '../../Components/Type'
import {getStaffList } from '@/api/Business'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { ElCollapse, ElCollapseItem, ElButton } from 'element-plus'
import TableOperator from './TableOperator.vue'
import { useRouter } from 'vue-router'
import { API_URL } from '@/utils/API_URL'


const { t } = useI18n()
const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)

const schema = reactive<FormSchema[]>([])

// Show | Hiden detail utility
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'generalInformation',
    title: t('formDemo.employeeDetail'),
    columns: [],
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
    customOperator: 1
  },
  {
    icon: minusIcon,
    name: 'generalInformation',
    title: t('formDemo.salesTrackingTable'),
    columns: [],
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

]
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
const activeName = ref(collapse[0].name)
//

type SetFormData = {
  code: string
  promotion: number
  reduce: number
  date: any
  shortDescription: string
  customers: any
  products: any
  Image: any
  target: number
  percent: number
  money: number
  imageurl?: string
}
const emptyFormData = {} as SetFormData
const setFormData = reactive(emptyFormData)

const customizeData = async (data) => {
  setFormData.code = data[0].code
  setFormData.date = [data[0].fromDate, data[0].toDate]
  setFormData.shortDescription = data[0].description
  setFormData.customers = data[0].customers
  setFormData.products = data[0].productProperties
  setFormData.Image = data[0].images[0].path
  setFormData.target = data[0].targetType
  setFormData.imageurl = `${API_URL}${data[0].images[0].path}`
}

</script>

<template>
  <div class="demo-collapse dark:bg-[#141414]">
    <el-collapse v-model="activeName" @change="collapseChangeEvent">
      <el-collapse-item :name="collapse[0].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[0].icon" link />
          <span class="text-center text-xl">{{ collapse[0].title }}</span>
        </template>
        <TableOperator
          ref="formRef" 
          :schema="schema" 
          :type="type" 
          :id="id" 
          :multipleImages="false"
          :apiId="getStaffList" 
          @customize-form-data="customizeData" 
          :formDataCustomize="setFormData"
          :show-product="true" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
