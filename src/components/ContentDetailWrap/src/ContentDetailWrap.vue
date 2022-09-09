<script setup lang="ts">
import { ElCard } from 'element-plus'
import { propTypes } from '@/utils/propTypes'
import { useDesign } from '@/hooks/web/useDesign'
import { ref, onMounted } from 'vue'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('content-detail-wrap')

defineProps({
  title: propTypes.string.def(''),
  message: propTypes.string.def('')
})
const offset = ref(85)
const contentDetailWrap = ref()
onMounted(() => {
  offset.value = contentDetailWrap.value.getBoundingClientRect().top
})
</script>

<template>
  <div :class="[`${prefixCls}-container`, 'relative bg-[#fff]']" ref="contentDetailWrap">
    <div style="padding: var(--app-content-padding)">
      <ElCard :class="[`${prefixCls}-body`, 'mb-20px']" shadow="never">
        <div>
          <slot></slot>
        </div>
      </ElCard>
    </div>
    <div :class="[`${prefixCls}-header__title`, 'flex flex-1  justify-center pb-8']"
      ><slot name="under"></slot
    ></div>
  </div>
</template>
