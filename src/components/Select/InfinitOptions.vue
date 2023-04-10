<!-- eslint-disable vue/no-mutating-props -->
<script setup lang="ts">
import { ElRow, ElCol, ElOption, ElSelect, ElTooltip } from 'element-plus'
import { computed, ref, watchEffect } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()
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
    description: 'array options'
  },
  placeHolder: {
    type: String,
    // eslint-disable-next-line vue/valid-define-props
    default: t('reuse.chooseOptions')
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
    description: 'which key will be hidden '
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
const emit = defineEmits(['updateValue', 'scrollTop', 'scrollBottom'])

const selected = computed(() => {
  return propsObj.modelValue
})
const options = ref<Array<any>>([])

// if have not value, it will be set by first value key
const identifyKey = ref(propsObj.valueKey)
const identifyLabel = ref(propsObj.labelKey)

// set value for multiple select if modelValue available
watchEffect(() => {
  if (propsObj.items?.length > 0)
    // set options for select box
    options.value = propsObj.items
})

const acceptKey = (item) => {
  const { hiddenKey } = propsObj
  if (hiddenKey.length > 0) {
    return Object.keys(item).filter((el) => hiddenKey.indexOf(el) === -1)
  } else options.value = Object.keys(item)
}
const filter = (str) => {
  const { items } = propsObj
  if (str) {
    const searchingKey = str.toLowerCase()
    options.value = items.filter((item) => {
      if (
        item != null &&
        Object.keys(item).find((key) => {
          return item[key] ? item[key].toString().toLowerCase().includes(searchingKey) : false
        })
      ) {
        return true
      }
    })
  } else {
    options.value = items
  }
}

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
  }
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

</script>
<template>
  <ElSelect
    ref="MultipleSelect"
    :loading="loading"
    v-model="selected"
    remote-show-suffix
    :placeholder="placeHolder"
    :clearable="clearable"
    filterable
    remote
    :remote-method="filter"
    class="el-select-custom"
    @change="(data) => valueChangeEvent(data)"
    :value-key="identifyKey"
    :disabled="disabled"
  >
    <ElOption
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
            class="text-ellipsis text-center text-black bg-white"
          >
            <ElTooltip placement="left-end" :content="filed?.toString()" effect="light">
              <strong>{{ filed }}</strong>
            </ElTooltip>
          </ElCol>
        </ElRow>
      </div>
    </ElOption>
    <div @scroll="scrolling" id="content">
      <ElOption
        :style="`width: ${width}`"
        v-for="(item, index) in options"
        :key="index"
        :value="item[identifyKey] ?? ''"
        :label="item[identifyLabel] ?? ''"
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
    </div>
    <slot name="underButton"> </slot>
  </ElSelect>
</template>
<style lang="css" scoped>
#content {
  height: 200px;
  padding: 0 10px;
  overflow: auto;
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.el-select-dropdown__item:hover {
  color: white;
  background-color: #4c89e5;
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
