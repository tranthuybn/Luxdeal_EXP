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
