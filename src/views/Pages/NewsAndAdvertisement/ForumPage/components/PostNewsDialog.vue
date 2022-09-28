<script setup lang="ts">
import { useIcon } from '@/hooks/web/useIcon'
import {
  ElDialog,
  ElRow,
  ElAvatar,
  ElButton,
  ElInput,
  ElUpload,
  ElTag,
  UploadUserFile
} from 'element-plus'
import type { UploadFile } from 'element-plus'
import { ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
type Tag = {
  [key: string]: any
}
const circleUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
const addIcon = useIcon({ icon: 'uil:plus' })
const viewIcon = useIcon({ icon: 'uil:search' })
const deleteIcon = useIcon({ icon: 'uil:trash-alt' })
const uploadDialogVisible = ref(true)
const innerVisible = ref(false)
const searchingKey = ref('')
const choseTags = ref<Tag>([])
const totalTags = ref(7)
const tags = ref<Tag>([
  { id: 1, name: 'Hàng Authentic' },
  { id: 2, name: 'Giày Sneaker' },
  { id: 3, name: 'Trang sức' },
  { id: 4, name: 'Đồng hồ' },
  { id: 5, name: 'Túi Hermes' },
  { id: 6, name: 'Vòng Cartier' },
  { id: 7, name: 'Thắt lưng' }
])
let currentTags = ref<Tag>([
  { id: 1, name: 'Hàng Authentic' },
  { id: 2, name: 'Giày Sneaker' },
  { id: 3, name: 'Trang sức' },
  { id: 4, name: 'Đồng hồ' },
  { id: 5, name: 'Túi Hermes' },
  { id: 6, name: 'Vòng Cartier' },
  { id: 7, name: 'Thắt lưng' }
])
let postContent = ref('')
let fileList = ref<UploadUserFile[]>([])
const disabled = ref(false)
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
defineProps({
  userInfo: {
    type: Object,
    default: () => {},
    require: true
  }
})
const emit = defineEmits(['update-new-posting', 'update-post-dialog'])
const resetUploadDialogField = () => {
  emit('update-post-dialog')
}
const getAllTags = () => {
  console.log('getAllTag')
}
const searchTags = () => {
  if (searchingKey.value.length > 0) {
    currentTags = tags.value.filter((el) => el.name.includes(searchingKey))
  } else {
    currentTags = tags
  }
}
const removeTag = (val) => {
  const position = choseTags.value.findIndex((el) => el.id === val.id)
  if (position !== -1) {
    choseTags.value.splice(position, 1)
  }
}
const chooseTag = (val) => {
  if (!choseTags.value.find((el) => el.id === val.id)) {
    choseTags.value.push(val)
  } else console.error('error', 'Thẻ đã được chọn')
}
const uploadPosting = () => {
  emit('update-new-posting')
}
const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}
const handleRemove = (file: UploadFile) => {
  fileList.value = fileList.value.filter((image) => image.url !== file.url)
}
</script>
<template>
  <el-dialog v-model="uploadDialogVisible" width="30%" center @closed="resetUploadDialogField">
    <div class="text-center pb-3 border-bottom-1">
      <b>{{ t('reuse.createPosts') }}</b>
    </div>
    <el-dialog width="30%" v-model="innerVisible" @opened="getAllTags" append-to-body>
      <div class="w-full text-center">
        <el-input
          v-model="searchingKey"
          class="w-75"
          :placeholder="`${t('reuse.inputTag')}...`"
          @input="searchTags"
        />
      </div>
      <div class="py-3">
        <span class="font-bold">{{ t('reuse.tagged') }}:</span>
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
          <span class="font-bold">{{ t('reuse.tag') }}:</span>
          <i class="float-end" v-if="currentTags.length > 0"
            >{{ totalTags }} {{ totalTags > 1 ? 'tags' : 'tag' }}</i
          >
          <div class="mt-1 border tags-list" style="min-height: 15vh">
            <el-tag
              v-for="tag in currentTags"
              :key="tag.name"
              :type="tag.type"
              class="cursor-pointer"
              @click="chooseTag(tag)"
            >
              {{ tag.name }}
            </el-tag>
          </div>
        </div>
      </div>
    </el-dialog>
    <div class="flex justify-content-start align-items-baseline pt-2">
      <el-avatar v-if="userInfo.avatar" :src="circleUrl" :size="47" />
      <el-avatar v-else icon="el-icon-user-solid" :size="47" />
      <div class="pl-4 w-75">
        <div class="font-bold fs-6">{{ userInfo ? userInfo.fullName : '' }}</div>
      </div>
    </div>
    <div class="pt-1">
      <el-input
        type="textarea"
        :placeholder="`${t('reuse.inputContent')}...`"
        v-model="postContent"
        maxlength="30"
        class="border-0"
      />
    </div>
    <div class="pt-3">
      <el-row :gutter="5" class="upload-image-box">
        <el-upload
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          v-model:file-list="fileList"
        >
          <el-button :icon="addIcon" />

          <template #file="{ file }">
            <div>
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                  <el-button :icon="viewIcon" />
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <el-button :icon="deleteIcon" />
                </span>
              </span>
            </div>
          </template>
        </el-upload>
      </el-row>
    </div>
    <div class="dialog-footer border-top-1">
      <div class="py-3 text-start">
        <el-button @click="innerVisible = true">
          <span>{{ t('reuse.addTag') }}</span>
        </el-button>
      </div>
      <div>
        <el-button class="w-full" @click="uploadPosting">{{ t('reuse.post') }}</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<style lang="scss" scoped>
.upload-image-box {
  height: 25vh;
}
:deep(.el-tag) {
  margin-right: 4px;
  margin-top: 4px;
}
</style>
