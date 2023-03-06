<template>
  <div class="sc-typing-indicator" :style="messageColors">
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<script>
export default {
  props: {
    messageColors: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>


@keyframes bob {
  10% {
    background-color: #9e9da2;
    transform: translateY(-10px);
  }

  50% {
    background-color: #b6b5ba;
    transform: translateY(0);
  }
}

.sc-typing-indicator {
  padding: 17px 20px;
  text-align: center;
  border-radius: 6px;
}

.sc-typing-indicator span {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 3px;
  background-color: #b6b5ba;
  border-radius: 100%;
  animation: bob 2s infinite;
}

/* SAFARI GLITCH */
.sc-typing-indicator span:nth-child(1) {
  animation-delay: -1s;
}

.sc-typing-indicator span:nth-child(2) {
  animation-delay: -0.85s;
}

.sc-typing-indicator span:nth-child(3) {
  animation-delay: -0.7s;
}
</style>
