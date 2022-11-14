<script setup lang="ts">
import { ElInput } from 'element-plus'
import { computed, ref } from 'vue'
const propsObj = defineProps({
  className: {
    type: String,
    default: ''
  },
  modelValue: {
    type: Number || String || undefined,
    default: 0
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['change', 'update:modelValue'])
const valueHasChangedEvent = (val) => {
  emit('change', val)
}

const isInputActive = ref(false)
const displayValue = computed({
  get() {
    if (propsObj.modelValue === null || isNaN(propsObj.modelValue)) {
      return 0
    }

    if (isInputActive.value) {
      // Cursor is inside the input field. unformat display value for user
      return propsObj.modelValue
    } else {
      // User is not modifying now. Format display value for user interface
      return (
        propsObj.modelValue?.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1.') + ' ' + 'VND'
      )
    }
  },
  set(modifiedValue) {
    // Recalculate value after ignoring "$" and "," in user input
    // eslint-disable-next-line no-useless-escape
    let newValue: string | number = parseFloat(modifiedValue.toString().replace(/[^\d\.]/g, ''))
    // Ensure that it is not NaN
    if (isNaN(newValue)) {
      newValue = 0
    }
    // Note: we cannot set this.value as it is a "prop". It needs to be passed to parent component
    // $emit the event so that parent component gets it
    emit('update:modelValue', newValue)
  }
})
</script>
<template>
  <div>
    <ElInput
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
