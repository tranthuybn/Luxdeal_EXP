<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { computed } from 'vue'
import { ElCol, ElRow } from 'element-plus'

const { t } = useI18n()

const props = defineProps({
  selectedRecord: {
    type: Array,
    default: () => [],
    required: true
  },
  totalRecord: {
    type: Number,
    default: 0,
    required: true
  }
})
const selectedNumber = computed(() =>
  Array.isArray(props.selectedRecord) ? props.selectedRecord.length : 0
)
</script>
<template>
  <el-row class="mb-2">
    <el-col :xl="6" :lg="12" :xs="24">
      <div class="extension-function">
        <p>
          <span>{{ t('reuse.choose') }}</span>
          <span>
            ({{ Array.isArray(selectedRecord) ? selectedRecord.length : 0 }}/{{ totalRecord }})
          </span>
        </p>
        <p
          ><span :class="selectedNumber > 0 ? '' : 'opacity-20'">{{ t('reuse.exportExcel') }}</span
          ><span>
            <Icon
              icon="file-icons:microsoft-excel"
              :about="16"
              color="var(--el-color-primary)"
              class="ml-2px relative top-1px"
            />
          </span>
        </p>
        <p>
          <span :class="selectedNumber > 0 ? '' : 'opacity-20'">{{ t('reuse.duplicate') }}</span>
          <span>
            <Icon
              icon="ion:duplicate"
              :size="16"
              color="var(--el-color-primary)"
              class="ml-2px relative top-1px"
            />
          </span>
        </p>
        <p>
          <span :class="selectedNumber > 0 ? '' : 'opacity-20'">{{ t('reuse.delete') }}</span>
          <span>
            <Icon
              icon="fluent:delete-12-regular"
              :size="16"
              color="var(--el-color-primary)"
              class="ml-2px relative top-1px"
            />
          </span>
        </p>
      </div>
    </el-col>
  </el-row>
</template>
<style lang="scss" scoped>
@mixin d-flex {
  display: flex;
  align-items: center;
}
.extension-function {
  @include d-flex;
  justify-content: space-between;

  p {
    border-bottom: 2px solid var(--app-contnet-bg-color);
    @include d-flex;
    justify-content: flex-start;
    box-sizing: border-box;
    cursor: pointer;
    width: fit-content;
    span {
      width: fit-content;
      font-weight: 500;
    }
    &:hover {
      border-bottom: 2px solid var(--el-color-primary);
    }
  }
}
</style>
