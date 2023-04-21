<script lang="ts" setup>
import { ElPopover, ElButton, ElSelect, ElOption } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { ref, reactive, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { getOptionsBySearch } from '@/utils/get_filterList'

const { t } = useI18n()
const ArrowDown = useIcon({ icon: 'ic:sharp-keyboard-arrow-down' })

const emit = defineEmits(['filter-select', 'cancel'])
// eslint-disable-next-line vue/require-prop-types
const props = defineProps(['field', 'apiToFilter', 'paramsToFilter', 'typeOfSearch'])
const propParams = props.paramsToFilter || {}
const propField = ref(props.field)
const KeySearch = props.typeOfSearch || 'Search'
const value = ref<string>('')
const loading = ref(false)
interface IOptions {
  text: string
  value: string | number
}
const options = ref([{} as IOptions])
watch(value, (newValue) => {
  if (newValue.length) {
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

const remoteMethod = (query: string) => {
  // Only search when query is at least 2 characters long
  if (query.length >= 2) {
    loading.value = true
    setTimeout(async () => {
      const params : [() => void, string, object] = reactive([props.apiToFilter, t('reuse.cantGetFilterList'), {[`${KeySearch}`]: query, ...propParams}])
      loading.value = false
      await getOptionsBySearch(...params)
      .then((res) => {
        options.value = res
      })
      .catch(() => {
        options.value = []
      })
    }, 200)
  } else {
    options.value = []
  }
}

// const handleScroll = async (event) => {
//   if(props.apiHasPagination) {
//     const target = event.target;
//     const bottomReached = target.scrollHeight - target.scrollTop === target.clientHeight;
//     if (bottomReached) {
//       // Increase pageIndex and fetch more data
//       pageIndex.value += 1;
//       // Append new items to options
//     }
//   }
// };

</script>
<template>
  <el-popover placement="bottom" trigger="click" width="fit-content" hide-on-click-modal>
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
      :teleported="false"
    >
    <div id="option-wrap">
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
    max-height: 200px;
    padding: 0 10px;
    overflow: auto;
  }
</style>