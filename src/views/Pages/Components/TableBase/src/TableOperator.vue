<script setup lang="ts">
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, watch, ref, unref } from 'vue'
import { TableData } from '@/api/table/types'
import {
  ElRow,
  ElCol,
  ElUpload,
  ElButton,
  ElDialog,
  UploadUserFile,
  UploadProps,
  ElMessage,
  ElMessageBox,
  ElNotification,
  ElImage
} from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import type { UploadFile } from 'element-plus'
import { TableResponse } from '../../Type'
import { useRouter } from 'vue-router'

const { t } = useI18n()

const props = defineProps({
  apiId: {
    type: Function as PropType<any>,
    default: () => Promise<IResponse<TableResponse<TableData>>>
  },
  delApi: {
    type: Function as PropType<any>,
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
  deleteTitle: {
    type: String,
    default: 'Warning'
  },
  id: {
    type: Number,
    default: NaN
  },
  type: {
    type: String,
    default: ''
  },
  typeForm: {
    type: String,
    default: ''
  },
  typeButton: {
    type: String,
    default: ''
  },
  rules: {
    type: Object,
    default: () => {}
  },
  limitUpload: {
    type: Number,
    default: 1
  },
  params: {
    type: Object,
    default: () => {}
  },
  formDataCustomize: {
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['post-data', 'customize-form-data', 'edit-data'])
const formValue = ref()

//get data from table
const getTableValue = async () => {
  if (!isNaN(props.id)) {
    const res = await props.apiId({ ...props.params, id: props.id })
    if (res.data.list !== undefined) {
      formValue.value = res.data.list[0]
    } else {
      formValue.value = res.data
    }
    await setFormValue()
  }
}
// eslint-disable-next-line vue/no-setup-props-destructure
const schema = props.schema
const { register, methods, elFormRef } = useForm({
  schema
})
let fileList = ref<UploadUserFile[]>([])
// luu du lieu vao form
const { setValues } = methods
watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) {
      return
    }
    if (currentRow.list.length !== 0) {
      setValues(currentRow?.list[0])
      fileList.value.push({
        url: currentRow.list[0].image,
        name: currentRow.list[0].title
      })
    }
  },
  {
    deep: true,
    immediate: true
  }
)
const customizeData = async () => {
  await emit('customize-form-data', formValue.value)
}
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
const imageUrl = ref('')
//set data for form edit and detail
const setFormValue = async () => {
  //neu can xu li du lieu thi emit len component de tu xu li du lieu
  await customizeData()
  const { setValues } = methods
  if (props.formDataCustomize !== undefined) {
    setValues(props.formDataCustomize)
    if (!props.multipleImages) {
      imageUrl.value = props.formDataCustomize.imageurl
    }
    console.log('img', imageUrl.value)
  } else {
    setValues(formValue.value)
  }
  fileList.value.push({
    url: formValue.value.image,
    name: formValue.value.title
  })
}
//watch and call get data form detail and edit
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

//doc du lieu tu bang roi emit len goi API
const { go } = useRouter()
const save = async (type) => {
  await unref(elFormRef)!.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const { getFormData } = methods
      let data = (await getFormData()) as TableData
      props.multipleImages ? (data.Image = fileList.value) : (data.Image = rawUploadFile.value?.raw)
      console.log('image:', data.Image)
      if (type == 'add') {
        await emit('post-data', data)
        loading.value = false
        go(-1)
      }
      if (type == 'saveAndAdd') {
        await emit('post-data', data)
        unref(elFormRef)!.resetFields()
        loading.value = false
      }
      if (type == 'edit') {
        await emit('edit-data', data)
        loading.value = false
        go(-1)
      }
    }
  })
}
const addIcon = useIcon({ icon: 'uil:plus' })
const viewIcon = useIcon({ icon: 'uil:search' })
const deleteIcon = useIcon({ icon: 'uil:trash-alt' })

//if schema has image then split screen
let fullSpan = ref<number>()
let rawUploadFile = ref<UploadFile>()
props.hasImage ? (fullSpan.value = 16) : (fullSpan.value = 24)
//set Title
let title = ref(props.title)
if (props.title == 'undefined') {
  title.value = 'Category'
}

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
const { push } = useRouter()
const router = useRouter()
const edit = () => {
  push({
    name: `${String(router.currentRoute.value.name)}`,
    params: { id: props.id, type: 'edit' }
  })
}
const delAction = async () => {
  {
    ElMessageBox.confirm(`${t('reuse.deleteWarning')}`, props.deleteTitle, {
      confirmButtonText: t('reuse.delete'),
      cancelButtonText: t('reuse.exit'),
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    })
      .then(() => {
        props
          .delApi({ Id: props.id })
          .then(
            () =>
              ElNotification({
                message: t('reuse.deleteSuccess'),
                type: 'success'
              }),
            go(-1)
          )
          .catch((error) =>
            ElNotification({
              message: error,
              type: 'warning'
            })
          )
      })
      .catch(() => {
        ElNotification({
          type: 'info',
          message: t('reuse.deleteCancel')
        })
      })
  }
}
const cancel = () => {
  go(-1)
}
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  console.log('success', response, uploadFile)
}
const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  console.log('success', uploadFile, uploadFiles)
  if (!props.multipleImages) {
    const file = fileList.value.pop()
    if (file != undefined) {
      rawUploadFile.value = uploadFile
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
  <ContentWrap :title="t(`${title}`)">
    <ElRow :gutter="20" justify="space-between">
      <ElCol :span="fullSpan">
        <Form :rules="rules" @register="register" />
      </ElCol>
      <ElCol
        :span="hasImage ? 8 : 0"
        v-if="hasImage"
        class="max-h-400px overflow-y-auto shadow-inner p-1"
      >
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
              <el-image :src="imageUrl" class="avatar" />
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
      <div v-if="props.type === 'add' || isNaN(props.id)">
        <div v-if="props.typeButton === 'form01'">
          <ElButton type="primary" :loading="loading" @click="save('add')">
            {{ t('reuse.save') }}
          </ElButton>
          <ElButton type="primary" :loading="loading" @click="save('saveAndAdd')">
            {{ t('reuse.addNew') }}
          </ElButton>
        </div>
        <div v-if="props.typeButton === 'form02'">
          <ElButton type="primary" :loading="loading" @click="save">
            {{ t('reuse.fix') }}
          </ElButton>
        </div>
        <ElButton type="primary" :loading="loading" @click="save('add')">
          {{ t('reuse.save') }}
        </ElButton>
        <ElButton type="primary" :loading="loading" @click="save('saveAndAdd')">
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
        <ElButton type="primary" :loading="loading" @click="save('edit')">
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
  </ContentWrap>
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
