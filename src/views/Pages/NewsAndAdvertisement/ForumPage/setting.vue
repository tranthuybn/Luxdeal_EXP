<script setup lang="ts">
import { ref } from 'vue'
import { ElRow, ElCol, ElCard, ElInput, ElButton } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
const isEdit = ref(false)
</script>
<template>
  <section>
    <el-row :gutter="20" class="m-0">
      <el-col :offset="6" :span="12">
        <el-card class="p-3">
          <div class="my-3">
            <span class="fw-bold pe-2 fs-5">{{ t('reuse.forumSetting') }}</span>
          </div>
          <div class="flex justify-between" :class="isEdit ? '' : 'border-bottom'">
            <div class="fs-5">{{ t('reuse.nameDescription') }}</div>
            <el-button class="mb-3" style="align-self: center" @click="isEdit = true"
              ><img src="@/assets/svgs/edit-icon.svg" width="16"
            /></el-button>
          </div>
          <div class="my-3" v-if="isEdit">
            <div class="border rounded py-2 px-2">
              <span class="text-secondary ps-3">{{ t('reuse.name') }}</span>
              <el-input
                type="text"
                class="w-100 mt-3 form-control border-0"
                :placeholder="`${t('reuse.newForum')}...`"
              />
            </div>
            <div class="border rounded py-2 mt-3 px-2">
              <span class="text-secondary ps-3">{{ t('reuse.description') }}</span>
              <el-input
                type="text"
                class="w-100 mt-3 form-control border-0"
                :placeholder="`${t('reuse.newForum')}...`"
              />
            </div>
            <div class="mt-3">
              <div class="flex justify-end">
                <el-button class="px-4" @click="isEdit = false">{{ t('reuse.cancel') }}</el-button>
                <el-button type="primary" class="px-5 ms-3" @click="isEdit = false">{{
                  t('reuse.save')
                }}</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<style lang="scss" scoped>
.h-67-px {
  height: 67px;
}

:deep(.el-tabs__nav-scroll) {
  border-bottom: 0;
}

:deep(.el-tabs__nav-wrap::after) {
  background: none;
  height: 0;
}

:deep(.el-tabs__nav-scroll) {
  min-height: 3rem;
}

:deep(.el-tabs__header) {
  margin: 0;
}

:deep(.el-tabs__active-bar) {
  top: 100%;
}

.circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.rounded-20 {
  border-radius: 2rem;
}

.dot {
  position: relative;
}

.dot::after {
  content: ' ';
  position: absolute;
  left: 100%;
  width: 5px;
  height: 5px;
  bottom: 5px;
  border-radius: 50%;
  background: #0d0d0d;
}

.dots {
  margin-right: 3px;
  content: ' ';
  width: 5px;
  height: 5px;
  bottom: 5px;
  border-radius: 50%;
  background: #0d0d0d;
}

.image-map {
  height: 190px;
}

.image-new {
  height: 140px;
}

@media only screen and (max-width: 1400px) {
  .image-map {
    height: 133px;
  }
  .image-new {
    height: 94px;
  }
}

:deep(.el-textarea__inner) {
  border: none;
  padding-left: 2px;
}

:deep(.el-textarea__inner::placeholder) {
  font-style: italic;
}

:deep(.el-dialog--center .el-dialog__body) {
  padding-top: 0;
}

.fs-7 {
  font-size: 80%;
}

:deep(.el-popover) {
  padding: 0;
}

:deep(.el-popover--plain) {
  padding: 0 !important;
}
</style>
<style lang="scss" scoped>
.el-popover--plain {
  padding: 0;
}
</style>
