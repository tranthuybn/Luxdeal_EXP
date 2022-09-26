<script>
import {
  ElCollapse,
  ElCollapseItem,
  ElButton,
  ElTable,
  ElTableColumn,
  ElTreeSelect,
  ElInput,
  ElSwitch,
  ElNotification,
  ElDialog,
  ElForm,
  ElFormItem,
  FormInstance,
  ElSelect,
  ElOption
} from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter } from 'vue-router'
import { reactive, unref, watch } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { FORM_IMAGES } from '@/utils/format'
import { ref } from 'vue'
import { TableOperator } from '../../Components/TableBase'

const { t } = useI18n()
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const collapseChangeEvent = async (val) => {
  if (val && val.length > 0) {
    const collapseItem = collapse.find(
      (element) => ((nameCollapse = val.slice(-1)), element.name == nameCollapse)
    )
    if (collapseItem !== undefined) {
      await callTableApi(collapseItem)
    }
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
</script>
<template>
  <el-collapse
    v-model="activeName"
    @change="collapseChangeEvent"
    :class="[
      'bg-[var(--el-color-white)] dark:(bg-[var(--el-color-black)] border-[var(--el-border-color)] border-1px)'
    ]"
  >
    <el-collapse-item :name="'Chi tiet yeu cau thanh toan hoa hong'">
      <template #title>
        <el-button class="header-icon" :icon="collapse[0].icon" link />
        <span class="text-center">{{ collapse[0].title }}</span>
      </template>
    </el-collapse-item>
    <el-collapse-item :name="'Quan ly lich su doanh so va thanh toan hoa hong'">
      <template #title>
        <el-button class="header-icon" :icon="collapse[0].icon" link />
        <span class="text-center">{{ collapse[0].title }}</span>
      </template>
    </el-collapse-item>
  </el-collapse>
</template>
