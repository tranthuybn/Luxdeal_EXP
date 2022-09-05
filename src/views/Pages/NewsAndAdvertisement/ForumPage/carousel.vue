<script setup lang="ts">
import { ElCarousel, ElCarouselItem, ElEmpty, ElImage } from 'element-plus'
const emit = defineEmits(['prev', 'next'])
const previousClick = (event) => {
  emit('prev', event)
}
const nextClick = (event) => {
  emit('next', event)
}
defineProps({
  items: {
    type: Array,
    default: () => [],
    require: true
  }
})
</script>
<template>
  <div>
    <el-carousel
      height="500px"
      :interval="5000"
      arrow="hover"
      @prev="previousClick"
      @next="nextClick"
      ref="carousel"
      id="carousel"
    >
      <el-carousel-item v-for="(item, index) in items" :key="index">
        <el-image
          v-if="typeof item === 'string'"
          class="h-full w-full"
          :src="item"
          :alt="item.toString()"
          fit="cover"
        />
        <el-empty v-else :image-size="180" description="Không có ảnh" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-carousel__container) {
  width: 100%;
}
:deep(.el-carousel--horizontal) {
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
#carouselImage {
  display: flex;
  justify-content: flex-start;
}
#carousel {
  position: relative;
}
#edit-button {
  position: absolute;
  bottom: 2vh;
  right: 3vh;
  z-index: 13;
  background: rgba(255, 255, 255, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  color: white;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  &:hover {
    box-shadow: 0 1px 9px 1px #6596f3;
  }
}
:deep(.el-dialog) {
  background: rgba(23, 125, 201, 0.25);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  i {
    color: #d5d7dc;
  }
  .el-upload--picture-card {
    background: none;
    border: none;
  }
  .el-upload-dragger {
    background: rgba(255, 255, 255, 0.55);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.18);
  }
}
</style>
