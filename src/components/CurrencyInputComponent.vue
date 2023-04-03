<script setup lang="ts">
import { ElInput } from 'element-plus'
import { computed, ref } from 'vue'

const propsObj = defineProps({
  className: {
    type: String,
    default: ''
  },
  modelValue: {
    type: Number ,
    default: 0
  },
  disabled: {
    type: Boolean,
    default: false
  },
  isReadOnly: {
    required: false,
    type: Boolean,
    default: false
  },
  max:{
    type: Number,
    default: Number.MAX_VALUE
  },
  //if you want negative values bind min: -negative number (:min="-Number.MIN_VALUE")
  min:{
    type: Number,
    default: 0
  },
  showCurrency: {
    type: Boolean,
    default: true
  },
  placeholder: {
    type: String,
    default: undefined
  },
  suffixIcon: {
    type: Object,
    default: undefined
  },
  showPlaceholder: {
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
    if(propsObj.showPlaceholder && !propsObj.modelValue) return ''
    if (propsObj.modelValue === null || isNaN(propsObj.modelValue)) return 0

    if (isInputActive.value) {
      // Cursor is inside the input field. unformat display value for user
      return propsObj.modelValue
    } else if(!propsObj.showCurrency) {
      return (
        propsObj.modelValue?.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1.')
      )
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
    if(newValue < propsObj.min){
      newValue = propsObj.min
    }
    if(newValue > propsObj.max){
      newValue = propsObj.max
    }
    // Note: we cannot set this.value as it is a "prop". It needs to be passed to parent component
    // $emit the event so that parent component gets it
    emit('update:modelValue', newValue)
  }
})
</script>
<template>
  <div class="w-full">
    <ElInput
      :placeholder="propsObj.placeholder"
      type="text"
      :class="className"
      v-model="displayValue"
      :disabled="disabled"
      :readonly="isReadOnly"
      @blur="isInputActive = false"
      @focus="isInputActive = true"
      @change="valueHasChangedEvent"
      :suffix-icon="propsObj.suffixIcon"
    />
  </div>
</template>
