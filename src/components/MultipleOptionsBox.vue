<script setup lang="ts">
import { ElRow, ElCol, ElOption, ElSelect, ElTooltip } from 'element-plus'
import { computed, ref, watch, onBeforeMount, onUnmounted } from 'vue'

const propsObj = defineProps({
  // columns name
  fields: {
    type: Array,
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
    description: 'Dùng khi xem chi tiết, truyền giá trị mặc định vào'
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
  }
})

const emit = defineEmits(['updateValue', 'addnewproduct'])

let selected = ref()
const options = ref<Array<any>>([])

// if have not value, it will be set by first value key
const identifyKey = computed(() => {
  const { valueKey, items } = propsObj
  if (valueKey) {
    return valueKey
  } else if (Array.isArray(items) && items.length > 0) {
    //returns an array of a given object's own enumerable property
    return Object.keys(items[0])[0]
  } else return 'value'
})
const identifyLabel = computed(() => {
  const { labelKey, items } = propsObj
  if (labelKey) {
    return labelKey
  } else if (Array.isArray(items) && items.length > 0) {
    return Object.keys(items[0])[0]
  } else return 'label'
})

// set value for multiple select if defaultValue available
// watchEffect(() => {
//   if (propsObj.items?.length > 0)
//     // set options for select box
//     options.value = propsObj.items
// })
watch(
  () => propsObj.defaultValue,
  () => {
    selected.value = propsObj.defaultValue
  },
  { immediate: true }
)

const acceptKey = (item) => {
  const { hiddenKey } = propsObj
  if (hiddenKey.length > 0) {
    return Object.keys(item).filter((el) => hiddenKey.indexOf(el) === -1)
  } else options.value = Object.keys(item)
}
// const filter = (str) => {
//   const { items } = propsObj
//   const searchingKey = str.toLowerCase()
//   console.log('searchingKey', searchingKey, 'selected', selected.value)
//   options.value = items.filter((item) => {
//     if (
//       item != null &&
//       Object.keys(item).find((key)
// => item[key].toString().toLowerCase().includes(searchingKey))
//     ) {
//       return true
//     }
//   })
// }
const loadOption = ref(false)
// const appearsEvent = () => {
//   const { items } = propsObj
//   options.value = items
//   loadOption.value = false
// }
const valueChangeEvent = (val) => {
  if (val) {
    const { items, valueKey } = propsObj
    // find label
    const obj = items.find((el) => {
      if (el) {
        return el[valueKey] === val
      }
    })
    if (obj) emit('updateValue', val, obj ?? '')
    if (propsObj.defaultValue !== null) {
      selected.value = obj.productCode
    }
  }
}
const handleScroll = (...val) => {
  console.log(val)
}
onBeforeMount(() => {
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
<template>
  <ElSelect
    :loading="loadOption"
    ref="MultipleSelect"
    v-model="selected"
    :placeholder="placeHolder"
    :clearable="clearable"
    filterable
    class="el-select-custom"
    @change="(data) => valueChangeEvent(data)"
    :value-key="identifyKey"
    :disabled="disabled"
  >
    <!-- value is tje first object when click on title -->
    <ElOption
      :style="`width: ${width}`"
      :value="items.length > 0 && items[0][identifyKey] ? items[0][identifyKey] : ''"
      label=""
      style="position: sticky; top: 0; z-index: 13"
    >
      <div>
        <ElRow type="flex" justify="space-between" v-if="fields.length > 0">
          <ElCol
            :span="Math.floor(24 / fields.length)"
            v-for="(filed, index) in fields"
            :key="index"
            class="text-ellipsis text-center text-blue-900"
          >
            <ElTooltip placement="left-end" :content="filed?.toString()" effect="light">
              <strong>{{ filed }}</strong>
            </ElTooltip>
          </ElCol>
        </ElRow>
      </div>
    </ElOption>
    <ElOption
      :style="`width: ${width}`"
      v-for="(item, index) in items"
      :key="index"
      :value="item[identifyKey]"
      :label="item[identifyLabel]"
      :disabled="disabled"
    >
      <div class="select-table">
        <ElRow type="flex" justify="space-between">
          <ElCol
            v-for="(key, i) in acceptKey(item)"
            :key="i"
            class="text-ellipsis text-center"
            :span="Math.floor(24 / fields.length)"
          >
            <ElTooltip
              placement="left-end"
              :content="item[key] ? item[key].toString() : ''"
              effect="light"
            >
              <span> {{ item[key] }}</span>
            </ElTooltip>
          </ElCol>
        </ElRow>
      </div>
    </ElOption>
    <slot name="underButton"> </slot>
  </ElSelect>
</template>
<style lang="css" scoped>
ul li:first-child {
  background-color: transparent;
  color: white;
}
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
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
