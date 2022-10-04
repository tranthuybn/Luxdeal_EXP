<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ElCollapse, ElCollapseItem, ElButton, ElTable, ElTableColumn } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/store/modules/app'

import { Collapse } from '../../Components/Type'

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

const eyeIcon = useIcon({ icon: 'emojione-monotone:eye-in-speech-bubble' })
const editIcon = useIcon({ icon: 'akar-icons:chat-edit' })
const trashIcon = useIcon({ icon: 'fluent:delete-12-filled' })

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

const tableData = [
  {
    name: 'Platinum',
    image: '',
    ratings: 'Theo tháng',
    sales: '20,000,000 đ',
    createDate: '02/07/2022',
    creator: 'Bùi Hiển',
    status: 'Đang hoạt động'
  },
  {
    name: 'Platinum',
    image: '',
    ratings: 'Theo quý',
    sales: '20,000,000 đ',
    createDate: '02/07/2022',
    creator: 'Bùi Hiển',
    status: 'Đang hoạt động'
  },
  {
    name: 'Platinum',
    image: '',
    ratings: 'Theo năm',
    sales: '20,000,000 đ',
    createDate: '02/07/2022',
    creator: 'Bùi Hiển',
    status: 'Đang hoạt động'
  },
  {
    name: 'Gold',
    image: '',
    ratings: 'Theo tháng',
    sales: '20,000,000 đ',
    createDate: '02/07/2022',
    creator: 'Bùi Hiển',
    status: 'Đang hoạt động'
  }
]

const { push } = useRouter()
const router = useRouter()
const appStore = useAppStore()
const Utility = appStore.getUtility
const pushAdd = () => {
  console.log('router: ', `${String(router.currentRoute.value.name)}.${Utility}`)

  push({
    name: `${String(router.currentRoute.value.name)}.${Utility}`
  })
}
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
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="name" :label="t('customerList.rankName')" width="720" />
          <el-table-column prop="image" :label="t('customerList.picture')" width="120" />
          <el-table-column prop="ratings" :label="t('customerList.ratings')" width="150" />
          <el-table-column prop="sales" :label="t('customerList.sales')" width="150" />
          <el-table-column prop="createDate" :label="t('reuse.createDate')" width="150" />
          <el-table-column prop="creator" :label="t('customerList.creator')" width="150" />
          <el-table-column prop="status" :label="t('reuse.status')" width="150" />
          <el-table-column :label="t('reuse.operator')" width="180">
            <template #default>
              <div class="flex">
                <ElButton @click="pushAdd" :icon="eyeIcon" />
                <ElButton @click="pushAdd" :icon="editIcon" />
                <ElButton :icon="trashIcon" />
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pt-4">
          <el-button @click="pushAdd">+ Thêm xếp hạng</el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<style scoped>
::v-deep(.el-select) {
  width: 100%;
}

::v-deep(.el-textarea__inner) {
  box-shadow: none;
  padding: 5px 0;
}

::v-deep(.el-form-item) {
  display: flex;
  align-items: center;
}

::v-deep(.el-upload--picture-card) {
  width: 160px;
  height: 40px;
  border: 1px solid #409eff;
}

::v-deep(.d-block > .el-row) {
  display: block;
}

::v-deep(.el-form-item__content) {
  display: block;
}

@media only screen and (min-width: 1920px) {
  ::v-deep(.el-col-xl-12) {
    max-width: 100%;
  }
}

::v-deep(label) {
  color: #828387;
}

::v-deep(.cell) {
  color: #303133;
}

::v-deep(.el-divider__text) {
  font-size: 16px;
}

.el-button--text {
  margin-right: 15px;
}

::v-deep(.el-input) {
  width: auto;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

::v-deep(.el-dialog__body) {
  padding-top: 0;
}

::v-deep(.el-dialog__header) {
  padding-bottom: 0;
}

::v-deep(.el-table th.el-table__cell) {
  padding: 0 !important;
}

::v-deep(.el-input) {
  width: fit-content;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

::v-deep(.el-dropdown-menu__item) {
  padding: 5px 30px;
}

::v-deep(.el-table .cell) {
  word-break: break-word;
}

::v-deep(.el-select .el-input) {
  width: 100% !important;
}

::v-deep(.el-button--large) {
  padding: 12px 18px;
}

.fix-label-color > .el-radio {
  color: transparent;
}

::v-deep(.fix-label-color > .el-radio > .el-radio__label) {
  color: transparent;
}
</style>
