<script lang="ts" setup>
import { ElPopover, ElButton, ElDatePicker, ElDivider } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
// eslint-disable-next-line vue/require-prop-types
const props = defineProps(['field'])
const field = ref(props.field)
const emit = defineEmits(['confirm'])
const dateValue = ref('')
const trigger = ref('click')
const confirm = () => {
  var arrValue = [dateValue.value[0], dateValue.value[1]]
  const objValue = {}
  objValue[field.value] = arrValue
  console.log(objValue[field.value])
  emit('confirm', objValue)
}
const cancel = () => {
  console.log('cancel')
}
</script>
<template>
  <el-popover placement="bottom" width="fit-content" :key="trigger">
    <template #reference>
      <el-button :icon="ArrowDown" text />
    </template>
    <el-date-picker
      v-model="dateValue"
      type="daterange"
      range-separator="To"
      start-placeholder="Start date"
      end-placeholder="End date"
      unlink-panels
      format="YYYY/MM/DD"
      value-format="YYYY-MM-DD"
    />
    <el-divider />
    <el-button @click="confirm">{{ t('reuse.confirm') }}</el-button>
    <el-button @click="cancel">{{ t('reuse.cancel') }}</el-button>
  </el-popover>
</template>
