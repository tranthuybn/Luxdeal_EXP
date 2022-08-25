<script lang="ts" setup>
import { ElPopover, ElButton, ElSelect, ElOption } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { onMounted, ref, watch } from 'vue'
const emit = defineEmits(['filter-select'])
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

onMounted(() => {
  list.value = values.map((item) => {
    return { value: `${item}`, label: `${item}` }
  })
})

const remoteMethod = (query: string) => {
  if (query) {
    loading.value = true
    setTimeout(() => {
      loading.value = false
      options.value = list.value.filter((item) => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
    }, 200)
  } else {
    options.value = []
  }
}
watch(value, (newValue) => {
  console.log(newValue)
  if (newValue !== '') {
    const objValue = {}
    objValue[propField.value] = newValue
    console.log('obj', objValue)
    emit('filter-select', objValue)
  }
})
const values = ['a', 'b', 'c', 'd']
</script>
<template>
  <el-popover placement="bottom" trigger="click" width="fit-content">
    <template #reference>
      <el-button :icon="ArrowDown" text style="padding: 0" />
    </template>
    <el-select
      v-model="value"
      filterable
      remote
      reserve-keyword
      placeholder="Please enter a keyword"
      :remote-method="remoteMethod"
      :loading="loading"
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
