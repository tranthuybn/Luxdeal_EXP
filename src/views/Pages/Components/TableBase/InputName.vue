<script lang="ts" setup>
import { ElPopover, ElButton, ElSelect, ElOption } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { ref, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()
const ArrowDown = useIcon({ icon: 'ic:sharp-keyboard-arrow-down' })


const emit = defineEmits(['filter-select', 'cancel'])
// eslint-disable-next-line vue/require-prop-types
const props = defineProps(['field'])
const propField = ref(props.field)

const value = ref<string>('')
const loading = ref(false)

const options = ref([
  {
    label:'', 
    value:''
  }])

watch(value, (newValue) => {
  if (newValue !== '') {
    const objValue = {}
    objValue[propField.value] = newValue
    emit('filter-select', objValue)
  }
})

const clear = () => {
  emit('cancel', propField.value)
}
</script>
<template>
  <el-popover placement="bottom" trigger="click" width="fit-content">
    <template #reference>
      <el-button :icon="ArrowDown" text style="padding: 0" />
    </template>
    <el-select
      v-model="value"
      filterable
      clearable
      remote
      reserve-keyword
      :placeholder="t('reuse.inputName')"
      :loading="loading"
      @clear="clear"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </el-popover>
</template>
