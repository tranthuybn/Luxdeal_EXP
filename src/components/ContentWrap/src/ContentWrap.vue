<script setup lang="ts">
import { ElCard, ElTooltip, ElButton } from 'element-plus'
import { useDesign } from '@/hooks/web/useDesign'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter } from 'vue-router'
import { useIcon } from '@/hooks/web/useIcon'

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
  },
  // add exit button to header
  backButton: {
    type: Boolean,
    default: false
  }
})
const { go } = useRouter()
const deleteIcon = useIcon({ icon: 'bi:x-lg' })
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
          <div class="flex justify-between w-full">
            <div class="font-medium">{{ t(`${props.title}`) }}</div>
            <el-button v-if="backButton" @click="go(-1)" :icon="deleteIcon">{{
              t('reuse.exit')
            }}</el-button>
          </div>
        </ElTooltip>
      </div>
    </template>
    <div>
      <slot></slot>
    </div>
    <div :class="[`${prefixCls}-header__title`, 'flex flex-1 gap-2 pb-8']">
      <slot name="under"></slot>
    </div>
  </ElCard>
</template>
