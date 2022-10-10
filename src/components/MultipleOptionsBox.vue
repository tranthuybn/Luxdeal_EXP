<script setup lang="ts">
import { ElRow, ElCol, ElOption, ElSelect, ElTooltip, ElButton } from 'element-plus'
import { computed, watchEffect, ref, watch, onBeforeMount, onUnmounted } from 'vue'

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
    type: Array,
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
  }
})

const emit = defineEmits(['updateValue', 'addnewproduct'])

let selected = ref<string>('')
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
watchEffect(() => {
  if (propsObj.items?.length > 0)
    // set options for select box
    options.value = propsObj.items
})
watch(
  () => propsObj.defaultValue,
  (val) => {
    if (val) selected.value = val.toString()
  }
)

const acceptKey = (item) => {
  const { hiddenKey } = propsObj
  if (hiddenKey.length > 0) {
    return Object.keys(item).filter((el) => hiddenKey.indexOf(el) === -1)
  } else options.value = Object.keys(item)
}
const filter = (str) => {
  const { items } = propsObj
  const searchingKey = str.toLowerCase()
  options.value = items.filter((item) => {
    if (
      item != null &&
      Object.keys(item).find((key) => item[key].toString().toLowerCase().includes(searchingKey))
    ) {
      return true
    }
  })
}
const dialogAddQuick = () => {
  emit('addnewproduct')
}
const appearsEvent = () => {
  const { items } = propsObj
  options.value = items
}
const valueChangeEvent = (val) => {
  if (val) {
    const { items, valueKey, labelKey } = propsObj

    // find label
    const obj = items.find((el) => {
      if (el) el[valueKey] === val
    })
    if (obj) emit('updateValue', val, obj[labelKey] ?? '')
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
    ref="MultipleSelect"
    v-model="selected"
    :placeholder="placeHolder"
    :clearable="clearable"
    filterable
    class="el-select-custom"
    @visible-change="appearsEvent"
    @change="valueChangeEvent"
    :filter-method="filter"
    :value-key="identifyKey"
    :disabled="disabled"
  >
    <!-- value is tje first object when click on title -->
    <ElOption
      :value="options.length > 0 && options[0][identifyKey] ? options[0][identifyKey] : ''"
      label=""
      style="position: sticky; top: 0; z-index: 13"
    >
      <div>
        <ElRow type="flex" justify="space-between" v-if="fields.length > 0">
          <ElCol
            :span="24 / fields.length"
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
      v-for="(item, index) in options"
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
            :span="24 / fields.length"
          >
            <ElTooltip placement="left-end" :content="item[key]" effect="light">
              <span> {{ item[key] }}</span>
            </ElTooltip>
          </ElCol>
        </ElRow>
      </div>
    </ElOption>
    <span class="block h-1 w-[100%] border-t-1 mt-4"></span>
    <el-button text @click="dialogAddQuick">+ Thêm nhanh sản phẩm</el-button>
    <!-- <div class="p-2 text-base" @click="dialogAddQuick = true">+ Thêm nhanh sản phẩm</div> -->
  </ElSelect>
</template>
<style lang="css" scoped>
/* @import '@/scss/variables.scss'; */
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
