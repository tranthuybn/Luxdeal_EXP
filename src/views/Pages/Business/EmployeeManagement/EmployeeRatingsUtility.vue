<script setup lang="ts">
import {  ref } from 'vue'
import { Collapse } from '../../Components/Type'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { ElCollapse, ElCollapseItem, ElButton, ElRow, ElCol, ElDivider } from 'element-plus'
// import { useRouter } from 'vue-router'
import {
  ElTable,
  ElTableColumn,
} from 'element-plus'

const { t } = useI18n()
// const router = useRouter()
// const id = Number(router.currentRoute.value.params.id)
// const type = String(router.currentRoute.value.params.type)

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
const tableData = ref([])

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
            <!-- Thông tin hiện ở dây -->
           </ElCol>
           <ElCol :span="12">
            <ElDivider contentPosition="left">{{ t('formDemo.jobPosition') }}</ElDivider>
            <!-- Vị trí làm việc ở đây -->
           </ElCol>
        </ElRow>
      </el-collapse-item>
      <el-collapse-item :name="collapse[1].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[1].icon" link />
          <span class="text-center text-xl ml-3">{{ collapse[1].title }}</span>
        </template>
        <el-table :data="tableData"  border>
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
