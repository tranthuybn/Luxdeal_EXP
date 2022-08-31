<script setup lang="ts">
import { ElRow, ElCol, ElCard, ElButton } from 'element-plus'
import Homepage from './Homepage.vue'
const forums = [
  { name: 'Forum Khách Hàng', description: 'Nơi giao lưu kết nối của các tín đồ hàng hiệu', id: 1 }
]
const social = 'luxdeal'
</script>

<template>
  <el-row type="flex" justify="space-between" class="base__main-background forum-container">
    <el-col :span="6" class="h-full">
      <el-card class="h-full">
        <div class="fs-4 fw-bold pb-3">Quản lý Forum</div>
        <div
          class="d-flex bg-primary bg-opacity-10 rounded-2 p-2"
          v-for="(item, index) in forums"
          :key="index"
        >
          <div class="w-25 h-67-px">
            <img
              src="https://ap.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-coussin-bb-h27-handbags--M21191_PM2_Front%20view.png?wid=656&hei=656"
              alt=""
              class="w-full h-full rounded-2"
            />
          </div>
          <div class="ps-2 w-75">
            <div class="fs-6 fw-bold pt-2">
              {{ item.name }}
            </div>
            <div class="d-flex">
              <img :src="social" alt="" />
              <small class="ms-1 description"> {{ item.description }}</small>
            </div>
          </div>
        </div>
        <el-button class="base__btn-primary w-100 py-3 mt-lg-5">Thêm mới +</el-button>
        <div class="border-bottom border-top my-3">
          <router-link to="/forums/homepage">
            <div class="bg-primary bg-opacity-10 my-2 py-3" role="button"
              ><b class="ps-lg-5">Trang chủ</b></div
            >
          </router-link>
        </div>
        <div class="menu-list-item my-2">
          <router-link to="forums/EmployeeManagement">
            <b class="ps-lg-5">Quản lý thành viên</b>
          </router-link>
        </div>
        <div class="menu-list-item my-2">
          <router-link
            :to="{
              name: 'New-and-advertisement.news-site.news-list'
            }"
          >
            <b class="ps-lg-5">Quản lý hệ thông</b>
          </router-link>
        </div>
        <div class="menu-list-item my-2">
          <router-link
            :to="{
              name: 'New-and-advertisement.news-site.manage-news'
            }"
          >
            <b class="ps-lg-5">Thiết lập forum</b>
          </router-link>
        </div>
      </el-card>
    </el-col>
    <el-col :span="18" class="main-content-column">
      <homepage />
    </el-col>
  </el-row>
</template>
<style lang="scss" scoped>
.menu-list-item {
  height: 5vh;
  box-shadow: inset 0 11px 10px -12px #6596f3;
  text-align: left;
  vertical-align: middle;
  line-height: 5vh;
}
.menu-list-item:hover b {
  text-decoration: underline;
  color: blue;
}
.forum-container {
  width: 100%;
  height: 100%;
  position: relative;
}
.main-content-column {
  height: 100%;
  overflow-y: scroll;
  overflow-x: auto;
}
.h-67-px {
  height: 67px;
}

::v-deep .el-tabs__nav-scroll {
  border-bottom: 0;
}

::v-deep .el-tabs__nav-wrap::after {
  background: none;
  height: 0;
}

::v-deep .el-tabs__nav-scroll {
  min-height: 3rem;
}

::v-deep .el-tabs__header {
  margin: 0;
}

::v-deep .el-tabs__active-bar {
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

::v-deep .el-textarea__inner {
  border: none;
  padding-left: 2px;
}

::v-deep .el-textarea__inner::placeholder {
  font-style: italic;
}

::v-deep .el-dialog--center .el-dialog__body {
  padding-top: 0;
}

.fs-7 {
  font-size: 80%;
}

::v-deep .el-popover {
  padding: 0;
}

::v-deep .el-popover--plain {
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
</style>
