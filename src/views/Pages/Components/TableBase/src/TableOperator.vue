<script setup lang="ts">
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref, unref } from 'vue'
import { TableData } from '@/api/table/types'
import { useValidator } from '@/hooks/web/useValidator'
import {
  ElRow,
  ElCol,
  ElUpload,
  ElButton,
  ElDialog,
  UploadUserFile,
  UploadProps,
  ElMessage
} from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { saveTableApi } from '@/api/table'
import { useEmitt } from '@/hooks/web/useEmitt'
import { ContentDetailWrap } from '@/components/ContentDetailWrap'
import type { UploadFile } from 'element-plus'
import { apiType, TableResponse } from '../../Type'

const { t } = useI18n()
const { emitter } = useEmitt()

const { required } = useValidator()
const props = defineProps({
  api: {
    type: Function as PropType<apiType>,
    default: () => Promise<IResponse<TableResponse<TableData>>>
  },
  currentRow: {
    type: Object as PropType<Nullable<TableData>>,
    default: () => null
  },
  schema: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
  },
  hasImage: {
    type: Boolean,
    default: true
  },
  multipleImages: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: ''
  },
  nameBack: {
    type: String,
    default: ''
  },
  id: {
    type: Number,
    default: NaN
  },
  type: {
    type: String,
    default: ''
  },
  limitUpload: {
    type: Number,
    default: 1
  }
})

const rules = reactive({
  title: [required()],
  author: [required()],
  importance: [required()],
  pageviews: [required()],
  display_time: [required()],
  content: [required()]
})
const formValue = ref()
const getTableValue = async () => {
  if (props.id !== NaN) {
    const res = await props.api({ id: props.id })
    formValue.value = res.data.list[0]
    setFormValue()
  }
}
// eslint-disable-next-line vue/no-setup-props-destructure
const schema = props.schema
const { register, methods, elFormRef } = useForm({
  schema
})
// luu du lieu vao form

let fileList = ref<UploadUserFile[]>([])
const setFormValue = () => {
  const { setValues } = methods
  setValues(formValue.value)
  fileList.value.push({
    url: formValue.value.image,
    name: formValue.value.title
  })
}
watch(
  () => props.type,
  () => {
    if (props.type === 'detail') {
      const { setProps } = methods
      setProps({
        disabled: true
      })
    }
    if (props.type === 'detail' || props.type === 'edit') {
      getTableValue()
    }
  },
  {
    deep: true,
    immediate: true
  }
)
defineExpose({
  elFormRef,
  getFormData: methods.getFormData
})

const loading = ref(false)

const save = async () => {
  await unref(elFormRef)!.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const { getFormData } = methods
      const data = (await getFormData()) as TableData
      const res = await saveTableApi(data)
        .catch(() => {})
        .finally(() => {
          loading.value = false
        })
      if (res) {
        emitter.emit('getList', 'add')
      }
    }
  })
}
const addIcon = useIcon({ icon: 'uil:plus' })
const viewIcon = useIcon({ icon: 'uil:search' })
const deleteIcon = useIcon({ icon: 'uil:trash-alt' })

//if schema has image then split screen
let fullSpan = ref<number>()
props.hasImage ? (fullSpan.value = 16) : (fullSpan.value = 24)

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
const imageUrl = ref('')
const handleRemove = (file: UploadFile) => {
  fileList.value = fileList.value.filter((image) => image.url !== file.url)
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

const saveAndAdd = () => {
  console.log('saveAndAdd')
}
const edit = () => {
  console.log('edit')
}
const delAction = () => {
  console.log('del')
}
const cancel = () => {
  console.log('cancel')
}
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  console.log('success', response, uploadFile)
}
const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  console.log('success', uploadFile, uploadFiles)
  if (!props.multipleImages) {
    const file = fileList.value.pop()
    if (file != undefined) {
      imageUrl.value = URL.createObjectURL(file.raw!)
    }
  }
}
const previewImage = () => {
  dialogVisible.value = true
  dialogImageUrl.value = imageUrl.value
}
const removeImage = () => {
  imageUrl.value = ''
}
type ListImages = 'text' | 'picture' | 'picture-card'
const listType = ref<ListImages>('text')
!props.multipleImages ? (listType.value = 'text') : (listType.value = 'picture-card')
</script>

<template>
  <ContentDetailWrap>
    {{ t(title) }}
    <ElRow :gutter="20" justify="space-between">
      <ElCol :span="fullSpan">
        <Form :rules="rules" @register="register" />
      </ElCol>
      <ElCol :span="8" v-if="hasImage" class="max-h-400px overflow-y-auto shadow-inner p-1">
        <h3 class="text-center font-bold">{{ t('reuse.addImage') }}</h3>
        <el-upload
          action="#"
          class="avatar-uploader"
          :disabled="props.type === 'detail'"
          :auto-upload="false"
          :show-file-list="multipleImages"
          v-model:file-list="fileList"
          :list-type="listType"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-change="handleChange"
        >
          <div v-if="!multipleImages">
            <div v-if="imageUrl" class="relative">
              <img :src="imageUrl" class="avatar" />
            </div>
            <el-button v-else :icon="addIcon" class="avatar-uploader-icon" />
          </div>
          <div v-else>
            <el-button :icon="addIcon" />
          </div>
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
                  <el-button :icon="deleteIcon" :disabled="props.type === 'detail'" />
                </span>
              </span>
            </div>
          </template>
        </el-upload>
        <div class="w-250px flex justify-center" v-if="imageUrl">
          <el-button :icon="viewIcon" @click="previewImage" />
          <el-button :icon="deleteIcon" :disabled="props.type === 'detail'" @click="removeImage" />
        </div>
        <el-dialog v-model="dialogVisible">
          <img class="w-full" :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </ElCol>
    </ElRow>
    <template #under>
      <div v-if="props.type === 'add'">
        <ElButton type="primary" :loading="loading" @click="save">
          {{ t('reuse.save') }}
        </ElButton>
        <ElButton type="primary" :loading="loading" @click="saveAndAdd">
          {{ t('reuse.saveAndAdd') }}
        </ElButton>
      </div>
      <div v-if="props.type === 'detail'">
        <ElButton :loading="loading" @click="edit">
          {{ t('reuse.edit') }}
        </ElButton>
        <ElButton type="danger" :loading="loading" @click="delAction">
          {{ t('reuse.delete') }}
        </ElButton>
      </div>
      <div v-if="props.type === 'edit'">
        <ElButton type="primary" :loading="loading" @click="save">
          {{ t('reuse.save') }}
        </ElButton>
        <ElButton :loading="loading" @click="cancel">
          {{ t('reuse.cancel') }}
        </ElButton>
        <ElButton type="danger" :loading="loading" @click="delAction">
          {{ t('reuse.delete') }}
        </ElButton>
      </div>
    </template>
  </ContentDetailWrap>
</template>
<style scoped>
.avatar-uploader .avatar {
  padding-bottom: 1rem;
  width: 250px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  width: 178px;
  height: 178px;
}
</style>
