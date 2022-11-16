<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElDivider, ElDialog } from 'element-plus'
const { t } = useI18n()
defineProps({
  showDialog: {
    type: Boolean,
    default: false
  }
})
const closeDialog = () => {
  emit('close-dialog-warehouse')
}
const emit = defineEmits(['close-dialog-warehouse'])
</script>
<template>
  <el-dialog
    :model-value="showDialog"
    :title="t('formDemo.inventoryInformation')"
    width="35%"
    align-center
    class="z-50"
    @close="closeDialog"
  >
    <el-divider />
    <template #footer>
      <span class="dialog-footer">
        <el-button class="w-[150px]" type="primary" @click="closeDialog"
          >{{ t('reuse.save') }}
        </el-button>
        <el-button class="w-[150px]" @click="closeDialog">{{ t('reuse.exit') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>
