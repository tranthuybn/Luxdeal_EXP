<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { ElRow, ElCol } from 'element-plus'
import componentMember from './components/componentMember.vue'
import { getMemberList } from '@/api/NewsAndAdvertisement/Forum'
const loading = ref(true)
let members = ref([])
const getMemberApi = async () => {
  await nextTick()
  const res = await getMemberList()
  if (res) {
    members.value = res.data
    totalMember.value = members.value.length
  }
  loading.value = false
}
getMemberApi()
const totalMember = ref(0)
const getMember = (obj) => {
  console.log('getMember', obj)
}
</script>
<template>
  <div v-loading="loading">
    <div>
      <el-row :gutter="20" class="m-0">
        <el-col :offset="6" :span="12">
          <componentMember
            :members="members"
            :is-home-page="true"
            @get-member="getMember"
            :total-member="totalMember"
          />
        </el-col>
      </el-row>
    </div>
  </div>
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
