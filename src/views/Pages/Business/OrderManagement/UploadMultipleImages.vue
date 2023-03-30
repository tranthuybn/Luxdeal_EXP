<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n';
import {
  ElUpload,
  ElButton,
  ElDialog,
  UploadProps,
  ElImage,
UploadFile,
UploadUserFile,
ElMessage
} from 'element-plus'
import { ref, watch, unref,PropType } from 'vue'
import * as orderUtility from './OrderFixbug'

const props = defineProps({
    modelValue: {
        type: Array as PropType<UploadUserFile[]>,
        default: () => []
    },
    disabled:{
        type: Boolean,
        default: false
    },
    limit:{
        type: Number,
        default: 10
    }
})
const emit = defineEmits(['update:modelValue',])
const { t } = useI18n()

watch(
  () => props.modelValue,
  (val) => {
    if (val === unref(valueRef)) return
    valueRef.value = val
  }
)
// The value of the input box
const valueRef = ref(props.modelValue)

// monitor
watch(
  () => valueRef.value,
  (val) => {
    emit('update:modelValue', val)
  }
)
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleChange: UploadProps['onChange'] = (uploadFile, _uploadFiles) => {
    beforeAvatarUpload(uploadFile, 'single') ? valueRef.value.push(uploadFile) : handleRemove(uploadFile)
}
const handleRemove = (file: UploadFile) => {
  valueRef.value = valueRef.value?.filter((image) => image.url !== file.url)
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const validImageType = ['jpeg', 'png']
//cái này validate file chỉ cho ảnh tí a sửa lại nhé
const beforeAvatarUpload = (rawFile, type: string) => {
  if (rawFile) {
    //nếu là 1 ảnh
    if (type === 'single') {
      if (rawFile.raw && rawFile.raw['type'].split('/')[0] !== 'image') {
        ElMessage.error(t('reuse.notImageFile'))
        return false
      } else if (rawFile.raw && !validImageType.includes(rawFile.raw['type'].split('/')[1])) {
        ElMessage.error(t('reuse.onlyAcceptValidImageType'))
        return false
      } else if (rawFile.raw?.size / 1024 / 1024 > 4) {
        ElMessage.error(t('reuse.imageOver4MB'))
        return false
      } else if (rawFile.name?.split('.')[0].length > 100) {
        ElMessage.error(t('reuse.checkNameImageLength'))
        return false
      }
    }
    //nếu là 1 list ảnh
    if (type === 'list') {
      let inValid = true
      rawFile.map((file) => {
        if (file.raw && file.raw['type'].split('/')[0] !== 'image') {
          ElMessage.error(t('reuse.notImageFile'))
          inValid = false
        } else if (file.raw && !validImageType.includes(file.raw['type'].split('/')[1])) {
          ElMessage.error(t('reuse.onlyAcceptValidImageType'))
          inValid = false
          return false
        } else if (file.size / 1024 / 1024 > 4) {
          ElMessage.error(t('reuse.imageOver4MB'))
          inValid = false
        } else if (file.name?.split('.')[0].length > 100) {
          ElMessage.error(t('reuse.checkNameImageLength'))
          inValid = false
          return false
        }
      })
      return inValid
    }
    return true
  }
  // else {
  //   //báo lỗi nếu ko có ảnh
  //   if (type === 'list' && valueRef.value.length > 0) {
  //     return true
  //   }
  //   if (type === 'single' && (rawUploadFile.value != undefined || imageUrl.value != undefined)) {
  //     return true
  //   } else {
  //     ElMessage.warning(t('reuse.notHaveImage'))
  //     return false
  //   }
  // }
}
const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `${t('reuse.limitUploads')}${props.limit}. ${t('reuse.imagesYouChoose')}: ${files.length}. ${t(
      'reuse.total'
    )}${files.length + uploadFiles.length}`
  )
}
</script>
<template>
       <el-upload
                  action="#"
                  :disabled="valueRef.length > 9 || disabled"
                  list-type="picture-card"
                  :limit="limit"
                  :on-exceed="handleExceed"
                  :multiple="true"
                  :auto-upload="false"
                  class="relative"
                  :on-change="handleChange"
                  :file-list="valueRef"
                >
                  <el-button size="large" :disabled="valueRef.length >= limit || disabled">+ {{ t('formDemo.addPhotosOrFiles') }}</el-button>
                  <template #file="{ file }">
                    <div>
                      <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                      <span class="el-upload-list__item-actions">
                        <span
                          class="el-upload-list__item-preview"
                          @click="handlePictureCardPreview(file)"
                        >
                          <el-button :icon="orderUtility.viewIcon" />
                        </span>
                        <span
                          v-if="!disabled"
                          class="el-upload-list__item-delete"
                          @click="handleRemove(file)"
                        >
                          <el-button :icon="orderUtility.deleteIcon" />
                        </span>
                      </span>
                    </div>
                  </template>
                </el-upload>
                <el-dialog top="5vh" v-model="dialogVisible" width="130vh">
                    <el-image class="h-full" :src="dialogImageUrl" alt="Preview Image" />
                  </el-dialog>
</template>