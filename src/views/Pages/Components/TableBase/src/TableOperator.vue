<script setup lang="ts">
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, watch, ref, unref, onBeforeMount } from 'vue'
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
  ElImage,
  ElDivider
} from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import type { UploadFile } from 'element-plus'
import { TableResponse } from '../../Type'
import { useRoute, useRouter } from 'vue-router'
import { API_URL } from '@/utils/API_URL'
import { approvalProducts } from '@/api/Approval'
import { FORM_IMAGES } from '@/utils/format'

const { t } = useI18n()
const doCloseOnClickModal = ref(false)
const props = defineProps({
  // api lấy dữ liệu sản phẩm
  apiId: {
    type: Function as PropType<any>,
    default: () => Promise<IResponse<TableResponse<TableData>>>
  },
  // api xpas dữ liệu sản phẩm
  delApi: {
    type: Function as PropType<any>,
    default: () => Promise<IResponse<TableResponse<TableData>>>
  },
  //schema cho form
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
  // tiêu đề hiện trên đầu của bảng
  title: {
    type: String,
    default: ''
  },
  //tiêu đề khi hỏi xóa
  deleteTitle: {
    type: String,
    default: 'Warning'
  },
  //id của sản phẩm
  id: {
    type: Number,
    default: NaN
  },
  //type = 'add' || 'detail' || 'edit'
  //có sự kiện watch để bắt xem đang ở type nào
  type: {
    type: String,
    default: ''
  },
  //rules để validate
  rules: {
    type: Object,
    default: () => {}
  },
  //limitUpload ảnh
  limitUpload: {
    type: Number,
    default: 10
  },
  //truyền params cho api nếu cần
  params: {
    type: Object,
    default: () => {}
  },
  //dữ liệu đã được xử lí được gửi sau khi emit lên component cha
  formDataCustomize: {
    type: Object,
    default: () => {}
  },
  // remove the button at the end of the component
  removeButton: {
    type: Boolean,
    default: false
  },
  // add exit button to header
  backButton: {
    type: Boolean,
    default: false
  },
  //validate iamge required
  imageRequired: {
    type: Boolean,
    default: false
  },
  titleAdd: {
    type: String,
    default: 'reuse.addCategory',
    Descriptions: 'tiêu đề nút thêm mới'
  },
  tab: {
    type: String,
    default: ''
  }
})
const formValue = ref()
const emit = defineEmits(['post-data', 'customize-form-data', 'edit-data'])

//get data from table
const getTableValue = async () => {
  if (!isNaN(props.id)) {
    const res = await props.apiId({ ...props.params, Id: props.id })
    if (res) {
      if (res.data?.list !== undefined) {
        formValue.value = res.data.list[0]
      } else if (res.data[0]) {
        formValue.value = res.data[0]
      } else {
        formValue.value = res.data
      }
      await setFormValue()
    } else {
      ElNotification({
        message: t('reuse.cantGetData'),
        type: 'warning'
      })
    }
  }
}
// eslint-disable-next-line vue/no-setup-props-destructure
const schema = props.schema
const { register, methods, elFormRef } = useForm({
  schema
})
let fileList = ref<UploadUserFile[]>([])

//formValue lay tu api
const customizeData = async () => {
  emit('customize-form-data', formValue.value)
}
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const imageUrl = ref()
//set data for form edit and detail
const setFormValue = async () => {
  //neu can xu li du lieu thi emit len component de tu xu li du lieu
  await customizeData()
  const { setValues } = methods
  if (props.formDataCustomize !== undefined) {
    setValues(props.formDataCustomize)
    const ImageNull = props.formDataCustomize.imageurl
    const linkNull = 'https://dev-luxdeal-api.cftsoft.com/null'
    if (ImageNull == linkNull) {
      imageUrl.value = ''
      imageUrl.value.disable = true
    }

    if (props.hasImage && !props.multipleImages) {
      imageUrl.value = props.formDataCustomize.imageurl
    }
    console.log('data', props.formDataCustomize)
    if (props.hasImage && props.multipleImages) {
      // Images tao tu formDataCustomize
      props.formDataCustomize?.Images.map((image) =>
        fileList.value.push({ url: `${API_URL}${image.path}`, name: image.domainUrl })
      )
    }
    if (props.formDataCustomize && props.formDataCustomize.images) {
      imageUrl.value = `${API_URL}${props.formDataCustomize.images[0].path}`
    }
  } else {
    setValues(formValue.value)
  }
}

//Lấy dữ liệu từ bảng khi ấn nút detail hoặc edit
watch(
  () => props.type,
  () => {
    if (props.type === 'detail') {
      const { setProps, setSchema } = methods
      setProps({
        disabled: true
      })
      setSchema(
        schema.map((component) => ({
          field: component.field,
          path: 'componentProps.placeholder',
          value: ''
        }))
      )
      setSchema([
        {
          field: 'description',
          path: 'componentProps.disabled',
          value: true
        }
      ])
    }
    if (props.type === 'detail' || props.type === 'edit' || props.type === 'approval-product') {
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
  getFormData: methods.getFormData,
  setValues: methods.setValues
})

const route = useRoute()
const loading = ref(false)

//doc du lieu tu bang roi emit len goi API

const tabs = ref()
const save = async (type) => {
  await unref(elFormRef)!.validate(async (isValid) => {
    //validate image
    let validateFile = false
    if (props.hasImage) {
      if (props.multipleImages) {
        validateFile = await beforeAvatarUpload(ListFileUpload.value, 'list')
      } else {
        validateFile = await beforeAvatarUpload(rawUploadFile.value, 'single')
      }
    } else {
      validateFile = true
    }
    if (isValid && validateFile) {
      loading.value = true
      const { getFormData } = methods
      let data = (await getFormData()) as TableData
      props.multipleImages
        ? (data.Images = ListFileUpload.value
            ? ListFileUpload.value?.map((file) => (file.raw ? file.raw : null))
            : null)
        : (data.Image = rawUploadFile.value?.raw ? rawUploadFile.value?.raw : null)
      //callback cho hàm emit
      if (type == 'add') {
        data.backRouter = true
        data.tabs = tabs
        data.tab =
          props.tab == 'branch' ? 1 : props.tab == 'department' ? 2 : props.tab == 'rank' ? 3 : 4
        emit('post-data', data)
        loading.value = false
      }
      if (type == 'saveAndAdd') {
        emit('post-data', data)
        unref(elFormRef)!.resetFields()
        loading.value = false
      }
      if (type == 'edit') {
        data.backRouter = true
        data.Id = props.id
        data.tabs = tabs
        // fix cung theo api (nen theo 1 quy tac)
        data.NewPhotos = fileList.value
        data.DeleteFileIds = DeleteFileIds
        data.Imageurl = data.Image ? null : imageUrl.value
        emit('edit-data', data)
        loading.value = false
      }
      fileList.value = []
      imageUrl.value = undefined
    } else {
      ElMessage.error(t('reuse.notFillAllInformation'))
    }
  })
}
const addIcon = useIcon({ icon: 'uil:plus' })
const viewIcon = useIcon({ icon: 'uil:search' })
const deleteIcon = useIcon({ icon: 'uil:trash-alt' })

//if schema has image then split screen
let fullSpan = ref<number>()
let rawUploadFile = ref<UploadFile>()
props.hasImage ? (fullSpan.value = 12) : (fullSpan.value = 24)
//set Title
let title = ref(props.title)
if (props.title == 'undefined') {
  title.value = 'Category'
}

let DeleteFileIds: any = []
const handleRemove = (file: UploadFile) => {
  fileList.value = fileList.value?.filter((image) => image.url !== file.url)
  ListFileUpload.value = ListFileUpload.value?.filter((image) => image.url !== file.url)
  // remove image when edit data
  if (props.formDataCustomize.Images.length > 0) {
    let imageRemove = props.formDataCustomize?.Images.find(
      (image) => `${API_URL}${image.path}` === file.url
    )
    if (imageRemove) {
      DeleteFileIds.push(imageRemove?.id)
    }
  }
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}
//validate Ảnh
const validImageType = ['jpeg', 'png']
const beforeAvatarUpload = async (rawFile, type: string) => {
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
    else if (type === 'list') {
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
  } else {
    if (props.imageRequired) {
      //báo lỗi nếu ko có ảnh
      if (type === 'list' && fileList.value.length > 0) {
        return true
      }
      if (type === 'single' && (rawUploadFile.value != undefined || imageUrl.value != undefined)) {
        return true
      } else {
        ElMessage.warning(t('reuse.notHaveImage'))
        return false
      }
    }
    return true
  }
}
//chuyển sang edit nếu ấn nút edit ở chỉnh sửa khi đang ở chế độ xem
const { push } = useRouter()
const router = useRouter()
const edit = () => {
  push({
    // name: `human-resource-management.department-directory.${utility}`,
    name: `${String(router.currentRoute.value.name)}`,
    // params: { id: row.id, type: type, tab: props.tabs }
    params: {
      backRoute: `${String(router.currentRoute.value.name)}`,
      tab: props.tab,
      type: 'edit',
      id: props.id
    }
  })
}
//xóa dữ liệu sản phẩm
const delAction = async () => {
  {
    ElMessageBox.confirm(`${t('reuse.deleteWarning')}`, props.deleteTitle, {
      confirmButtonText: t('reuse.delete'),
      cancelButtonText: t('reuse.exit'),
      type: 'warning',
      confirmButtonClass: 'ElButton--danger'
    })
      .then(() => {
        const res = props.delApi({ Id: props.id })
        if (res) {
          ElNotification({
            message: t('reuse.deleteSuccess'),
            type: 'success'
          }),
            router.go(-1)
        } else {
          ElNotification({
            message: t('reuse.deleteFail'),
            type: 'warning'
          })
        }
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
  router.go(-1)
}
//xử lí ảnh
const ListFileUpload = ref()
const handleChange: UploadProps['onChange'] = async (uploadFile, uploadFiles) => {
  if (!props.multipleImages) {
    const validImage = await beforeAvatarUpload(uploadFile, 'single')
    if (validImage) {
      rawUploadFile.value = uploadFile
      imageUrl.value = URL.createObjectURL(uploadFile.raw!)
    } else {
    }
  } else {
    ListFileUpload.value = uploadFiles
    uploadFiles.map(async (file) => {
      ;(await beforeAvatarUpload(file, 'single')) ? '' : file.raw ? handleRemove(file) : ''
    })
  }
}
const previewImage = () => {
  dialogVisible.value = true
  dialogImageUrl.value = imageUrl.value
}
const removeImage = () => {
  rawUploadFile.value = undefined
  imageUrl.value = undefined
}

type ListImages = 'text' | 'picture' | 'picture-card'
const listType = ref<ListImages>('text')
!props.multipleImages ? (listType.value = 'text') : (listType.value = 'picture-card')

onBeforeMount(() => {
  tabs.value = String(route.params.tab)
})

const approvalId = String(route.params.approvalId)
const approvalProduct = async () => {
  const payload = { ItemType: 1, Id: parseInt(approvalId), IsApprove: true }
  await approvalProducts(FORM_IMAGES(payload))
    .then(() => {
      ElNotification({
        message: 'Duyệt thành công',
        type: 'success'
      })
      push({
        name: `approve.products-approval.newly-initialized`
      })
    })
    .catch(() =>
      ElNotification({
        message: 'Duyệt thất bại',
        type: 'warning'
      })
    )
}
</script>
<template>
  <ContentWrap :title="props.title" :back-button="props.backButton">
    <ElRow class="pl-8" :gutter="20" justify="space-between">
      <ElCol :span="fullSpan">
        <Form :rules="rules" @register="register" />
      </ElCol>
      <ElCol :span="hasImage ? 12 : 0" v-if="hasImage" class="max-h-400px overflow-y-auto">
        <ElDivider class="text-center font-bold ml-2">{{ t('reuse.addImage') }}</ElDivider>
        <el-upload
          action="#"
          :disabled="props.type === 'detail'"
          :auto-upload="false"
          :show-file-list="multipleImages"
          v-model:file-list="fileList"
          :list-type="listType"
          :limit="limitUpload"
          :on-change="handleChange"
          :multiple="multipleImages"
          :class="multipleImages ? '' : 'avatar-uploader'"
        >
          <div v-if="!multipleImages">
            <div
              v-if="imageUrl"
              style="width: 148px; height: 148px; border-radius: 4px"
              class="flex justify-center relative mb-2"
            >
              <ElImage fit="contain" :src="imageUrl" class="avatar" />
            </div>
            <ElButton
              v-else
              :icon="addIcon"
              style="border: dashed 1px #e5e7eb"
              class="avatar-uploader-icon"
            />
          </div>
          <div v-else>
            <ElButton :icon="addIcon" />
          </div>
          <template #file="{ file }">
            <div class="ml-auto mr-auto">
              <ElImage fit="contain" style="width: 148px; height: 148px" :src="file.url" alt="" />
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                  <ElButton :icon="viewIcon" />
                </span>
                <span
                  v-if="props.type !== 'detail'"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <ElButton :icon="deleteIcon" :disabled="props.type === 'detail'" />
                </span>
              </span>
            </div>
          </template>
        </el-upload>
        <div
          class="w-250px flex justify-center"
          :class="multipleImages ? 'avatar-uploader' : 'one-avatar-uploader'"
          v-if="imageUrl"
        >
          <ElButton :icon="viewIcon" @click="previewImage" />
          <ElButton :icon="deleteIcon" :disabled="props.type === 'detail'" @click="removeImage" />
        </div>
        <el-dialog :close-on-click-modal="doCloseOnClickModal" top="5vh" v-model="dialogVisible" width="130vh">
          <el-image class="h-full" :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </ElCol>
    </ElRow>
    <template #under v-if="!removeButton">
      <div class="w-[100%]" v-if="props.type === 'add'">
        <div class="w-[50%] flex justify-center gap-2 ml-8">
          <ElButton type="primary" :loading="loading" @click="save('add')">
            {{ t('reuse.save') }}
          </ElButton>
          <ElButton type="primary" :loading="loading" @click="save('saveAndAdd')">
            {{ t('reuse.saveAndAdd') }}
          </ElButton>
          <ElButton :loading="loading" @click="cancel()">
            {{ t('reuse.cancel') }}
          </ElButton>
        </div>
      </div>
      <div class="w-[100%]" v-if="props.type === 'edit'">
        <div class="w-[50%] flex justify-center gap-2 ml-5">
          <ElButton :loading="loading" type="primary" @click="save('edit')">
            {{ t('reuse.save') }}
          </ElButton>
          <ElButton :loading="loading" @click="cancel">
            {{ t('reuse.cancel') }}
          </ElButton>
          <!-- <ElButton type="danger" :loading="loading" @click="delAction">
          {{ t('reuse.delete') }}
        </ElButton> -->
        </div>
      </div>
      <div class="w-[100%]" v-if="props.type === 'detail'">
        <div class="w-[50%] flex justify-center gap-2 ml-5">
          <ElButton class="pl-8 pr-8" :loading="loading" @click="edit">
            {{ t('reuse.fix') }}
          </ElButton>
          <ElButton class="pl-8 pr-8" type="danger" :loading="loading" @click="delAction">
            {{ t('reuse.delete') }}
          </ElButton>
        </div>
      </div>
      <div class="pl-57" v-if="props.type === 'approval-product'">
        <el-button @click="approvalProduct" class="min-w-[120px]" type="warning">Duyệt</el-button>
        <el-button class="min-w-[120px]">Không duyệt</el-button>
      </div>
    </template>
  </ContentWrap>
</template>
<style scoped>
.avatar-uploader .avatar {
  display: block;
  width: 250px;
  padding-bottom: 1rem;
}

.avatar-uploader .el-upload {
  position: relative;
  margin-left: 2rem;
  overflow: hidden;
  cursor: pointer;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader :deep(.el-upload) {
  display: flex;
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  width: 148px;
  height: 148px;
}

.one-avatar-uploader {
  display: flex;
  justify-content: center;
  margin: 0 auto;
}

:deep(.el-dialog__body) {
  display: flex;
  max-height: 85vh;
  overflow: auto;
  justify-content: center;
}

:deep(.el-button) {
  min-width: 150px;
  min-height: 40px;
}
</style>
