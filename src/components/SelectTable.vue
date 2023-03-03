<!-- eslint-disable vue/no-mutating-props -->
<script setup lang="ts">
import { ElRow, ElCol, ElOption, ElSelect, ElTooltip } from 'element-plus'
import { computed } from 'vue'

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
  modelValue: {
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
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'update:modelValue',
  'update:update:items',
  'scrollTop',
  'scrollBottom',
  'keyword',
  'change'
])

// if have not value, it will be set by first value key
const tableColumn = computed(() => {
  return propsObj.items[0] ? Object.keys(propsObj.items[0]).filter((key) => hideKey(key)) : []
})
const hideKey = (key) => {
  if (propsObj.hiddenKey.find((hide) => hide == key)) {
    return false
  }
  return true
}
const scrolling = (e) => {
  const clientHeight = e.target.clientHeight
  const scrollHeight = e.target.scrollHeight
  const scrollTop = e.target.scrollTop
  if (scrollTop == 0) {
    emit('scrollTop')
  }
  if (scrollTop + clientHeight >= scrollHeight) {
    emit('scrollBottom')
  }
}
const valueChangeEvent = (val) => {
  if (val) {
    emit('update:modelValue', val)
    const { items, valueKey } = propsObj
    // find label
    const obj = items.find((el) => {
      if (el) {
        return el[valueKey] === val
      }
    })
    if (obj) emit('change', val, obj)
  }
}
const remoteMethod = (query: string) => {
  emit('keyword', query)
}
</script>
<template>
  <ElSelect
    ref="MultipleSelect"
    :modelValue="modelValue"
    class="el-select-custom"
    @change="(data) => valueChangeEvent(data)"
    :disabled="disabled"
    filterable
    remote
    :remote-method="remoteMethod"
    remote-show-suffix
  >
    <!-- value is tje first object when click on title -->
    <ElOption
      :value="items.length > 0 && items[0][valueKey] ? items[0][valueKey] : ''"
      label=""
      style="position: sticky; top: 0; z-index: 13"
    >
      <div>
        <ElRow type="flex" justify="space-between" v-if="fields.length > 0">
          <ElCol
            :span="Math.floor(24 / fields.length)"
            v-for="(field, index) in fields"
            :key="index"
            class="text-ellipsis text-center text-black bg-white"
          >
            <ElTooltip placement="left-end" :content="field?.toString()" effect="light">
              <strong>{{ field }}</strong>
            </ElTooltip>
          </ElCol>
        </ElRow>
      </div>
    </ElOption>
    <div @scroll="scrolling" id="content">
      <ElOption
        :style="`width: ${width}`"
        v-for="(item, index) in items"
        :key="index"
        :value="item[valueKey] ?? ''"
        :label="item[labelKey] ?? ''"
        :disabled="disabled"
      >
        <div class="select-table">
          <ElRow type="flex" justify="space-between">
            <ElCol
              v-for="(key, i) in tableColumn"
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
    </div>
    <slot name="underButton"> </slot>
  </ElSelect>
</template>
<style lang="css" scoped>
#content {
  height: 200px;
  overflow: auto;
  padding: 0 10px;
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

.el-select-dropdown__item:hover {
  background-color: #4c89e5;
  color: white;
}

.el-select-dropdown__item {
  padding: 0;
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
