<!-- eslint-disable vue/no-setup-props-destructure -->
<script setup lang="ts">
import {
  ElRow,
  ElCol,
  ElCard,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElAvatar,
  ElButton,
  ElImage
} from 'element-plus'
const props = defineProps({
  content: {
    type: Object,
    default: () => {},
    require: true
  }
})
let flexibleContent = props.content
const circleUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
const defaultBagImage =
  'https://eu.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-petite-malle-v--M46309_PM2_Front%20view.jpg'
const approvePost = (id) => {
  console.log('call api duyet bai id:', id)
}
const cancelPost = (id) => {
  console.log('call api ko cho duyet bai id:', id)
}
</script>
<template>
  <section>
    <el-card class="my-3">
      <div class="flex p-3">
        <div class="">
          <el-avatar v-if="flexibleContent.avatar" :src="circleUrl" :size="47" />
          <el-avatar v-else icon="el-icon-user-solid" :size="47" />
        </div>
        <div class="pl-4 w-75">
          <div class="font-bold fs-6">{{ flexibleContent.fullName }}</div>
          <small>{{ flexibleContent.timeAgo }}</small>
        </div>
      </div>
      <div class="p-3 pt-0" v-if="flexibleContent.content">{{ flexibleContent.content }}</div>
      <el-row
        :gutter="5"
        class="pe-2 pb-3"
        v-if="flexibleContent.imagePosts || flexibleContent.imagePosts == ''"
      >
        <el-col
          :span="12"
          v-for="(img, index) in flexibleContent.imagePosts"
          :key="img.imagePath + 'img' + index"
        >
          <el-image v-if="img.imagePath" :src="defaultBagImage" />
          <el-image v-else>
            <i class="el-icon-picture-outline"></i>
          </el-image>
        </el-col>
      </el-row>
      <div class="flex justify-between">
        <i class="fa fa-thumbs-o-up"></i>
      </div>
      <div class="flex flex-wrap p-3 justify-around">
        <div class="w-45/100">
          <el-button type="primary" class="w-full me-3" @click="approvePost(flexibleContent.id)"
            >Phê duyệt</el-button
          >
        </div>
        <div class="w-45/100">
          <el-button class="base__btn-info w-full px-3" @click="cancelPost(flexibleContent.id)"
            >từ chối</el-button
          >
        </div>
        <div class="col-2">
          <el-dropdown class="w-full">
            <div class="flex justify-center bg-dark bg-opacity-10 py-3 rounded" role="button">
              <div class="dots"></div>
              <div class="dots"></div>
              <div class="dots"></div>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <div class="flex-item" style="width: 100%">
                    Từ chối và chặn người đăng
                    <i class="arrowRight !border-black"></i>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-card>
  </section>
</template>
<style>
.dots {
  margin-right: 3px;
  content: ' ';
  width: 5px;
  height: 5px;
  bottom: 5px;
  border-radius: 50%;
  background: #0d0d0d;
}
</style>
