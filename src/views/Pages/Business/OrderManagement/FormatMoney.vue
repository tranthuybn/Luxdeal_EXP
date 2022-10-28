<script setup lang="ts">
import { ElInput } from 'element-plus'
const propsObj = defineProps({}
    className: {
      type: String,
      default: ''
    },
    value: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    }
  })

  data() {
    return {
      isInputActive: false
    }
  },
  computed: {
    displayValue: {
      get: function () {
        if (this.value === null) {
          return ''
        }

        if (this.isInputActive) {
          // Cursor is inside the input field. unformat display value for user
          return this.value.toString()
        } else {
          // User is not modifying now. Format display value for user interface
          return this.value?.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1.') + ' ' + 'VND'
        }
      },
      set: function (modifiedValue) {
        // Recalculate value after ignoring "$" and "," in user input
        // eslint-disable-next-line no-useless-escape
        let newValue = parseFloat(modifiedValue.replace(/[^\d\.]/g, ''))
        // Ensure that it is not NaN
        if (isNaN(newValue)) {
          newValue = 0
        }
        // Note: we cannot set this.value as it is a "prop". It needs to be passed to parent component
        // $emit the event so that parent component gets it
        this.$emit('input', newValue)
      }
    }
  },
  methods: {
    valueHasChangedEvent(val) {
      this.$emit('change', val)
    }
  }

</script>
<template>
  <div>
    <el-input
      type="text"
      :class="className"
      v-model="displayValue"
      :disabled="disabled"
      @blur="isInputActive = false"
      @focus="isInputActive = true"
      @change="valueHasChangedEvent"
    />
  </div>
</template>
