<!-- eslint-disable vue/no-mutating-props -->
<script setup lang="ts">
import { ElRow, ElCol, ElOption, ElSelect, ElTreeSelect, ElMessage } from 'element-plus'
import { computed, ref, PropType, watch, onBeforeMount } from 'vue'
import { TableResponse } from '@/views/Pages/Components/Type'
import { TableData } from '@/api/table/types'
import { useI18n } from '@/hooks/web/useI18n'

const propsObj = defineProps({
  // columns name
  fields: {
    type: Array<string>,
    default: () => [],
    require: true,
    description: 'Tiêu đề của các cột'
  },
  // options
  items: {
    type: Array<any>,
    default: () => [],
    require: true,
    description: 'Mảng các giá trị truyền vào để chọn'
  },
  placeHolder: {
    type: String,
    default: 'Vui lòng chọn bản ghi'
  },
  type: {
    type: String,
    default: 'undefined'
  },
  // value key of record you want to use
  valueKey: {
    type: String,
    default: '',
    description: 'Chỉ định giá trị khóa '
  },
  // label key of record you want to use
  labelKey: {
    type: String,
    default: 'Chỉ định giá trị hiển thị sau khi đã chọn '
  },
  // hidden key
  hiddenKey: {
    type: Array,
    default: () => [],
    require: true,
    description: 'Trường nào sẽ bị ẩn đi '
  },
  defaultValue: {
    type: [String, Number],
    default: null,

    description: 'id of option'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: true
  },
  width: {
    type: String,
    default: '100%'
  },
  pageIndex :{
    type: Number,
    default: 1
  },
  api: {
    type: Function as PropType<any>,
    default: () => Promise<IResponse<TableResponse<TableData>>>
  },
  mapFunction: {
    type: Function,
    default: () => {}
  },
  params: {
    type: Object,
    default: () => {}
  },
  getMoreAPI: {
    type: Boolean,
    default: true
  },
  isTreeSelect: {
    type: Boolean,
    default: false
  },
  allowCreate: {
    type: Boolean,
    default: false
  },
  keyToRemoteSearch: {
    type: String,
    default: 'Search'
  }
})
const { t } = useI18n()
const loading = ref(false)
const emit = defineEmits(['updateValue', 'scrollTop', 'scrollBottom'])
const pageIndex = ref(propsObj.pageIndex)
const pageSize = ref(50)
let selected = computed(() => {
  return propsObj.defaultValue
})

const opTionList = ref([])
const options: any = computed(() => opTionList.value)
// if have not value, it will be set by first value key
const identifyKey = ref(propsObj.valueKey)
const identifyLabel = ref(propsObj.labelKey)
// set value for multiple select if defaultValue available

onBeforeMount(async () => {
  callAPI(pageIndex.value)
})

const callAPI = async (pageIndex: number) => {
  const response = await propsObj.api({
      PageIndex: pageIndex,
      PageSize: pageSize.value,
      ...propsObj.params
  })
  const data = response.data?.data ? response.data.data : response.data
  if(data.length > 0) {
    const arr = data.map(propsObj.mapFunction)
    options.value.push(...arr);  
  }
}

const acceptKey = (item) => {
  const { hiddenKey } = propsObj
  if (hiddenKey.length > 0) {
    return Object.keys(item).filter((el) => hiddenKey.indexOf(el) === -1)
  } else options.value = Object.keys(item)
}

const remoteMethod = async (query: string) => {
  loading.value = true
  setTimeout(async () => {
    loading.value = false
    await propsObj.api({[propsObj.keyToRemoteSearch]: query})
    .then(res => {
      options.value.splice(0, options.value.length, ...res.data.map(propsObj.mapFunction))
    })
    .catch((errorMessage) => {
      ElMessage({
        message: t(errorMessage),
        type: 'error'
    })
    })
  }, 200)
}
 
const valueChangeEvent = (val) => {
  if (val) {
    const { valueKey } = propsObj
    // find label
    const obj = options.value.find((el) => {
      if (el) {
        return el[valueKey] === val
      }
    })
    if (obj) emit('updateValue', val, obj ?? '')
  }
}

const scrolling = (e) => {
  const clientHeight = e.target.clientHeight
  const scrollHeight = e.target.scrollHeight
  const scrollTop = e.target.scrollTop
  if (scrollTop == 0) {
    emit('scrollTop')
  }
  if (scrollTop + clientHeight >= scrollHeight && propsObj.getMoreAPI) {
    increasePageIndex()
  }
}

const increasePageIndex = () => {
  pageIndex.value +=1
}

watch(pageIndex, async (newPageIndex) => {
  callAPI(newPageIndex)
});


</script>
<template>
  <ElSelect
    v-if="!isTreeSelect"
    ref="MultipleSelect"
    :loading="loading"
    v-model="selected"
    remote-show-suffix
    :placeholder="placeHolder"
    :clearable="clearable"
    :allow-create="allowCreate"
    default-first-option
    filterable
    remote
    :remote-method="remoteMethod"
    class="el-select-custom"
    @change="(data) => valueChangeEvent(data)"
    :value-key="identifyKey"
    :disabled="disabled"
  >
    <!-- value is tje first object when click on title -->
    <ElOption
      :value="items.length > 0 && items[0][identifyKey] ? items[0][identifyKey] : ''"
      label=""
      style="position: sticky; top: 0; z-index: 13"
      v-if="fields.length > 0"
    >
      <div>
        <ElRow type="flex" >
          <ElCol
            :span="Math.floor(24 / fields.length)"
            v-for="(filed, index) in fields"
            :key="index"
            class="text-ellipsis text-center text-black bg-white"
          >
           <strong>{{ filed }}</strong>
          </ElCol>
        </ElRow>
      </div>
    </ElOption>
    <div @scroll="scrolling" class="h-52 overflow-auto">
      <ElOption
        :style="`width: ${width}`"
        v-for="(item, index) in options"
        :key="index"
        :value="item[identifyKey] ?? ''"
        :label="item[identifyLabel] ?? ''"
        :disabled="disabled"
      >
        <div class="select-table">
          <ElRow type="flex" :gutter="10">
            <ElCol
              v-for="(key, i) in acceptKey(item)"
              :key="i"
              class="text-ellipsis text-center"
              :span="Math.floor(24 / fields.length)"
            >
             <div v-if="key !== 'logo'"> {{ item[key] }}</div>
             <div v-else>
              <img style="height: 25px" :src="item[key]" fit="fill" />
             </div>
            </ElCol>
          </ElRow>
        </div>
      </ElOption>
    </div>
    <slot name="underButton"> </slot>
  </ElSelect>
  <ElTreeSelect 
    v-else 
    v-model="selected"
    class="el-select-custom"
    @change="(data) => valueChangeEvent(data)"
    :data="options"
  />
</template>
<style lang="css" scoped>
.el-select-custom {
  width: 100%;
}

.el-select-custom input {
  width: 100%;
  height: auto;
}

.el-select-custom .el-input__icon {
  color: #9ea1a5;
}

.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.el-select-dropdown__item:hover {
  color: white;
  background-color: #4c89e5;
}

.el-select-dropdown__item {
  padding: 0 5px;
}

::v-deep(.el-input__wrapper) {
  cursor: default !important;
}

::v-deep(.el-select__caret.el-icon) {
  cursor: default !important;
}

::v-deep(.el-input__inner) {
  cursor: default !important;
}
</style>
