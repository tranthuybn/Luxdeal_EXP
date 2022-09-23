<script>
import { ElButton, ElRow, ElCol, ElOption } from 'element-plus'

export default {
  name: 'MultipleOptionsComponent',
  props: {
    // columns name
    fields: {
      type: Array,
      default: () => [],
      require: true
    },
    // options
    items: {
      type: Array,
      default: () => [],
      require: true
    },
    placeHolder: {
      type: String,
      default: 'Vui lòng chọn bản ghi'
    },
    // value key of record you want to use
    valueKey: {
      type: String,
      default: ''
    },
    // label key of record you want to use
    labelKey: {
      type: String,
      default: ''
    },
    // hidden key
    hiddenKey: {
      type: Array,
      default: () => [],
      require: true
    },
    defaultValue: {
      type: [String, Number],
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      selected: '',
      options: []
    }
  },

  computed: {
    // if have not value, it will be set by first value key
    identifyKey() {
      if (this.valueKey) {
        return this.valueKey
      } else if (this.items.length > 0) {
        return Object.keys(this.items[0])[0]
      } else return 'value'
    },
    identifyLabel() {
      if (this.labelKey) {
        return this.labelKey
      } else if (this.items.length > 0) {
        return Object.keys(this.items[0])[0]
      } else return 'label'
    }
  },
  watch: {
    // set value for multiple select if defaultValue available
    items: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val.length > 0) {
          // set options for select box
          this.options = val
        }
      }
    },
    defaultValue: {
      immediate: true,
      handler(val) {
        if (val) {
          this.selected = val.toString()
        }
      }
    }
  },
  methods: {
    acceptKey(item) {
      if (this.hiddenKey.length > 0) {
        return Object.keys(item).filter((el) => this.hiddenKey.indexOf(el) === -1)
      } else this.options = Object.keys(item)
    },
    filter(str) {
      this.selected = str
      const searchingKey = str.toLowerCase()
      this.options = this.items.filter((item) => {
        if (
          Object.keys(item).find((key) => item[key].toString().toLowerCase().includes(searchingKey))
        ) {
          return true
        }
      })
    },
    appearsEvent() {
      this.options = this.items
    },
    valueChangeEvent(val) {
      if (val) {
        // find label
        const obj = this.items.find((el) => el[this.valueKey] === val)
        this.$emit('updateValue', val, obj[this.labelKey] ?? '')
      }
    }
  }
}
</script>
<template>
  <el-select
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
    <el-option
      :value="options.length > 0 && options[0][identifyKey] ? options[0][identifyKey] : ''"
      label=""
      style="position: sticky; top: 0; z-index: 13"
    >
      <div>
        <el-row type="flex" :gutter="24">
          <el-col v-for="(filed, index) in fields" :key="index" class="text-ellipsis text-center"
            ><strong>{{ filed }}</strong></el-col
          >
        </el-row>
      </div>
    </el-option>
    <el-option
      v-for="(item, index) in options"
      :key="index"
      :value="item[identifyKey]"
      :label="item[identifyLabel]"
      :disabled="disabled"
    >
      <div class="select-table">
        <el-row type="flex" :gutter="24">
          <el-col
            v-for="(key, index) in acceptKey(item)"
            :key="index"
            class="text-ellipsis text-center"
          >
            <el-tooltip placement="left-end" :content="item[key]" effect="light">
              <span> {{ item[key] }}</span>
            </el-tooltip>
          </el-col>
        </el-row>
      </div>
    </el-option>
  </el-select>
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
