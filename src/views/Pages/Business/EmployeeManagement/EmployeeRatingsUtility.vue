<script setup lang="ts">
import {  ref, onBeforeMount, reactive } from 'vue'
import { Collapse } from '../../Components/Type'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { ElCollapse, ElCollapseItem, ElButton, ElRow, ElCol, ElDivider } from 'element-plus'
import { useRouter } from 'vue-router'
// import TableDataBase from '../../Components/TableDataBase.vue'
import {
  ElTable,
  ElTableColumn,
  ElNotification
} from 'element-plus'
import { getEmployeeRatingList, getEmployeeSaleTrackingList } from '@/api/Business'
import { moneyFormat } from '@/utils/format'
import moment from 'moment';

const escape = useIcon({ icon: 'quill:escape' })
const back = async () => {
  push({
    name: 'business.employee-management.employeeRatings'
  })
}

const { t } = useI18n()
const { push } = useRouter()
const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)
const startDate = String(router.currentRoute.value.params.startDate)
const endDate = String(router.currentRoute.value.params.endDate)
const formartDate = (date) => {
  if(date) return moment(date, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
  return ''
}
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
    title: `${t('formDemo.salesTrackingTable')} ${formartDate(startDate)} đến ngày ${formartDate(endDate)} `,
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
  callAPISalesTracking()
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

//get data
let infoEmployeeRes = reactive({} as InfoEmployee)
const callAPIInfoEmployee = async () => {
  if (!isNaN(id) && type == 'detail') {
    const res = await getEmployeeRatingList({ Id: id })
    if (res) {
      if (res.data?.list !== undefined) {
        infoEmployeeRes = res.data.list[0]
      } else {
        infoEmployeeRes = res.data[0]
      }
      await setInfoEmployeeTableValue()
    } else {
      ElNotification({
        message: t('reuse.cantGetData'),
        type: 'warning'
      })
    }
  }
}

let saleTrackingRes :any = reactive([])
const callAPISalesTracking= async () => {
  if (!isNaN(id) && type == 'detail') {
    const res = await getEmployeeSaleTrackingList({ Id: id, StartDate: startDate, EndDate: endDate })
    console.log('res', res)
    if (res) {
      if (res.data?.list !== undefined) {
        saleTrackingRes = res.data.list[0]
      } else {
        saleTrackingRes = res
      }
      await setSalesTrackingTableValue()
    } else {
      ElNotification({
        message: t('reuse.cantGetData'),
        type: 'warning'
      })
    }
  }
}

interface SaleTracking {
  dateOrder: string
  orderCode: string
  orderValue: number
  sales: number
  percentageSale: number
}

const infoEmployeeTable = reactive({
  generalInfo: {},
  positionInfo: {} 
})
const salesTrackingTable = reactive([] as Array<SaleTracking>)
const totalSales = ref()
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

const setSalesTrackingTableValue = () => {
  const newArr = saleTrackingRes.map(item => 
    ({
      dateOrder: formartDate(item.dateOrder),
      orderCode: item.orderCode,
      orderValue: moneyFormat(item.orderValue),
      sales: moneyFormat(item.sales),
      percentageSale: item.percentageSale,
    })
  )
  salesTrackingTable.push(...newArr)
  totalSales.value = moneyFormat(saleTrackingRes.reduce((total, item) => {
    return total + item.sales
  }, 0))
}

// const columns = reactive<TableColumn[]>([
//   {
//     field: 'orderCode',
//     label: t('formDemo.orderCode'),
//     minWidth: '794',
//     align: 'center',
//   },
//   {
//     field: 'orderValue',
//     label: t('formDemo.orderValue'),
//     minWidth: '200',
//     headerAlign: 'left',
//   },
//   {
//     field: 'percentageSale',
//     label: t('formDemo.percentageSales'),
//     minWidth: '200',
//     headerAlign: 'left',
//   },
//   {
//     field: 'sales',
//     label: t('formDemo.sales'),
//     minWidth: '200',
//     headerAlign: 'left',
//   },
//   {
//     field: 'dateOrder',
//     label: t('formDemo.day'),
//     minWidth: '200',
//     headerAlign: 'left',
//   } 
// ])

const getSummaries = (param) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((column, index) => {
    const values = data.map((item) => Number(item[column.property]))
    if (!values.every((value) => Number.isNaN(value))) {
      sums[index] = `${values.reduce((prev, curr) => {
        const value = Number(curr)
        if (!Number.isNaN(value)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0)} đ`
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
        <el-table :summary-method="getSummaries" :data="salesTrackingTable" border>
          <template #append >
            <span v-if="totalSales"  class="p-[1368px] pt-3 font-bold">{{ totalSales }}</span>
          </template>
          <el-table-column prop="orderCode" :label="t('formDemo.orderCode')" min-width="794" />
          <el-table-column prop="orderValue" header-align="left" align="right" :label="t('formDemo.orderValue')" min-width="200" />
          <el-table-column prop="percentageSale"  header-align="left" align="center" :label="t('formDemo.percentageSales')" min-width="200"/>
          <el-table-column prop="sales"  header-align="left" align="right" :label="t('formDemo.sales')"  min-width="200"/>
          <el-table-column prop="dateOrder" :label="t('formDemo.day')" min-width="200"/>
        </el-table>
        <!-- <TableDataBase 
          :removeHeaderFilter="true" 
          :selection="false"
          :api="getEmployeeSaleTrackingList"
          :columns="columns" 
          :removeDrawer="true"
          /> -->
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped lang="less">
  ::v-deep(.el-divider__text){
    font-size: 15px;
    font-weight: 700;
  }
  ::v-deep(.el-table__append-wrapper){
    padding: 10px 0;
  }
</style>
