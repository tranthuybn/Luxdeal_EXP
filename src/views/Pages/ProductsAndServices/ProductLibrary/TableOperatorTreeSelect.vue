<!-- eslint-disable vue/no-mutating-props -->
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
import { getBusinessProductLibrary, getCategories } from '@/api/LibraryAndSetting'
import { PRODUCTS_AND_SERVICES } from '@/utils/API.Variables'
import { getCodeAndNameProductLibrary } from '@/api/LibraryAndSetting'
import { API_URL } from '@/utils/API_URL'
import {
  customPostData,
  getBrandSelectOptions,
  getOriginSelectOptions,
  getUnitSelectOptions
} from './ProductLibraryManagement'
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
// luu du lieu vao form
const customizeData = async () => {
  emit('customize-form-data', formValue.value)
}
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
const imageUrl = ref('')
//set data for form edit and detail
const { setValues } = methods
const setFormValue = async () => {
  //neu can xu li du lieu thi emit len component de tu xu li du lieu
  await customizeData()

  if (props.formDataCustomize !== undefined) {
    await customPostData(props.formDataCustomize)
    setValues(props.formDataCustomize)
    if (props.multipleImages) {
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
        validateFile = await beforeAvatarUpload(ListFileUpload.value, 'list')
      } else {
        validateFile = await beforeAvatarUpload(rawUploadFile.value, 'single')
      }
    } else {
      validateFile = true
    }
    if (sameProductCode.value) {
      ElNotification({
        message: t('reuse.cantChooseSameProductCode'),
        type: 'error'
      })
      return
    }
    if (isValid && validateFile) {
      loading.value = true
      const { getFormData } = methods
      let data = (await getFormData()) as TableData
      if (treeSelectData.value == undefined) {
        await apiTreeSelect()
      }
      let parentNode = true
      let ProductTypeId = treeSelectData.value.find((tree) => {
        if (tree.children.length > 0) {
          parentNode = false
          return tree?.children.find((child) => child.label == data.ProductTypeId)
        } else {
          parentNode = true
          return tree.label == data.ProductTypeId
        }
      })
      parentNode
        ? (ProductTypeId = ProductTypeId)
        : (ProductTypeId = ProductTypeId.children.find(
            (options) => options.label === data.ProductTypeId
          ))
      ProductTypeId
        ? (data.ProductTypeId = ProductTypeId.id)
        : ElNotification({
            message: t('reuse.cantFindProductData'),
            type: 'warning'
          })
      props.multipleImages
        ? (data.Images = ListFileUpload.value
            ? ListFileUpload.value.map((file) => (file.raw ? file.raw : null))
            : null)
        : (data.Image = rawUploadFile.value?.raw)
      if (type == 'add') {
        emit('post-data', data, go(-1))
        loading.value = false
      }
      if (type == 'saveAndAdd') {
        emit('post-data', data)
        unref(elFormRef)!.resetFields()
        props.multipleImages
          ? ListFileUpload.value.map((file) => handleRemove(file))
          : removeImage()
        loading.value = false
      }
      if (type == 'edit') {
        data.Id = props.id
        data.DeleteFileIds = DeleteFileIds.toString()
        emit('edit-data', data, go(-1))
        loading.value = false
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
let DeleteFileIds: any = []
const handleRemove = (file: UploadFile) => {
  fileList.value = fileList.value?.filter((image) => image.url !== file.url)
  ListFileUpload.value = ListFileUpload.value?.filter((image) => image.url !== file.url)
  // remove image when edit data
  if (formValue.value && formValue.value.productImages) {
    let imageRemove = formValue.value.productImages.find(
      (image) => `${API_URL}${image.path}` === file.url
    )
    if (imageRemove) {
      DeleteFileIds.push(imageRemove?.fileId)
    }
  }
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

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
      } else if (rawFile.name?.length > 100) {
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
        } else if (file.name?.length > 100) {
          ElMessage.error(t('reuse.checkNameImageLength'))
          inValid = false
          return false
        }
      })
      return inValid
    }
    return true
  } else {
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
const ListFileUpload = ref()
const handleChange: UploadProps['onChange'] = async (uploadFile, uploadFiles) => {
  if (!props.multipleImages) {
    const validImage = await beforeAvatarUpload(uploadFile, 'single')
    if (validImage) {
      rawUploadFile.value = uploadFile
      imageUrl.value = URL.createObjectURL(uploadFile.raw!)
    }
  } else {
    const validImage = await beforeAvatarUpload(uploadFiles, 'list')
    ListFileUpload.value = uploadFiles
    if (!validImage) {
      uploadFiles.map((file) => {
        file.raw ? handleRemove(file) : ''
      })
    }
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
    await getCategories({ TypeName: PRODUCTS_AND_SERVICES[0].key, pageSize: 100, pageIndex: 1 })
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
let CodeOptions = ref()
let NameAndCodeSelect = ref()
const getCodeAndNameSelect = async () => {
  const res = await getCodeAndNameProductLibrary()
  CodeAndNameSelect.value = res.data.map((val) => ({
    label: val.productCode,
    value: val.productCode,
    name: val.name,
    id: val.id
  }))
  NameAndCodeSelect.value = res.data.map((val) => ({
    label: val.name,
    value: val.name,
    productCode: val.productCode
  }))
  CodeOptions.value = CodeAndNameSelect.value
}
const remoteProductCode = async (query: string) => {
  if (query) {
    const res = await getCodeAndNameProductLibrary({ Keyword: query })
    CodeOptions.value = res.data.map((val) => ({
      label: val.productCode,
      value: val.productCode,
      name: val.name,
      id: val.id
    }))
  } else {
    CodeOptions.value = CodeAndNameSelect.value
  }
}
const remoteProductName = async (query: string) => {
  if (query) {
    const res = await getCodeAndNameProductLibrary({ Keyword: query })
    NameAndCodeSelect.value = res.data.map((val) => ({
      label: val.name,
      value: val.name,
      productCode: val.productCode
    }))
  } else {
    NameAndCodeSelect.value = []
  }
}
const sameProductCode = ref(false)
const fillAllInformation = async (data) => {
  const codeObj = CodeOptions.value.find((code) => code.value == data)
  codeObj
    ? await getBusinessProductLibrary({ Id: codeObj?.id })
        .then((res) => {
          if (res.data.length == 0) {
            ElNotification({
              message: t('reuse.cantFindData'),
              type: 'warning'
            })
          } else {
            const fillValue = res.data[0]
            const BrandId = fillValue.categories[0].id
            const UnitId = fillValue.categories[2].id
            const OriginId = fillValue.categories[3].id
            setValues({
              ProductTypeId: fillValue.categories[1].value,
              BrandId: BrandId,
              UnitId: UnitId,
              OriginId: OriginId,
              ShortDescription: fillValue.shortDescription,
              VerificationInfo: fillValue.verificationInfo,
              Description: fillValue.description
            })
            const checkData = { BrandId: BrandId, UnitId: UnitId, OriginId: OriginId }
            customPostData(checkData)
          }
          sameProductCode.value = true
        })
        .catch((error) =>
          ElNotification({
            message: error,
            type: 'warning'
          })
        )
    : (sameProductCode.value = false)
}

const callApiAttribute = async () => {
  await getUnitSelectOptions(), await getOriginSelectOptions(), await getBrandSelectOptions()
}
//for infinite scroll
// const scrollMethod = () => {
// console.log('scroll value', scrollTop)
// console.log('height', divRef.value?.clientHeight)
// }
// const divRef = ref<HTMLDivElement>()
onBeforeMount(() => {
  callApiAttribute()
  // console.log('height', divRef.value)
})
//key up enter
const changeTreeData = (data) => {
  setValues({ ProductTypeId: data })
}
</script>
<template>
  <ContentWrap :title="props.title">
    <ElRow :gutter="20" justify="space-between">
      <ElCol :span="fullSpan">
        <Form :rules="rules" @register="register">
          <template #ProductTypeId="form">
            <ElTreeSelect
              :modelValue="form['ProductTypeId']"
              :data="treeSelectData"
              @focus="apiTreeSelect"
              style="width: 100%"
              @change="(data) => changeTreeData(data)"
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
              @click="getCodeAndNameSelect"
              style="width: 100%"
              allow-create
              filterable
              clearable
              remote
              :remote-method="remoteProductCode"
              default-first-option
              @change="(data) => fillAllInformation(data)"
            >
              <!-- <el-scrollbar ref="scrollbarRef" height="400px" always @scroll="scrollMethod">
                <div ref="divRef" class="whereisthis"> -->
              <el-option
                ref="optionCodeHeight"
                v-for="item in CodeOptions"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ t('reuse.productCode') }}: {{ item.label }}</span>
                <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px"
                  >{{ t('reuse.productName') }}: {{ item.name }}</span
                >
              </el-option>
              <!-- </div>
              </el-scrollbar> -->
            </el-select>
          </template>
          <template #Name="form">
            <el-select
              v-model="form['Name']"
              :placeholder="`${t('reuse.enterProductName')}`"
              @click="getCodeAndNameSelect"
              style="width: 100%"
              allow-create
              filterable
              clearable
              remote
              :remote-method="remoteProductName"
              default-first-option
            >
              <el-option
                v-for="item in NameAndCodeSelect"
                :key="item.id"
                :label="item.label"
                :value="item.value"
                :disabled="true"
            /></el-select>
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
                <el-radio :label="1"
                  >{{ t('reuse.active')
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
          :multiple="multipleImages"
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
        <ElButton :loading="loading" @click="go(-1)">
          {{ t('reuse.cancel') }}
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
