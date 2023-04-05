<script setup lang="ts">
import {  ref, onBeforeMount, reactive, provide } from 'vue'
import { Collapse } from '../../Components/Type'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { ElCollapse, ElCollapseItem, ElButton, ElRow, ElCol, ElDivider, ElNotification } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import TableDataBase from '../../Components/TableDataBase.vue'
import { getEmployeeById, getEmployeeSaleTrackingList } from '@/api/Business'
import { changeMoney, formartDate } from '@/utils/tsxHelper'
import { moneyFormat } from '@/utils/format'

const route = useRoute()
const escape = useIcon({ icon: 'quill:escape' })
const { t } = useI18n()
const { push } = useRouter()
const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)
const startDateFromQuery = String(route.query.startDate)
const endDateFromQuery = String(route.query.endDate)
const startDate = ref(startDateFromQuery)
const endDate = ref(endDateFromQuery)
const params = {Id: id, StartDate: startDate.value, EndDate: endDate.value}
const back = async () => {
  push({
    name: 'business.employee-management.employeeRatings'
  })
}
provide('parameters', {params} )

// Show | Hiden detail utility
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'generalInformation',
    title: t('formDemo.employeeDetail'),
  },
  {
    icon: plusIcon,
    name: 'salesTrackingInformation',
    title: `${t('formDemo.salesTrackingTable')} ${formartDate(startDate.value)} đến ngày ${formartDate(endDate.value)} `,
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
  callAPIInfoEmployee()
})

interface InfoEmployee {
  employeeCode: string
  employeeName: string
  phonenumber: string
  email: string
  branch: string
  department: string
  typeEmployee: string
  rankEmployee:string
}

//get data employee information
let infoEmployeeRes = reactive({} as InfoEmployee)
const callAPIInfoEmployee = async () => {
  if (!isNaN(id) && type == 'detail') {
    const res = await getEmployeeById({ Id: id })
    if (res) {
      infoEmployeeRes = res.data
      setInfoEmployeeTableValue()
    } else {
      ElNotification({
        message: t('reuse.cantGetData'),
        type: 'warning'
      })
    }
  }
}

const infoEmployeeTable = reactive({
  generalInfo: {},
  positionInfo: {} 
})

const setInfoEmployeeTableValue = () => {
    infoEmployeeTable.generalInfo[t('reuse.employeeCode')] = infoEmployeeRes.employeeCode
    infoEmployeeTable.generalInfo[t('reuse.employeeName')] = infoEmployeeRes.employeeName
    infoEmployeeTable.generalInfo[t('reuse.phoneNumber')] = infoEmployeeRes.phonenumber
    infoEmployeeTable.generalInfo[t('reuse.email')] = infoEmployeeRes.email
    
    infoEmployeeTable.positionInfo[t('reuse.branch')] = infoEmployeeRes.branch
    infoEmployeeTable.positionInfo[t('reuse.department')] = infoEmployeeRes.department
    infoEmployeeTable.positionInfo[t('reuse.type')] = infoEmployeeRes.typeEmployee
    infoEmployeeTable.positionInfo[t('reuse.rank')] = infoEmployeeRes.rankEmployee
}

// Set columns for sale tracking table
const columns = reactive<TableColumn[]>([
  {
    field: 'orderCode',
    label: t('formDemo.orderCode'),
    minWidth: '794',
  },
  {
    field: 'orderValue',
    label: t('formDemo.orderValue'),
    minWidth: '200',
    align: 'right',
    formatter: (_row, _column, cellValue) => changeMoney.format(parseInt(cellValue))
  },
  {
    field: 'percentageSale',
    label: t('formDemo.percentageSales'),
    minWidth: '200',
    align: 'center',
  },
  {
    field: 'sales',
    label: t('formDemo.sales'),
    minWidth: '200',
    align: 'right',
    formatter: (_row, _column, cellValue) => {
      if(cellValue) return changeMoney.format(parseInt(cellValue))
      return changeMoney.format(parseInt('0'))
    }
  },
  {
    field: 'dateOrder',
    label: t('formDemo.day'),
    minWidth: '200',
    formatter: (_row, _column, cellValue) => formartDate(cellValue)
  } 
])

// Get summary sales 
const getSummaries = (param) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((column, index) => {
    const values = data.map((item) => Number(item[column.property]))
    if (!values.every((value) => Number.isNaN(value)) && index === 3) {
      sums[index] = `${moneyFormat(values.reduce((prev, curr) => {
        const value = Number(curr)
        if (!Number.isNaN(value)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0))}`
    } else {
      sums[index] = ''
    }
  })
  return sums
}

</script>

<template>
  <div class="demo-collapse dark:bg-[#141414]">
    <el-collapse v-model="activeName" @change="collapseChangeEvent">
      <el-collapse-item :name="collapse[0].name">
        <template #title>
          <div class="flex w-full justify-between">
            <div class="before">
              <el-button class="header-icon" :icon="collapse[0].icon" link />
              <span class="text-center text-xl ml-3">{{ collapse[0].title }}</span>
            </div>
            <div @click="back()" class="after">
              <span class="text-center text-xl">{{ t('reuse.exit') }}</span>
              <el-button class="header-icon" :icon="escape" link />
            </div>
          </div>
        </template>

        <ElRow class="pl-8" :gutter="20" justify="space-between">
           <ElCol :span="12">
              <ElDivider contentPosition="left">{{ t('formDemo.generalInformation') }}</ElDivider>
              <el-row v-for="(infoValue, label, index) in infoEmployeeTable.generalInfo" :key="infoValue">
                <el-col :span="4" class="flex justify-end pr-2">{{ label }}</el-col>
                <el-col :class="{'font-bold': index === 0}" :span="20" class="">{{ infoValue }}</el-col>
              </el-row>
           </ElCol>
           <ElCol :span="12">
              <ElDivider contentPosition="left">{{ t('formDemo.jobPosition') }}</ElDivider>
              <el-row v-for="(infoValue, label, index) in infoEmployeeTable.positionInfo" :key="infoValue">
                <el-col :span="4" class="flex justify-end pr-2">{{ label }}</el-col>
                <el-col :class="{'font-bold': index === 0}" :span="20" class="bold">{{ infoValue }}</el-col>
              </el-row>
           </ElCol>
        </ElRow>
      </el-collapse-item>
      <el-collapse-item :name="collapse[1].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[1].icon" link />
          <span class="text-center text-xl ml-3">{{ collapse[1].title }}</span>
        </template>
        <TableDataBase 
          :removeHeaderFilter="true" 
          :selection="false"
          :api="getEmployeeSaleTrackingList"
          :columns="columns" 
          :removeDrawer="true"
          :showSummary="true"
          :getSummaries="getSummaries"
          :customOperator="6"
          :isOperatorColumnCustomize="true"
          />
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
