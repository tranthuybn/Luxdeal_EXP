<script setup lang="ts">
import { h, reactive, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ElCollapse, ElCollapseItem, ElButton } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { getCustomerRatings } from '@/api/Business'
import { Collapse } from '../../Components/Type'
import { filterProductStatus } from '@/utils/filters'
import { setImageDisplayInDOm } from '@/utils/domUtils'
import {
  dateTimeFormat,
  formatCustomerRatings,
  moneyFormat,
  productStatusTransferToText
} from '@/utils/format'
import TableDataBase from '../../Components/TableDataBase.vue'

const { t } = useI18n()

const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })

const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'rankMonth',
    title: t('customerList.rankMonth'),
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
  }
]

const collapseChangeEvent = (val) => {
  if (val) {
    collapse.forEach((el) => {
      if (val.includes(el.name)) el.icon = minusIcon
      else if (el.icon == minusIcon) el.icon = plusIcon
    })
  } else {
    collapse.forEach((el) => {
      el.icon = plusIcon
    })
  }
}
const activeName = ref(collapse[0].name)

const { push } = useRouter()
const router = useRouter()
const appStore = useAppStore()
const Utility = appStore.getUtility
const pushAdd = () => {
  push({
    name: `${String(router.currentRoute.value.name)}.${Utility}`,
    params: { type: 'add', backRoute: String(router.currentRoute.value.name) }
  })
}
const columns = reactive<TableColumn[]>([
  {
    field: 'name',
    label: t('customerList.rankName'),
    minWidth: '450',
    headerAlign: 'left',
    align: 'left'
  },
  {
    field: 'imageUrl',
    label: t('reuse.image'),
    minWidth: '150',
    formatter: (record: Recordable, column: TableColumn, cellValue: TableSlotDefault) =>
      setImageDisplayInDOm(record, column, cellValue)
  },
  {
    field: 'rating',
    label: t('customerList.ratings'),
    minWidth: '200',
    align: 'left',
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return h('div', formatCustomerRatings(cellValue))
    }
  },
  {
    field: 'sales',
    label: t('customerList.sales'),
    minWidth: '200',
    align: 'right',
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return moneyFormat(cellValue)
    }
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '200',
    align: 'right',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'updatedBy',
    label: t('reuse.creator'),
    minWidth: '150',
    align: 'left',
    headerFilter: 'Name'
  },
  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '150',
    align: 'left',
    filters: filterProductStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return h('div', productStatusTransferToText(cellValue))
    }
  }
])
</script>

<template>
  <div class="demo-collapse dark:bg-[#141414]">
    <el-collapse
      v-model="activeName"
      @change="collapseChangeEvent"
      :class="[
        'bg-[var(--el-color-white)] dark:(bg-[var(--el-color-black)] border-[var(--el-border-color)] border-1px) p-4'
      ]"
    >
      <el-collapse-item :name="collapse[0].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[0].icon" link />
          <span class="text-center text-xl">{{ collapse[0].title }}</span>
        </template>
        <TableDataBase
          :columns="columns"
          :api="getCustomerRatings"
          :selection="false"
          :remove-drawer="true"
          :remove-header-filter="true"
          :pagination="false"
        />
        <div class="pt-4">
          <el-button @click="pushAdd">+ {{ t('customerList.addRanking') }}</el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<style scoped>
:deep(.el-card__body) {
  height: 69vh;
}
</style>
