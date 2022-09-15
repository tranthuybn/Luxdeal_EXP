<script setup lang="ts">
import { ElCard, ElTooltip } from 'element-plus'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('content-wrap')

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <ElCard :class="[prefixCls, 'mb-20px']" shadow="never">
    <template v-if="props.title" #header>
      <div class="flex items-center">
        <ElTooltip effect="dark" placement="right">
<<<<<<< HEAD
          <div class="max-w-200px">{{ props.message }}</div>
=======
          <div class="max-w-250px font-medium">{{ props.message }}</div>
>>>>>>> e1ea285dc9b494da7f3622b26d8e89b8dae64927
        </ElTooltip>
      </div>
    </template>
    <div>
      <slot></slot>
    </div>
    <div :class="[`${prefixCls}-header__title`, 'flex flex-1  justify-center pb-8']"
      ><slot name="under"></slot
    ></div>
  </ElCard>
</template>
