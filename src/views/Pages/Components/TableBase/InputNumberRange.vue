<script lang="ts" setup>
import { ElPopover, ElButton, ElInput, ElDivider } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
// eslint-disable-next-line vue/require-prop-types
const props = defineProps(['field'])
const field = ref(props.field)
const emit = defineEmits(['confirm'])
const inputFrom = ref('')
const inputTo = ref('')
const confirm = () => {
  var arrValue = [inputFrom.value, inputTo.value]
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
  <el-popover placement="bottom" trigger="click" width="fit-content">
    <template #reference>
      <el-button :icon="ArrowDown" text />
    </template>
    <div>
      <span>{{ t('reuse.from') }}</span>
      <el-input v-model="inputFrom" :placeholder="t('reuse.placeholderNumber')"
    /></div>
    <div>
      <span>{{ t('reuse.to') }}</span>
      <el-input v-model="inputTo" :placeholder="t('reuse.placeholderNumber')"
    /></div>
    <el-divider />
    <el-button @click="confirm">{{ t('reuse.confirm') }}</el-button>
    <el-button @click="cancel">{{ t('reuse.cancel') }}</el-button>
  </el-popover>
</template>
