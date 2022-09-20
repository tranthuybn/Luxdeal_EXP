<!-- eslint-disable vue/no-mutating-props -->
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
  ElImage,
  ElTreeSelect,
  ElRadioGroup,
  ElRadio,
  ElSelect,
  ElOption
} from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import type { UploadFile } from 'element-plus'
import { TableResponse } from '../../Components/Type'
import { useRouter } from 'vue-router'
import { getCategories } from '@/api/LibraryAndSetting'
import { PRODUCTS_AND_SERVICES } from '@/utils/API.Variables'
import { getCodeAndNameProductLibrary } from '@/api/LibraryAndSetting'
import { API_URL } from '@/utils/API_URL'
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
    if (res) {
      if (res.data?.list !== undefined) {
        formValue.value = res.data.list[0]
      } else {
        formValue.value = res.data[0]
      }
      await customizeData()
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
// luu du lieu vao form
const customizeData = async () => {
  emit('customize-form-data', formValue.value, () => setFormValue())
}
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
const imageUrl = ref('')
//set data for form edit and detail
const setFormValue = async () => {
  //neu can xu li du lieu thi emit len component de tu xu li du lieu
  const { setValues } = methods
  if (props.formDataCustomize !== undefined) {
    setValues(props.formDataCustomize)
    if (!props.multipleImages) {
      imageUrl.value = props.formDataCustomize.imageurl
    }
  } else {
    setValues(formValue.value)
  }
  if (props.multipleImages) {
    formValue.value.productImages.map((image) =>
      fileList.value.push({ url: `${API_URL}${image.path}`, name: image.domainUrl })
    )
  }
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
let treeSelectData = ref()

//doc du lieu tu bang roi emit len goi API
const { go } = useRouter()
const save = async (type) => {
  await unref(elFormRef)!.validate(async (isValid) => {
    //validate image
    let validateFile = false
    if (props.hasImage) {
      if (props.multipleImages) {
        validateFile = await beforeAvatarUpload(fileList.value, 'list')
      } else {
        validateFile = await beforeAvatarUpload(rawUploadFile.value, 'single')
      }
    }
    if (isValid && validateFile) {
      loading.value = true
      const { getFormData } = methods
      let data = (await getFormData()) as TableData
      if (treeSelectData.value == undefined) {
        await apiTreeSelect()
      }
      let ProductTypeId = treeSelectData.value.find((tree) =>
        tree.children.find((child) => child.label == data.ProductTypeId)
      )
      ProductTypeId = ProductTypeId.children.find((options) => options.label === data.ProductTypeId)
      data.ProductTypeId = ProductTypeId.id
      props.multipleImages
        ? (data.Images = fileList.value!.map((file) => (file.raw ? file.raw : file)))
        : (data.Image = rawUploadFile.value?.raw)
      if (type == 'add') {
        emit('post-data', data, () => go(-1))
        loading.value = false
        go(-1)
      }
      if (type == 'saveAndAdd') {
        emit('post-data', data)
        unref(elFormRef)!.resetFields()
        loading.value = false
      }
      if (type == 'edit') {
        data.Id = props.id
        emit('edit-data', data, () => go(-1))
        loading.value = false
        go(-1)
      }
    }
    if (!isValid) {
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

const beforeAvatarUpload = async (rawFile, type: string) => {
  if (rawFile) {
    if (type === 'single') {
      if (rawFile.raw && rawFile.raw['type'].split('/')[0] !== 'image') {
        ElMessage.error(t('reuse.notImageFile'))
        return false
      } else if (rawFile.raw.size / 1024 / 1024 > 4) {
        ElMessage.error(t('reuse.imageOver4MB'))
        return false
      }
    }
    if (type === 'list') {
      let inValid = true
      rawFile.map((file) => {
        if (file.raw && file.raw['type'].split('/')[0] !== 'image') {
          ElMessage.error(t('reuse.notImageFile'))
          inValid = false
        } else if (file.size / 1024 / 1024 > 4) {
          ElMessage.error(t('reuse.imageOver4MB'))
          inValid = false
        }
      })
      return inValid
    }
    return true
  } else {
    ElMessage.warning(t('reuse.notHaveImage'))
    return false
  }
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
        const res = props.delApi({ Id: props.id })
        if (res) {
          ElNotification({
            message: t('reuse.deleteSuccess'),
            type: 'success'
          }),
            go(-1)
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
  go(-1)
}
const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  if (!props.multipleImages) {
    rawUploadFile.value = uploadFile
    imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  } else {
    fileList.value = uploadFiles
  }
}
const previewImage = () => {
  dialogVisible.value = true
  dialogImageUrl.value = imageUrl.value
}
const removeImage = () => {
  rawUploadFile.value = undefined
  imageUrl.value = ''
}
type ListImages = 'text' | 'picture' | 'picture-card'
const listType = ref<ListImages>('text')
!props.multipleImages ? (listType.value = 'text') : (listType.value = 'picture-card')
let timeCallAPI = 0
const apiTreeSelect = async () => {
  if (timeCallAPI == 0) {
    await getCategories({ TypeName: PRODUCTS_AND_SERVICES[0].key })
      .then((res) => {
        if (res.data) {
          treeSelectData.value = res.data.map((index) => ({
            label: index.name,
            value: index.name,
            id: index.id,
            children: index.children.map((child) => ({
              value: child.name,
              label: child.name,
              id: child.id
            }))
          }))
        }
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => timeCallAPI++)
  }
}
let CodeAndNameSelect = ref()
let NameAndCodeSelect = ref()
let callGetCodeAndNameAPI = 0
const getCodeAndNameSelect = async () => {
  if (callGetCodeAndNameAPI == 0) {
    const res = await getCodeAndNameProductLibrary()
    CodeAndNameSelect.value = res.data.map((val) => ({
      label: val.productCode,
      value: val.productCode,
      name: val.name
    }))
    NameAndCodeSelect.value = res.data.map((val) => ({
      label: val.name,
      value: val.name,
      productCode: val.productCode
    }))
    callGetCodeAndNameAPI++
  }
}
</script>
<template>
  <ContentWrap :title="props.title">
    <ElRow :gutter="20" justify="space-between">
      <ElCol :span="fullSpan">
        <Form :rules="rules" @register="register">
          <template #ProductTypeId="form">
            <ElTreeSelect
              v-model="form['ProductTypeId']"
              :data="treeSelectData"
              @focus="apiTreeSelect"
              style="width: 100%"
            />
          </template>
          <template #HireInventoryStatus-label>
            <div class="text-right ml-2 leading-5">
              <label>{{ t('reuse.setInventoryForSale') }}</label>
              <p class="text-[#FECB80]">{{ t('reuse.showOnAppWebUser') }}</p>
            </div>
          </template>
          <template #SellInventoryStatus-label>
            <div class="text-right ml-2 leading-5">
              <label>{{ t('reuse.setInventoryForRent') }}</label>
              <p class="text-[#FECB80]">{{ t('reuse.showOnAppWebUser') }}</p>
            </div>
          </template>
          <template #ProductStatus-label>
            <div class="w-full text-right ml-2 leading-5">
              <label>{{ t('reuse.productStatus') }}</label>
              <p class="text-[#FECB80]">{{ t('reuse.forAllAttribute') }}</p>
            </div>
          </template>
          <template #ProductCode-label>
            <div class="w-2/3 text-right ml-2 leading-5">
              <label>{{ t('reuse.productCode') }}</label>
              <p class="text-[#a1a1a1]">{{ t('reuse.productCodeDescription') }}</p>
            </div>
          </template>
          <template #ProductCode="form">
            <el-select
              v-model="form['ProductCode']"
              :placeholder="`${t('reuse.enterProductCode')}`"
              @focus="getCodeAndNameSelect"
              style="width: 100%"
              allow-create
              filterable
              clearable
            >
              <el-option
                v-for="item in NameAndCodeSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="true"
              >
                <span style="float: left">{{ t('reuse.productCode') }}: {{ item.label }}</span>
                <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px"
                  >{{ t('reuse.productName') }}: {{ item.productCode }}</span
                >
              </el-option>
            </el-select>
          </template>
          <template #Name="form">
            <el-select
              v-model="form['Name']"
              :placeholder="`${t('reuse.enterProductName')}`"
              @focus="getCodeAndNameSelect"
              style="width: 100%"
              allow-create
              filterable
              clearable
            >
              <el-option
                v-for="item in CodeAndNameSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="true"
              >
                <span style="float: left">{{ t('reuse.productName') }}: {{ item.label }}</span>
                <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px"
                  >{{ t('reuse.productCode') }}: {{ item.name }}</span
                >
              </el-option>
            </el-select>
          </template>
          <template #Name-label>
            <div class="w-full text-right ml-2 leading-5">
              <label>{{ t('reuse.productName') }}</label>
              <p class="text-[#FECB80]">{{ t('reuse.under50Characters') }}</p>
            </div>
          </template>
          <template #ShortDescription-label>
            <div class="w-full text-right ml-2 leading-5">
              <label>{{ t('reuse.shortDescription') }}</label>
              <p class="text-[#FECB80]">{{ t('reuse.under50Characters') }}</p>
            </div>
          </template>
          <template #ProductStatus="form">
            <div>
              <el-radio-group v-model="form['ProductStatus']">
                <el-radio :label="1">{{ t('reuse.pending') }}</el-radio>
                <el-radio :label="2">{{ t('reuse.active') }}</el-radio>
                <el-radio :label="3"
                  >{{ t('reuse.stopActive')
                  }}<span class="text-[#FECB80]">
                    ({{ t('reuse.allBusinessRelatedActivities') }})</span
                  ></el-radio
                >
              </el-radio-group>
            </div>
          </template>
        </Form>
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
          :limit="10"
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
        <!-- <div v-if="props.typeButton === 'form01'">
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
            </div> -->
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
