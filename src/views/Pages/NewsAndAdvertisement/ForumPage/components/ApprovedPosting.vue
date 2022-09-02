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
  ElButton
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
const baseUrl = 'https://api.cooftech.net/'
const prohibitToPost = (id, obj) => {
  console.log('call api check permission', id, obj)
}
const deletePost = (id) => {
  console.log('delte this post:id', id)
}
//fix icon
const likeIcon = useIcon({ icon: 'uil:plus' })
const dislikeIcon = useIcon({ icon: 'uil:search' })
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
        class="user-info-bar"
        :class="flexibleContent.isPostProhibit ? 'bg-danger bg-opacity-10' : ''"
      >
        <div class="d-flex justify-content-start align-items-center">
          <div class="user-avatar">
            <el-avatar
              v-if="flexibleContent.avatar"
              :src="baseUrl + flexibleContent.avatar"
              :size="47"
            />
            <el-avatar v-else icon="el-icon-user-solid" :size="47" />
          </div>
          <div class="ps-3">
            <div class="fw-bold">{{ flexibleContent.fullName }}</div>
            <small>{{ flexibleContent.timeAgo }}</small>
          </div>
        </div>
        <el-dropdown trigger="click" role="button" class="user-info-bar__utility">
          <div class="d-flex justify-content-center align-items-center">
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
          <img v-if="img.imagePath" :src="baseUrl + img.imagePath" alt="" class="w-100" />
          <el-empty v-else description="Không có ảnh" />
        </el-col>
      </el-row>
      <div class="p-3 pt-0 border-bottom">
        <div class="row" style="align-self: center">
          <div class="col-6 text-start">
            <div class="d-flex">
              <el-button :icon="likeIcon" width="18" alt="" disabled />
              <div class="px-2" style="align-self: center">
                {{ flexibleContent.totalLike }}
              </div>
            </div>
          </div>
          <div class="text-end col-6">
            <span class="text-secondary">{{ flexibleContent.totalLike }}</span>
            <span class="px-3 text-secondary">Comments</span>
          </div>
        </div>
      </div>
      <div class="border-bottom">
        <div class="row justify-content-between align-items-center" style="height: 4vh">
          <div class="col-6">
            <el-button
              :icon="flexibleContent.isUserLiked ? likeIcon : dislikeIcon"
              :btnName="'Like'"
              @click="updateLikeStatus"
            />
          </div>
          <div class="col-6">
            <el-button :icon="commentImage" :btnName="'comment'" />
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-between">
        <i class="fa fa-thumbs-o-up"></i>
      </div>
      <div
        class="d-flex pt-3 ps-3"
        v-for="(comment, index) in flexibleContent.comments"
        :key="comment.commentId + '-comments-' + index"
      >
        <div class="">
          <el-avatar icon="el-icon-user-solid" :size="47" />
        </div>
        <div class="ps-3">
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
  padding: get-vh(15px) get-vw(15px) get-vh(3px);
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
