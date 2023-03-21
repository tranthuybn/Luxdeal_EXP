<script lang="ts" setup>
import { ElPopover, ElButton, ElSelect, ElOption } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { ref, reactive, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { getFilterList } from '@/utils/get_filterList'

const { t } = useI18n()
const ArrowDown = useIcon({ icon: 'ic:sharp-keyboard-arrow-down' })


const emit = defineEmits(['filter-select', 'cancel'])
// eslint-disable-next-line vue/require-prop-types
const props = defineProps(['field', 'apiHasPagination', 'apiToFilter'])
const propField = ref(props.field)

const value = ref<string>('')
const loading = ref(false)
const filterList = ref()
interface IOptions {
  text: string
  value: string | number
}
const options = ref([{} as IOptions])

watch(value, (newValue) => {
  if (newValue !== '') {
    const objValue = reactive({})
    objValue[propField.value] = newValue
    for (const key in objValue) {
      if (Array.isArray(objValue[key])) {
        objValue[key] = objValue[key].join(',')
      }
    }
    emit('filter-select', objValue)
  }
})

const clear = () => {
  emit('cancel', propField.value)
}
const pageIndex = ref(1)
const pageSize = ref(100)
const params : [any, string, object?] = reactive([props.apiToFilter, t('reuse.cantGetFilterList')])

const remoteMethod = (query: string) => {
  // Only search when query is at least 2 characters long
  if (query.length >= 2) {
    loading.value = true
    setTimeout(async () => {
      loading.value = false
      if(props.apiHasPagination && params.length === 2 ) params.push({pageIndex: pageIndex.value, pageSize: pageSize.value})
      filterList.value = await getFilterList(...params)
      options.value = filterList.value.filter((item) => {
        return item.text?.toLowerCase().includes(query.toLowerCase())
      })
    }, 200)
  } else {
    options.value = []
  }
}

const handleScroll = async (event) => {
  if(props.apiHasPagination) {
    const target = event.target;
    const bottomReached = target.scrollHeight - target.scrollTop === target.clientHeight;
    if (bottomReached) {
      // Increase pageIndex and fetch more data
      pageIndex.value += 1;
      // Append new items to options
    }
  }
};

watch(pageIndex, async (newPageIndex) => {
  params[2] = { pageIndex: newPageIndex, pageSize: pageSize.value };
  const response = await getFilterList(...params);
  if(response.length > 0) options.value.push(...response); 
});


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
      multiple
      remote
      reserve-keyword
      :remote-method="remoteMethod"
      :placeholder="t('reuse.inputName')"
      :loading="loading"
      @clear="clear"
    >
    <div @scroll="handleScroll" id="option-wrap">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.text"
        :value="item.value"
      />
    </div>
    </el-select>
  </el-popover>
</template>
<style lang="css" scoped>
  #option-wrap {
    height: 200px;
    padding: 0 10px;
    overflow: auto;
  }
</style>