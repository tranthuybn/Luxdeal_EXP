<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter } from 'vue-router'
import {
  ElCollapse,
  ElCollapseItem,
  ElUpload,
  ElSelect,
  ElOption,
  ElCheckbox,
  ElButton,
  ElDivider,
  ElTable,
  ElTableColumn,
  ElInput,
  ElRadioGroup,
  ElRadio,
  ElDialog,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElDatePicker,
  ElForm,
  ElFormItem,
  ElMessage,
  ElNotification,
  ElTreeSelect,
  UploadProps,
  UploadUserFile
} from 'element-plus'
// const { currentRoute } = useRouter()
const { t } = useI18n()
</script>

<template>
  <el-divider content-position="left">Thông tin đề nghị thanh toán</el-divider>
</template>

<style></style>
