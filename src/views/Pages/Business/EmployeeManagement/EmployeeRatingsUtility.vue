<script setup lang="ts">
import {  ref, onBeforeMount, reactive } from 'vue'
import { Collapse } from '../../Components/Type'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { ElCollapse, ElCollapseItem, ElButton, ElRow, ElCol, ElDivider } from 'element-plus'
import { useRouter } from 'vue-router'
import {
  ElTable,
  ElTableColumn,
  ElNotification
} from 'element-plus'

import { getStaffList } from '@/api/Business'

const { t } = useI18n()
const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)

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

onBeforeMount(() => {
  getTableValue()
})

//get data
const formValue = ref()
const getTableValue = async () => {
  if (!isNaN(id) && type == 'detail') {
    const res = await getStaffList({ Id: id })
    if (res) {
      if (res.data?.list !== undefined) {
        formValue.value = res.data.list[0]
      } else {
        formValue.value = res.data
      }
      await setFormValue()
    } else {
      ElNotification({
        message: t('reuse.cantGetData'),
        type: 'warning'
      })
    }
  }
}

interface InfoEmployee {
  employeeCode: string
  employeeName: string
  phoneNumber: string
  email: string
  branch: string
  department: string
  typeEmployee: string
  rankEmployee:string
}
interface SalesTrackingBorad {
  orderCode: string
  orderValue: number
  percentageSale: number
  sales: number
  dateOrder: string
}

const infoEmployeeTable = reactive([] as Array<InfoEmployee> )
const salesTrackingTable = reactive([] as Array<SalesTrackingBorad>)
const setFormValue = () => {
  const data = formValue.value
  infoEmployeeTable[0].employeeCode = data.employeeCode
  infoEmployeeTable[0].employeeName = data.employeeName
  infoEmployeeTable[0].phoneNumber = data.phoneNumber
  infoEmployeeTable[0].email = data.email
  infoEmployeeTable[0].branch = data.branch
  infoEmployeeTable[0].department = data.department

  salesTrackingTable[0].orderCode = data.orderCode
  salesTrackingTable[0].orderValue = data.orderValue
  salesTrackingTable[0].percentageSale = data.percentageSale
  salesTrackingTable[0].sales = data.sales
  salesTrackingTable[0].dateOrder = data.dateOrder
}


</script>

<template>
  <div class="demo-collapse dark:bg-[#141414]">
    <el-collapse v-model="activeName" @change="collapseChangeEvent">
      <el-collapse-item :name="collapse[0].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[0].icon" link />
          <span class="text-center text-xl ml-3">{{ collapse[0].title }}</span>
        </template>

        <ElRow class="pl-8" :gutter="20" justify="space-between">
           <ElCol :span="12">
              <ElDivider contentPosition="left">{{ t('formDemo.generalInformation') }}</ElDivider>
              <el-table :data="infoEmployeeTable">
                <el-table-column fixed prop="employeeCode" :label="t('reuse.employeeCode')" min-width="200" />
                <el-table-column prop="employeeName" :label="t('reuse.employeeName')" min-width="200" />
                <el-table-column prop="phoneNumber" :label="t('reuse.phoneNumber')" min-width="200" />
                <el-table-column prop="email" :label="t('reuse.email')" min-width="200" />
              </el-table>
           </ElCol>
           <ElCol :span="12">
              <ElDivider contentPosition="left">{{ t('formDemo.jobPosition') }}</ElDivider>
              <el-table :data="infoEmployeeTable">
                <el-table-column prop="branch" :label="t('reuse.branch')" min-width="600" />
                <el-table-column prop="department" :label="t('reuse.department')" min-width="120" />
                <el-table-column prop="typeEmployee" :label="t('reuse.type')" min-width="120" />
                <el-table-column prop="rankEmployee" :label="t('reuse.rank')" min-width="320" />
              </el-table>
           </ElCol>
        </ElRow>
      </el-collapse-item>
      <el-collapse-item :name="collapse[1].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[1].icon" link />
          <span class="text-center text-xl ml-3">{{ collapse[1].title }}</span>
        </template>
        <el-table :data="salesTrackingTable" border>
          <el-table-column prop="orderCode" :label="t('formDemo.orderCode')" min-width="794" />
          <el-table-column prop="orderValue" :label="t('formDemo.orderValue')" min-width="200" />
          <el-table-column prop="percentageSales" :label="t('formDemo.percentageSales')" min-width="200"/>
          <el-table-column prop="sales" :label="t('formDemo.sales')"  min-width="200"/>
          <el-table-column prop="day" :label="t('formDemo.day')" min-width="200"/>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped lang="less">
  ::v-deep(.el-divider__text){
    font-size: 15px;
    font-weight: 700;
  }
</style>
