<script setup lang="ts">
import { ElRow, ElCol, ElButton, ElDivider } from 'element-plus'
import { ref } from 'vue'
import Homepage from './Homepage.vue'
import memberVue from './member.vue'
import settingVue from './setting.vue'
import systemVue from './system.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const social = 'luxdeal'
const activeButton = ref([
  { index: 0, active: true },
  { index: 1, active: false },
  { index: 2, active: false },
  { index: 3, active: false }
])
const changeStyleButton = (index) => {
  //find index in array if index == element then active = true and others = false
  activeButton.value.map((element) =>
    element.index == index
      ? (activeButton.value[element.index].active = true)
      : (activeButton.value[element.index].active = false)
  )
}
</script>

<template>
  <el-row type="flex" justify="center" class="forum-container dark:bg-[var(--el-bg-color)]">
    <el-divider content-position="left">
      {{ t('reuse.forumManagementNewFeed') }}
    </el-divider>
    <el-col :span="5" class="sticky">
      <div class="h-full border-right-1 px-3">
        <div class="flex bg-primary bg-opacity-10 rounded-2 p-2">
          <div class="w-25 h-67-px">
            <img
              src="https://ap.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-coussin-bb-h27-handbags--M21191_PM2_Front%20view.png?wid=656&hei=656"
              alt=""
              class="w-full h-full rounded-2"
            />
          </div>
          <div class="ps-2 w-75">
            <div class="fs-6 font-bold font-bold"> Hội tín đồ hàng hiệu Việt Nam </div>
            <div class="flex">
              <img :src="social" alt="" />
              <span class="font-bold">(Authonly Luxury)</span>
            </div>
          </div>
        </div>
        <el-button class="w-full py-3 mt-lg-5 !rounded-5px !h-45px">
          {{ t('reuse.addNew') }} +
        </el-button>
        <div class="menu-list-item py-2 my-2 border-y-1 border-[#B1B1B1] border-solid">
          <el-button
            class="styleButton dark:!text-white"
            :class="activeButton[0].active ? '!bg-blue-600 !text-white' : '!text-black'"
            @click="changeStyleButton(0)"
            ><b class="styleFont">{{ t('reuse.homepage') }}</b>
          </el-button>
        </div>
        <div class="menu-list-item my-2">
          <el-button
            class="styleButton dark:!text-white"
            :class="activeButton[1].active ? '!bg-blue-500 !text-white' : '!text-black'"
            @click="changeStyleButton(1)"
          >
            <b class="styleFont">{{ t('reuse.employeeManagement') }}</b>
          </el-button>
        </div>
        <div class="menu-list-item my-2">
          <el-button
            class="styleButton dark:!text-white"
            :class="activeButton[2].active ? '!bg-blue-800 !text-white' : '!text-black'"
            @click="changeStyleButton(2)"
          >
            <b class="styleFont">{{ t('reuse.systemManagement') }}</b>
          </el-button>
        </div>
        <div class="menu-list-item my-2">
          <el-button
            class="styleButton dark:!text-white"
            :class="activeButton[3].active ? '!bg-blue-800 !text-white' : '!text-black'"
            @click="changeStyleButton(3)"
          >
            <b class="styleFont">{{ t('reuse.forumSetting') }}</b>
          </el-button>
        </div>
      </div>
    </el-col>
    <el-col :span="18" class="main-content-column">
      <Homepage v-if="activeButton[0].active" />
      <memberVue v-if="activeButton[1].active" />
      <systemVue v-if="activeButton[2].active" />
      <settingVue v-if="activeButton[3].active" />
    </el-col>
  </el-row>
</template>
<style lang="scss" scoped>
.menu-list-item {
  color: black;
  text-align: left;
  vertical-align: middle;
}
.styleFont {
  padding-left: 1rem;
  font-size: 15px;
  font-weight: 700;
}
.forum-container {
  width: 100%;
  height: 100%;
  background-color: none;
  border: none;
}
.main-content-column {
  height: 93%;
  overflow: auto;
}
::-webkit-scrollbar {
  width: 8px;
}

/* Track */
::-webkit-scrollbar-track {
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #c8ccd4;
  border-radius: 10px;
}
.h-67-px {
  height: 67px;
}

:deep(.el-tabs__nav-scroll) {
  border-bottom: 0;
}

:deep(el-tabs__nav-wrap::after) {
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

.wrapper-content {
  margin: 100px auto;
  width: 400px;
  background-color: #f1f1f1;
  border: 1px solid black;
  padding: 10px;
  height: auto;
}

.description {
  width: 90%;
  white-space: pre-wrap;
  text-overflow: ellipsis; //thêm 3 dấu chấm ở cuối
  -webkit-line-clamp: 1; // số dòng muốn hiển thị
  -webkit-box-orient: vertical;
  display: -webkit-box;
  overflow: hidden;
  position: relative;
}

.description:before {
  position: absolute;
  bottom: 0;
  right: 0;
  content: '…';
}

.description:after {
  content: '';
  position: absolute;
  width: 1em;
  height: 1em;
  z-index: 1;
  right: 0;
}

:deep(.el-divider__text) {
  font-size: 18px;
  font-weight: 700;
}
.styleButton {
  width: 100%;
  justify-content: flex-start;
  height: 45px;
  border: none;
  background: none;
}
</style>
