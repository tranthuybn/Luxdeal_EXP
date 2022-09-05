<!-- eslint-disable vue/no-setup-props-destructure -->
<script setup lang="ts">
import { useIcon } from '@/hooks/web/useIcon'
import {
  ElRow,
  ElCol,
  ElCard,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElAvatar,
  ElButton,
  ElEmpty
} from 'element-plus'
import moment from 'moment'
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
  'https://assets.vogue.in/photos/5e32959a05b08e00085306c2/2:3/w_2560%2Cc_limit/Sonam-Kapoor-Ahuja-Louis-Vuitton-bag.jpg'
const prohibitToPost = (id, obj) => {
  console.log('call api check permission', id, obj)
}
const deletePost = (id) => {
  console.log('delte this post:id', id)
}
//fix icon
const likeFilledIcon = useIcon({ icon: 'ant-design:like-filled' })
const likeIcon = useIcon({ icon: 'ant-design:like-outlined' })
const commentImage = useIcon({ icon: 'uil:comment' })
const updateLikeStatus = () => {
  console.log('call api to like/unlike')
}
const timeAgo = (time) => {
  time = new Date(time)
  return moment(time).fromNow()
}
</script>
<template>
  <section>
    <el-card class="bg-white mb-3">
      <div
        class="user-info-bar pl-3"
        :class="flexibleContent.isPostProhibit ? 'bg-danger bg-opacity-10' : ''"
      >
        <div class="flex justify-content-start align-items-center">
          <div class="user-avatar">
            <el-avatar v-if="flexibleContent.avatar" :src="circleUrl" :size="47" />
            <el-avatar v-else icon="el-icon-user-solid" :size="47" />
          </div>
          <div class="pl-4 pl-4">
            <div class="font-bold">{{ flexibleContent.fullName }}</div>
            <small>{{ flexibleContent.timeAgo }}</small>
          </div>
        </div>
        <el-dropdown trigger="click" role="button" class="user-info-bar__utility">
          <div class="flex justify-content-center align-items-center">
            <div class="dots"></div>
            <div class="dots"></div>
            <div class="dots"></div>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <div
                  class="flex-item"
                  :class="flexibleContent.isPostProhibit ? 'text-success' : 'text-danger'"
                  style="width: 100%"
                  @click="prohibitToPost(flexibleContent.userId, flexibleContent)"
                >
                  {{ flexibleContent.isPostProhibit ? 'Cho phép đăng' : 'Cấm đăng' }}
                  <i class="el-icon-arrow-right"></i>
                </div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div
                  class="flex-item text-danger"
                  style="width: 100%"
                  @click="deletePost(flexibleContent.id)"
                >
                  Gỡ bài viết
                  <i class="el-icon-arrow-right"></i>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="p-3" v-if="flexibleContent.content">{{ flexibleContent.content }} </div>
      <el-row
        :gutter="5"
        class="pe-2 pb-3"
        v-if="flexibleContent.imagePosts || flexibleContent.imagePosts == ''"
      >
        <el-col
          :span="12"
          v-for="(img, index) in flexibleContent.imagePosts"
          :key="img.imagePath + 'img-post-1' + index"
        >
          <img v-if="img.imagePath" :src="defaultBagImage" alt="" class="w-100" />
          <el-empty v-else description="Không có ảnh" />
        </el-col>
      </el-row>
      <div class="p-3 pt-0 border-bottom">
        <div class="flex items-center self-center justify-between">
          <div class="col-6 text-start">
            <div class="flex">
              <el-button :icon="likeFilledIcon" width="18" alt="" class="!border-0 !p-0" />
              <div class="px-1 self-center">
                {{ flexibleContent.totalLike }}
              </div>
            </div>
          </div>
          <div class="text-end col-6">
            <span class="text-secondary">{{ flexibleContent.totalLike }}</span>
            <span class="px-1 text-secondary">Comments</span>
          </div>
        </div>
      </div>
      <div class="border-top-1 border-bottom-1">
        <div class="flex gap-10" style="height: 4vh">
          <div class="col-6">
            <el-button
              :icon="flexibleContent.isUserLiked ? likeFilledIcon : likeIcon"
              :btnName="'Like'"
              @click="updateLikeStatus"
              class="!border-0"
              >Like</el-button
            >
          </div>
          <div class="col-6">
            <el-button :icon="commentImage" :btnName="'comment'" class="!border-0"
              >Comment</el-button
            >
          </div>
        </div>
      </div>
      <div class="flex justify-between">
        <i class="fa fa-thumbs-o-up"></i>
      </div>
      <div
        class="flex pt-3 pl-4"
        v-for="(comment, index) in flexibleContent.comments"
        :key="comment.commentId + '-comments-' + index"
      >
        <div class="">
          <el-avatar icon="el-icon-user-solid" :size="47" />
        </div>
        <div class="pl-4">
          <div class="mb-1"
            ><b>{{ comment.userFullName }}</b
            ><br /><small class="text-secondary">{{ timeAgo(comment.createAt) }}</small></div
          >
          <div class="">{{ comment.content }} </div>
        </div>
      </div>
    </el-card>
  </section>
</template>

<style lang="scss" scoped>
@import '@/styles/function.scss';
.user-info-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-radius: 10px;
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
.user-info-bar__utility {
  min-width: get-vw(30px);
  height: get-vh(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  &:hover {
    box-shadow: 0 2px 12px 0 #a2bced;
  }
}
</style>
