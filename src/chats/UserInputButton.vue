<template>
  <button class="sc-user-input--button-icon-wrapper">
    <IconBase :color="color" width="20" height="20" :icon-name="tooltip">
      <slot></slot>
    </IconBase>
  </button>
</template>

<script>
import IconBase from './components/IconBase.vue'

export default {
  components: {
    IconBase
  },
  props: {
    color: {
      type: String,
      required: true
    },
    tooltip: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.sc-user-input--button-icon-wrapper {
  padding: 0;
  margin: 0;
  cursor: pointer;
  background: none;
  border: none;
  outline: none;
}
</style>
