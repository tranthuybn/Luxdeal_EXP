<template>
  <div class="sc-message--system" :style="messageColors">
    <slot :message="data">
      {{ data.text }}
      <p v-if="data.meta" class="sc-message--meta" :style="{ color: messageColors.color }">
        {{ data.meta }}
      </p>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    messageColors: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.sc-message--system {
  padding: 8px 20px;
  font-size: 12px;
  -webkit-font-smoothing: subpixel-antialiased;
  font-style: italic;
  font-weight: 300;
  line-height: 1.2;
  white-space: pre-wrap;
  border-radius: 6px;
  opacity: 0.55;
}

.sc-message--meta {
  margin-top: 5px;
  margin-bottom: 0;
  font-size: xx-small;
  text-align: center;
  opacity: 0.5;
}
</style>
