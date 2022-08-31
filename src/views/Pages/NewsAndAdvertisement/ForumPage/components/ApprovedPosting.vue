<!-- eslint-disable vue/no-deprecated-slot-attribute -->
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
          <div class="d-flex justify-content-center align-items-center w-100 h-100">
            <div class="dots"></div>
            <div class="dots"></div>
            <div class="dots"></div>
          </div>
          <el-dropdown-menu slot="dropdown">
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
              <img src="@/assets/images/like.svg" width="18" alt="" />
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
          <div class="col-6 h-100">
            <button-N045
              :btnIcon="flexibleContent.isUserLiked ? likeImage : unlikeImage"
              :btnName="'Like'"
              @click="updateLikeStatus"
            />
          </div>
          <div class="col-6 h-100">
            <button-N045 :btnIcon="commentImage" :btnName="'comment'" />
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

<script>
import moment from 'moment'
import { BASE_URL } from '@/services/EndPoint'
import unlikeImage from '@/assets/images/unlike.svg'
import likeImage from '@/assets/images/like.svg'
import commentImage from '@/assets/images/comment.svg'
import { updateLikeOfPosting, getPostingContentDetail } from '@/services/api/appManager.js'
import forumMixins from '../mixins'
export default {
  name: 'ApprovedPosting',
  components: {
    'button-N045': () => import('@/components/ButtonN045.vue')
  },
  mixins: [forumMixins],
  props: {
    content: {
      type: Object,
      default: () => {},
      require: true
    }
  },
  data() {
    return {
      flexibleContent: this.content,
      baseUrl: BASE_URL + '/',
      unlikeImage,
      commentImage,
      likeImage
    }
  },

  methods: {
    timeAgo(time) {
      time = new Date(time)
      return moment(time).fromNow()
    },
    updateLikeStatus() {
      updateLikeOfPosting({ PostId: this.flexibleContent.id })
        .then((res) => {
          const { data } = res.data
          if (res.data.statusCode === 200 && data?.errorCode === 200) {
            this.flexibleContent.isUserLiked = data.data.likeSatus
            this.flexibleContent.totalLike = data.data.totalLike
            this.$base_notify(
              `${this.flexibleContent.isUserLiked ? 'success' : 'error'}`,
              res.data?.data?.message
            )
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    getPostingInfoDetail() {
      getPostingContentDetail({ PostId: this.flexibleContent.id })
        .then((res) => {
          this.flexibleContent = res.data.data
        })
        .catch((err) => {
          console.error(err)
        })
    },
    deletePost(id) {}
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/variables.scss';

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
    box-shadow: $card-shadow;
  }
}
</style>
