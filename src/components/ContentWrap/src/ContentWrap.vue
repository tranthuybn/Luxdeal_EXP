<script setup lang="ts">
import { ElCard, ElTooltip } from 'element-plus'
import { useDesign } from '@/hooks/web/useDesign'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()
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
        <ElTooltip
          :disabled="props.message === ''"
          effect="dark"
          placement="right"
          :content="props.message"
        >
          <div class="max-w-250px font-medium">{{ t(`${props.title}`) }}</div>
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
