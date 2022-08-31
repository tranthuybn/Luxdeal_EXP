<template>
  <el-dialog
    v-model:visible="uploadDialogVisible"
    width="30%"
    center
    @closed="resetUploadDialogField"
  >
    <template #title>
      <div class="text-center pb-3 border-bottom"><b>Tạo bài viết</b></div>
    </template>
    <el-dialog
      width="30%"
      style="top: 10%"
      v-model:visible="innerVisible"
      @opened="getAllTags"
      append-to-body
    >
      <template #title>
        <div class="w-100 text-center">
          <el-input
            type="text"
            v-model="searchingKey"
            class="w-75"
            placeholder="Nhập thẻ tag ..."
            @input="searchTags"
          />
        </div>
      </template>
      <div class="py-3">
        <span class="fw-bold">Đã gắn thẻ:</span>
        <i class="float-end" v-if="choseTags.length > 0"
          >{{ choseTags.length }}/{{ totalTags }} {{ totalTags > 1 ? 'tags' : 'tag' }}</i
        >
        <div class="mt-3 border" style="min-height: 15vh">
          <el-tag
            v-for="tag in choseTags"
            :key="tag.name"
            closable
            :type="tag.type"
            @close="removeTag(tag)"
          >
            {{ tag.name }}
          </el-tag>
        </div>
        <div class="py-3">
          <span class="fw-bold">Thẻ tag:</span>
          <i class="float-end" v-if="currentTags.length > 0"
            >{{ totalTags }} {{ totalTags > 1 ? 'tags' : 'tag' }}</i
          >
          <div class="mt-1 border tags-list" style="min-height: 15vh">
            <el-tag
              v-for="tag in currentTags"
              :key="tag.name"
              :type="tag.type"
              class="base__btn-primary-outline"
              @click="chooseTag(tag)"
            >
              {{ tag.name }}
            </el-tag>
          </div>
        </div>
      </div>
    </el-dialog>
    <div class="d-flex justify-content-start align-items-baseline pt-2">
      <el-avatar v-if="userInfo.avatar" :src="baseUrl + userInfo.avatar" :size="47" />
      <el-avatar v-else icon="el-icon-user-solid" :size="47" />
      <div class="ps-3 w-75">
        <div class="fw-bold fs-6">{{ userInfo ? userInfo.fullName : '' }}</div>
      </div>
    </div>
    <div class="pt-1">
      <el-input
        type="textarea"
        placeholder="Nhập nội dung... "
        v-model="postContent"
        maxlength="30"
        class="border-0"
      />
    </div>
    <div class="pt-3">
      <el-row :gutter="5" class="upload-image-box">
        <multiple-upload-images ref="multipleUploadImages" @updateImageList="updateUploadImage" />
      </el-row>
    </div>
    <template #footer>
      <div class="dialog-footer border-top">
        <div class="py-3 text-start">
          <el-button class="base__btn-primary-outline" @click="innerVisible = true"
            ><span>Gắn thẻ</span>
          </el-button>
        </div>
        <div>
          <el-button class="base__btn-primary w-100" @click="uploadPosting">Đăng</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { BASE_URL } from '@/services/EndPoint'
export default {
  name: 'PostNewsDialog',
  components: {
    MultipleUploadImages: () => import('./MultipleUploadImage.vue')
  },
  inject: ['formInfo'],
  props: {
    userInfo: {
      type: Object,
      default: () => {},
      require: true
    }
  },
  data() {
    return {
      uploadDialogVisible: false,
      innerVisible: false,
      tags: [],
      choseTags: [],
      currentTags: [],
      uploadImage: [],
      baseUrl: BASE_URL + '/',
      postContent: '',
      totalTags: 0,
      searchingKey: ''
    }
  },
  computed: {},
  methods: {
    uploadPosting() {
      const loading = this.$loading({ lock: true })
      const payload = {
        Content: this.postContent,
        ListImage: this.uploadImage,
        ListTagId:
          this.choseTags.length > 0
            ? this.choseTags
                .map((el) => el.id)
                .toString()
                .replace(/,/g, ';')
            : ''
      }
      const formData = Object.keys(payload).reduce((form, key) => {
        if (payload[key] !== null && typeof payload[key] !== 'undefined') {
          if (Array.isArray(payload[key]) && payload[key].length > 0) {
            payload[key].forEach((el) => {
              form.append(key, el)
            })
          } else {
            form.append(key, payload[key])
          }
        }
        return form
      }, new FormData())
      addNewPosts(formData)
        .then((res) => {
          const { data } = res.data
          if (res.status === 200 && res.data.statusCode === 200 && data) {
            this.$base_notify('success', data.message ?? 'Đã đăng bài')
            this.$emit('updateNewPosting')
          } else {
            this.$base_notify('error', 'Đăng bài thất bại')
          }
        })
        .catch((err) => {
          this.$base_notify('error', 'Lỗi hệ thống')
          console.error(err)
        })
        .finally(() => {
          loading.close()
        })
      this.uploadDialogVisible = false
    },
    resetUploadDialogField() {
      this.postContent = ''
      this.$refs.multipleUploadImages.cleanImages()
      if (this.$refs.multipleUploadImages.imageList.length > 0) {
        this.$refs.multipleUploadImages.imageList.splice(
          0,
          this.$refs.multipleUploadImages.imageList.length
        )
      }
      if (this.uploadImage.length > 0) {
        this.uploadImage.splice(0, this.uploadImage.length)
      }
      if (this.tags.length > 0) {
        this.currentTags.splice(0, this.currentTags.length)
        this.tags.splice(0, this.tags.length)
      }
      if (this.choseTags.length > 0) {
        this.choseTags.splice(0, this.choseTags.length)
      }
      this.searchingKey = ''
    },
    getAllTags() {
      const loading = this.$loading({ lock: true })
      getAllForumTags({ ForumId: this.formInfo.value.id ?? null })
        .then((res) => {
          const { data } = res.data
          if (res.status == 200 && res.data.statusCode === 200 && data) {
            this.totalTags = data.count
            if (data?.data?.length > 0) {
              this.tags = data?.data
              this.currentTags = data?.data
            }
          } else {
            this.$base_notify('error', 'Không lấy được danh sách thẻ')
          }
        })
        .catch((err) => {
          this.$base_notify('error', 'Lỗi hệ thống! Không lấy được danh sách thẻ')
          console.error(err)
        })
        .finally(() => {
          loading.close()
        })
    },
    searchTags() {
      if (this.searchingKey.length > 0) {
        this.currentTags = this.tags.filter((el) => el.name.includes(this.searchingKey))
      } else {
        this.currentTags = this.tags
      }
    },
    chooseTag(val) {
      if (!this.choseTags.find((el) => el.id === val.id)) {
        this.choseTags.push(val)
      } else this.$base_message('error', 'Thẻ đã được chọn')
    },
    removeTag(val) {
      const position = this.choseTags.findIndex((el) => el.id === val.id)
      if (position !== -1) {
        this.choseTags.splice(position, 1)
      }
    },
    updateUploadImage(val) {
      if (val.length) {
        this.uploadImage = val
      } else this.uploadImage.splice(0, this.uploadImage.length)
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-image-box {
  height: 25vh;
  overflow-y: scroll;
}
:deep(.el-tag) {
  margin-right: 4px;
  margin-top: 4px;
}
</style>
