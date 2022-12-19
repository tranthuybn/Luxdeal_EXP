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
import { isEqual } from 'lodash-es'
import { formatProductStatus } from '@/utils/format'
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
  },
  apiStatus: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['post-data', 'customize-form-data', 'edit-data'])
const formValue = ref()

const disabledUpload = ref(false)
const disabledEverything = () => {
  disabledUpload.value = true
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
  setSchema([{ field: 'Description', path: 'componentProps.disabled', value: true }])
}
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
      disabledEverything()
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
        ? (data.ProductType = ProductTypeId.id)
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
        data.disabledTabOpen = false
        emit('post-data', data)
        //emit a callback function to check if Promise success or fail
        //use this to get the statusResult of emit event
        //in the parent component should use resolve('abcd')
        //    var promise =  new Promise((resolve) => emit('post-data',data,resolve))
        //   console.log('promise:', promise)
        //   promise.then(value => console.log(value))
        //   console.log('run here first??')
        // }
        disabledEverything()
        setValues({ ProductStatus: 0, ProductTypeId: ProductTypeId })
      }
      if (type == 'saveAndAdd') {
        data.disabledTabOpen = true
        emit('post-data', data)
        if (props.apiStatus) {
          unref(elFormRef)!.resetFields()
          props.multipleImages
            ? ListFileUpload.value.map((file) => handleRemove(file))
            : removeImage()
        }
      }
      if (type == 'edit') {
        data.Id = props.id
        data.DeleteFileIds = DeleteFileIds.toString()
        emit('edit-data', data, go(-1))
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
  imageUrl.value = ''
}
type ListImages = 'text' | 'picture' | 'picture-card'
const listType = ref<ListImages>('text')
!props.multipleImages ? (listType.value = 'text') : (listType.value = 'picture-card')
let timeCallAPI = 0
const apiTreeSelect = async () => {
  if (timeCallAPI == 0) {
    await getCategories({ TypeName: PRODUCTS_AND_SERVICES[0].key, pageSize: 1000, pageIndex: 1 })
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
  const res = await getCodeAndNameProductLibrary({ pageIndex: 1, pageSize: 20 })
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
const lastCodeObj = ref()
const fillAllInformation = async (data) => {
  const codeObj = CodeOptions.value.find((code) => code.value == data)
  //for fix bug purpose
  if (isEqual(codeObj, lastCodeObj.value) && codeObj !== undefined) {
    ElMessageBox.confirm(t('reuse.fillProductInformationAgain'), t('reuse.notification'), {
      confirmButtonText: t('reuse.confirm'),
      cancelButtonText: t('reuse.cancel'),
      type: 'info'
    })
      .then(() => {
        getBusinessProductLibrary({ Id: codeObj?.id })
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
                ProductCode: null,
                Name: fillValue.name,
                ShortDescription: fillValue.shortDescription,
                VerificationInfo: fillValue.verificationInfo,
                ProductTypeId: fillValue.categories[1].value,
                BrandId: BrandId,
                UnitId: UnitId,
                OriginId: OriginId,
                Description: fillValue.description
              })
              const checkData = { BrandId: BrandId, UnitId: UnitId, OriginId: OriginId }
              customPostData(checkData)
            }
            sameProductCode.value = true
          })
          .catch(() =>
            ElNotification({
              message: t('reuse.cantFindData'),
              type: 'warning'
            })
          )
      })
      .catch(() => {})
      .finally(() => {
        setValues({ ProductCode: null })
      })
    return
  } else {
    lastCodeObj.value = codeObj
    //if find code in api
    codeObj
      ? //ask if they want to change value of product type, brand ..
        ElMessageBox.confirm(t('reuse.fillProductInformation'), t('reuse.notification'), {
          confirmButtonText: t('reuse.confirm'),
          cancelButtonText: t('reuse.cancel'),
          type: 'info'
        })
          .then(() => {
            getBusinessProductLibrary({ Id: codeObj?.id })
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
                    ProductCode: null,
                    Name: fillValue.name,
                    ShortDescription: fillValue.shortDescription,
                    VerificationInfo: fillValue.verificationInfo,
                    ProductTypeId: fillValue.categories[1].value,
                    BrandId: BrandId,
                    UnitId: UnitId,
                    OriginId: OriginId,
                    Description: fillValue.description
                  })
                  const checkData = { BrandId: BrandId, UnitId: UnitId, OriginId: OriginId }
                  customPostData(checkData)
                }
                sameProductCode.value = true
              })
              .catch(() =>
                ElNotification({
                  message: t('reuse.cantFindData'),
                  type: 'warning'
                })
              )
          })
          .catch(() => {})
          .finally(() => {
            setValues({ ProductCode: null })
          })
      : (sameProductCode.value = false)
    // .finally(() => {
    //   setValues({ ProductCode: '' })
    // })
  }
}

const callApiAttribute = async () => {
  await getUnitSelectOptions(),
    await getBrandSelectOptions(),
    await getOriginSelectOptions(),
    await apiTreeSelect()
}

onBeforeMount(() => {
  callApiAttribute()
  setValues({ ProductStatus: 1 })
})
//key up enter
const changeTreeData = (data) => {
  setValues({ ProductTypeId: data })
}
//fixbug
const scrolling = (e) => {
  const clientHeight = e.target.clientHeight
  const scrollHeight = e.target.scrollHeight
  const scrollTop = e.target.scrollTop
  if (scrollTop == 0) {
  }
  if (scrollTop + clientHeight >= scrollHeight) {
    infiniteProduct()
  }
}
let pageSize = 2
const infiniteProduct = async () => {
  const res = await getCodeAndNameProductLibrary({ pageIndex: pageSize, pageSize: 20 })
  if (res) {
    res.data.map((val) =>
      CodeAndNameSelect.value.push({
        label: val.productCode,
        value: val.productCode,
        name: val.name,
        id: val.id
      })
    )
    res.data.map((val) =>
      NameAndCodeSelect.value.push({
        label: val.name,
        value: val.name,
        productCode: val.productCode
      })
    )
    CodeOptions.value = CodeAndNameSelect.value
    pageSize++
  }
}
const productCode = ref('')
const productName = ref('')

const setProductCode = () => {
  setValues({ ProductCode: productCode.value })
  fillAllInformation(productCode)
}
const setProductName = () => {
  setValues({ ProductName: productName.value })
}
const resetForm = () => {
  unref(elFormRef)!.resetFields()
  productCode.value = ''
  productName.value = ''
}

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `${t('reuse.limitUploadImages')}. ${t('reuse.imagesYouChoose')}: ${files.length}. ${t(
      'reuse.total'
    )}${files.length + uploadFiles.length}`
  )
}
</script>
<template>
  <ContentWrap :title="props.title">
    <ElRow :gutter="20" justify="space-between">
      <ElCol :span="fullSpan">
        <Form :rules="rules" @register="register">
          <template #ProductTypeId="form">
            <ElTreeSelect
              clearable
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
              @input="(event) => (productCode = event.target.value)"
              @blur="setProductCode"
              @keyup.enter="setProductCode"
              popper-class="max-w-600px"
            >
              <!-- <el-scrollbar ref="scrollbarRef" height="400px" always @scroll="scrollMethod">
                <div ref="divRef" class="whereisthis"> -->
              <div @scroll="scrolling" id="content">
                <el-option
                  ref="optionCodeHeight"
                  v-for="item in CodeOptions"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                >
                  <span style="float: left">{{ t('reuse.productCode') }}: {{ item.label }}</span>
                  <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px"
                    >{{ t('reuse.productName') }}: {{ item.value }}</span
                  >
                </el-option>
              </div>
              <!-- </div>
              </el-scrollbar> -->
            </el-select>
            <el-button @click="resetForm" type="danger" size="small">{{
              t('reuse.resetForm')
            }}</el-button>
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
              popper-class="max-w-600px"
              @input="(event) => (productName = event.target.value)"
              @blur="setProductName"
            >
              <el-option
                v-for="item in NameAndCodeSelect"
                :key="item.id"
                :label="item.label"
                :value="item.value"
            /></el-select>
          </template>
          <template #Name-label>
            <div class="w-full text-right ml-2 leading-5">
              <label>{{ t('reuse.productName') }}</label>
              <p class="text-[#FECB80]">{{ t('reuse.under256Characters') }}</p>
            </div>
          </template>
          <template #ShortDescription-label>
            <div class="w-full text-right ml-2 leading-5">
              <label>{{ t('reuse.shortDescription') }}</label>
              <p class="text-[#FECB80]">{{ t('reuse.under256Characters') }}</p>
            </div>
          </template>
          <template #ProductStatus="form">
            <!-- formatProductStatus cái này chưa chính xác trạng thái nên sửa lại -->
            <div class="bg-gray-300">{{ formatProductStatus(form['ProductStatus']) }}</div>
            <span class="text-[#FECB80]">({{ t('reuse.allBusinessRelatedActivities') }})</span>
          </template>
        </Form>
      </ElCol>
      <ElCol
        :span="hasImage ? 8 : 0"
        v-if="hasImage"
        class="max-h-400px overflow-y-auto shadow-inner p-1"
      >
        <h3 class="text-center font-bold">{{ t('reuse.addImage') }}</h3>
        <span class="text-[#FECB80]">({{ t('reuse.lessThanTenImages') }})</span>
        <el-upload
          action="#"
          class="avatar-uploader"
          :disabled="props.type === 'detail' || disabledUpload"
          :auto-upload="false"
          :show-file-list="multipleImages"
          :multiple="multipleImages"
          v-model:file-list="fileList"
          :list-type="listType"
          :limit="10"
          :on-change="handleChange"
          :on-exceed="handleExceed"
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
            <div class="ml-auto mr-auto">
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                  <el-button :icon="viewIcon" />
                </span>
                <span
                  v-if="props.type !== 'detail' && !disabledUpload"
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
        <el-dialog top="5vh" v-model="dialogVisible" width="130vh">
          <el-image class="h-full" :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </ElCol>
    </ElRow>
    <template #under>
      <!-- <div class="w-\[12\%\]"></div> -->
      <div v-if="props.type === 'add' || isNaN(props.id)">
        <!-- <div v-if="props.typeButton === 'form01'">
                      <ElButton type="primary"  @click="save('add')">
                        {{ t('reuse.save') }}
                      </ElButton>
                      <ElButton type="primary"  @click="save('saveAndAdd')">
                        {{ t('reuse.addNew') }}
                      </ElButton>
                    </div>
                    <div v-if="props.typeButton === 'form02'">
                      <ElButton type="primary"  @click="save">
                        {{ t('reuse.fix') }}
                      </ElButton>
                    </div> -->
        <ElButton type="primary" @click="save('add')">
          {{ t('reuse.save') }}
        </ElButton>
        <ElButton type="primary" @click="save('saveAndAdd')">
          {{ t('reuse.saveAndAdd') }}
        </ElButton>
        <ElButton @click="cancel">
          {{ t('reuse.cancel') }}
        </ElButton>
      </div>
      <div v-if="props.type === 'detail'">
        <ElButton @click="edit">
          {{ t('reuse.edit') }}
        </ElButton>
        <!-- <ElButton type="danger"  @click="delAction">
                  {{ t('reuse.delete') }}
                </ElButton> -->
      </div>
      <div v-if="props.type === 'edit'">
        <ElButton type="primary" @click="save('edit')">
          {{ t('reuse.save') }}
        </ElButton>
        <!-- <ElButton  @click="cancel">
                  {{ t('reuse.cancel') }}
                </ElButton>
                <ElButton type="danger"  @click="delAction">
                  {{ t('reuse.delete') }}
                </ElButton> -->
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

:deep(.el-dialog__body) {
  max-height: 85vh;
  overflow: auto;
  display: flex;
  justify-content: center;
}

#content {
  height: 200px;
  overflow: auto;
  padding: 0 10px;
}
</style>
