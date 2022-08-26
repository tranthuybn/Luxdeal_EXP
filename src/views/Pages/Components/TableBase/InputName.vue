<script lang="ts" setup>
import { ElPopover, ElButton, ElSelect, ElOption } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { ref, watch } from 'vue'
import { useTable } from '@/hooks/web/useTable'
import { TableData } from '@/api/table/types'
import { getPurchaseOrderList } from '@/api/Purchase'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
const ArrowDown = useIcon({ icon: 'ic:sharp-keyboard-arrow-down' })
const { tableObject, methods } = useTable<TableData>({
  getListApi: getPurchaseOrderList,
  response: {
    list: 'list',
    total: 'total'
  }
})

const { getList } = methods
const emit = defineEmits(['filter-select', 'cancel'])
// eslint-disable-next-line vue/require-prop-types
const props = defineProps(['field'])
const propField = ref(props.field)
interface ListItem {
  value: string
  label: string
}

const list = ref<ListItem[]>([])
let options = ref<ListItem[]>([])
const value = ref<string>('')
const loading = ref(false)

const remoteMethod = (query: string) => {
  if (query) {
    loading.value = true
    options.value = list.value.filter((item) => {
      return item.label.toLowerCase().includes(query.toLowerCase())
    })
    loading.value = false
  } else {
    options.value = []
  }
}
watch(value, (newValue) => {
  if (newValue !== '') {
    const objValue = {}
    objValue[propField.value] = newValue
    emit('filter-select', objValue)
  }
})
//fix cung field = creator de lay api
const field = 'creator'
const setValuesForFilter = async () => {
  loading.value = true
  await getList()
  loading.value = false
  options.value = tableObject.tableList.map((item) => ({
    value: item[field],
    label: item[field]
  }))
}
const clear = () => {
  emit('cancel', propField.value)
}
</script>
<template>
  <el-popover placement="bottom" trigger="click" width="fit-content">
    <template #reference>
      <el-button :icon="ArrowDown" text style="padding: 0" @click="setValuesForFilter" />
    </template>
    <el-select
      v-model="value"
      filterable
      clearable
      remote
      reserve-keyword
      :placeholder="t('reuse.inputName')"
      :remote-method="remoteMethod"
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
