<script setup lang="ts">
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, watch, ref, unref, onBeforeMount, reactive } from 'vue'
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
  ElDivider,
  ElForm,
  ElFormItem,
} from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import type { UploadFile } from 'element-plus'
import { TableResponse } from '@/views/Pages/Components/Type'
import { useRoute, useRouter } from 'vue-router'
import { API_URL } from '@/utils/API_URL'
import { approvalProducts } from '@/api/Approval'
import { FORM_IMAGES, dateTimeFormat } from '@/utils/format'
import moment from 'moment'
import { renderStatus } from '@/utils/status'


const { t } = useI18n()
const dialogImageUrl = ref()
const route = useRoute()
const loading = ref(false)
const tabs = ref()
const formValue = ref()
const addIcon = useIcon({ icon: 'uil:plus' })
const fileList = ref<UploadUserFile[]>([])
const { push } = useRouter()
const router = useRouter()
const currentDate = ref(moment().format("DD/MM/YYYY"))
const statusHistory = reactive<Array<IStatusHistory>>([])
const props = defineProps({
  // api lấy dữ liệu sản phẩm
  apiId: {
    type: Function as PropType<any>,
    default: null
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
  },
  showSaveAndAddBtnOnTypeEdit: {
    type: Boolean,
    default: false
  },
  disabledCancelBtn: {
    type: Boolean,
    default: false
  },
  customerObj: {
    type: Object,
    default: () => {},
    descriptions: 'Detail customerObj'
  },
  model: {
    type: Number,
    default: 1
  }
})
const emit = defineEmits(['post-data', 'customize-form-data', 'edit-data'])
interface IStatusHistory {
  statusName: string
  statusValue: number
  approveAt: string
  isActive: boolean
}
//get data from table
const getTableValue = async () => {
  if(props.apiId == null){
    return
  }
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

//formValue lay tu api
const customizeData = async () => {
  emit('customize-form-data', formValue.value)
}
// const dialogImageUrl = ref('')
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
      const { setProps } = methods
      setProps({
        disabled: true
      })
    }
    if (props.type === 'detail' || props.type === 'edit' || props.type === 'approval-collab') {
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
        if (props.showSaveAndAddBtnOnTypeEdit) {
          emit('post-data', {data, typeBtn: 'saveAndAdd'})
        } else {
          emit('post-data', data)
        }
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
        data.Images = data.imageurl ?? imageUrl.value
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

//validate Ảnh
const validImageType = ['jpeg', 'png', 'pdf', 'vnd.openxmlformats-officedocument.wordprocessingml.document']
const beforeAvatarUpload = async (rawFile, type: string) => {
  if (rawFile) {
      if (rawFile.raw && !validImageType.includes(rawFile.raw['type'].split('/')[1])) {
        ElMessage.error(t('reuse.onlyAcceptValidImageType'))
        return false
      } else if (rawFile.raw?.size / 1024 / 1024 > 4) {
        ElMessage.error(t('reuse.imageOver4MB'))
        return false
      } else if (rawFile.name?.split('.')[0].length > 100) {
        ElMessage.error(t('reuse.checkNameImageLength'))
        return false
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
        props.delApi({ Id: props.id }).then(res => {
          if (res?.statusCode === 200) {
            ElNotification({
              message: res.data.message ?? t('reuse.deleteSuccess'),
              type: 'success'
            }),
              router.go(-1)
          } else {
            ElNotification({
              message: res.data.message ?? t('reuse.deleteFail'),
              type: 'warning'
            })
          }
        }
        ).catch(err => { 
          console.error(err);
          ElNotification({
              message: err.response.data.message ?? t('reuse.deleteFail'),
              type: 'error'
            })
        })       
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
const handleChange: UploadProps['onChange'] = async (_uploadFile, uploadFiles) => {
  ListFileUpload.value = uploadFiles
  // uploadFiles.map(async (file) => {
  //   ;(await beforeAvatarUpload(file, 'list')) ? '' : file.raw ? handleRemove(file) : ''
  // })
  const lastItem = uploadFiles.at(-1)
  if(lastItem) {
    ;(await beforeAvatarUpload(lastItem, 'list')) ? '' : lastItem.raw ? handleRemove(lastItem) : ''
  }
}

onBeforeMount(() => {
  tabs.value = String(route.params.tab)
  if(props.type === 'add' || props.type === ':type') {
    statusHistory.push({
      statusName: t('reuse.newInitialization'),
      statusValue: 1,
      isActive: true,
      approveAt: currentDate.value
    })
  }
})

const approvalId = String(route.params.approvalId)
const approvalProduct = async () => {
  const payload = { ItemType: 4, Id: parseInt(approvalId), IsApprove: true }
  await approvalProducts(FORM_IMAGES(payload))
    .then(() => {
      ElNotification({
        message: 'Duyệt thành công',
        type: 'success'
      })
      push({
        name: `approve.accounts-approval.collaborator-account`
      })
    })
    .catch(() =>
      ElNotification({
        message: 'Duyệt thất bại',
        type: 'warning'
      })
    )
}
let FileDeleteIds: any = []
const beforeRemove : any = (uploadFile) => {
  return ElMessageBox.confirm(`Cancel the transfert of ${uploadFile.name} ?`, {
    confirmButtonText: 'OK',
    cancelButtonText: 'Hủy',
    type: 'warning',
    draggable: true
  })
    .then(() => {
      ElMessage({
        type: 'success',
        message: 'Delete completed'
      })
      let imageRemove = uploadFile.id
      FileDeleteIds.push(imageRemove)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled'
      })
    })
}
const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}
</script>
<template>
  <ContentWrap :title="props.title" :back-button="props.backButton">
    <ElRow class="pl-8" :gutter="20" justify="space-between">
      <ElCol :span="fullSpan">
        <Form :rules="rules" @register="register">
        <template #customerDetail>
          <ElForm :model="customerObj" label-width="146px">
              <ElFormItem :label="t('formDemo.customerName')" prop="name" v-if="customerObj.name">
                {{ customerObj.name }}
              </ElFormItem>
              <ElFormItem :label="t('formDemo.taxCode')" v-if="customerObj.taxCode">
                {{ customerObj.taxCode }}
              </ElFormItem>
              <ElFormItem :label="t('formDemo.represent')" v-if="customerObj.representative">
                {{ customerObj.representative }}
              </ElFormItem>
              <ElRow :gutter="10">
                <ElCol :span="10">
                  <ElFormItem
                    :label="t('reuse.phoneNumber')"
                    v-if="customerObj.phonenumber"
                  >
                    {{ customerObj.phonenumber }}
                  </ElFormItem>
                </ElCol>
                <ElCol :span="8">
                  <ElFormItem
                    label-width="auto"
                    :label="`${t('reuse.email')}:`"
                    v-if="customerObj.email"
                  >
                    {{ customerObj.email }}
                  </ElFormItem>
                </ElCol>
              </ElRow>
              <ElRow :gutter="10">
                <ElCol :span="10">
                  <ElFormItem
                    :label="t('reuse.citizenIdentificationNumber')"
                    v-if="customerObj.cccd"
                  >
                    {{ customerObj.cccd }}
                  </ElFormItem>
                </ElCol>
                <ElCol :span="7">
                  <ElFormItem
                    label-width="auto"
                    :label="`${t('formDemo.supplyDate')}:`"
                    v-if="customerObj.cccdCreateAt"
                  >
                    {{ dateTimeFormat(customerObj.cccdCreateAt) }}
                  </ElFormItem>
                </ElCol>
                <ElCol :span="7">
                  <ElFormItem
                    label-width="auto"
                    :label="`${t('formDemo.supplyAddress')}:`"
                    v-if="customerObj.cccdPlaceOfGrant"
                  >
                    <span class="leading-5">{{ customerObj.cccdPlaceOfGrant }}</span>
                  </ElFormItem>
                </ElCol>
              </ElRow>
              <ElFormItem
                :label="t('reuse.dateOfBirth')"
                v-if="customerObj.doB"
              >
                {{ dateTimeFormat(customerObj.doB) }}
              </ElFormItem>
              <ElFormItem
                :label="t('reuse.gender')"
                v-if="customerObj.sex"
              >
                {{ customerObj.sex ? t('reuse.male') : t('reuse.female') }}
              </ElFormItem>
              <ElFormItem :label="t('formDemo.address')" v-if="customerObj.address">
                {{ customerObj.address }}
              </ElFormItem>
              <ElFormItem
                class="leading-5"
                :label="t('reuse.accountBank')"
                v-if="customerObj.bankId"
              >
                <ul class="leading-7">
                  <li>{{ customerObj.accountName }}</li>
                  <li>{{ customerObj.accountNumber }}</li>
                  <li>{{ customerObj.bankName }}</li>
                </ul>
              </ElFormItem>
            </ElForm>
        </template>
        <template #status>
          <div          
            v-for="(item, index) in statusHistory"
            :key="index"
           >
            <div class="mr-5 flex flex-col justify-start gap-2 ">
                <div>
                  <span
                    class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-black dark:bg-transparent"
                  ></span>
                  <span class="box dark:text-divck" :class="[renderStatus(item.statusValue), {'active': index == statusHistory.length - 1}]" >
                    {{item.statusName }}    
                    <span class="right"></span>
                  </span>
                </div>
                <div class="italic text-xs text-gray-500">{{dateTimeFormat(item.approveAt)}}</div>
            </div>
          </div>
        </template>
        </Form>
      </ElCol>
      <ElCol :span="hasImage ? 12 : 0" v-if="hasImage" class="max-h-400px overflow-y-auto">
        <ElDivider content-position="left" class="font-bold ml-2">{{ t('formDemo.attachments') }}</ElDivider>
       <div class="flex">
        <div class="pr-4">
          <div class="text-right">{{ t('formDemo.addPhotosOrFiles') }}</div>
          <div class="text-right text-[#FECB80] italic">{{ t('formDemo.lessThanTenProfiles') }}</div>
        </div>
        <div>
          <el-upload
            ref="upload"
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            :disabled="props.type === 'detail'"
            :auto-upload="false"
            list-type="picture"
            v-model:file-list="fileList"
            :limit="10"
            :on-change="handleChange"
            :multiple="true"
            :before-remove="beforeRemove"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
           <ElButton :icon="addIcon">{{ t('formDemo.addPhotosOrFiles') }}</ElButton>
          </el-upload>
          <el-dialog v-model="dialogVisible">
             <img h-full :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
        </div>
       </div>
      </ElCol>
    </ElRow>
    <template #under v-if="!removeButton">
      <div class="w-[100%]" v-if="type === 'add'">
        <div class="w-[50%] flex justify-left gap-2 ml-8">
          <ElButton type="primary" :loading="loading" @click="save('add')">
            {{ model === 1 ?  t('reuse.saveAndPending') : t('reuse.saveAndComfirm')}}
          </ElButton>
          <ElButton v-if="model === 2" type="primary" :loading="loading">
            {{ t('reuse.paidAndFinish')}}
          </ElButton>
          <ElButton type="danger" :loading="loading" @click="cancel()">
            {{ model === 1 ? t('formDemo.cancelAccount') : t('formDemo.cancelRequest') }}
          </ElButton>
        </div>
      </div>
      <div class="w-[100%]" v-if="type === 'edit'">
        <div class="w-[50%] flex justify-left gap-2 ml-5">
          <ElButton :loading="loading" type="primary" @click="save('edit')">
            {{ t('reuse.save') }}
          </ElButton>
          <ElButton v-if="showSaveAndAddBtnOnTypeEdit" :loading="loading" type="primary" @click="save('saveAndAdd')">
            {{ t('reuse.saveAndAdd') }}
          </ElButton>
          <ElButton :loading="loading" @click="cancel">
            {{ t('reuse.cancel') }}
          </ElButton>
        </div>
      </div>
      <div class="w-[100%]" v-if="type === 'detail'">
        <div v-if="model === 1 && formValue.isApp" class="w-[50%] flex justify-left gap-2 ml-5">
          <ElButton class="pl-8 pr-8" :loading="loading" @click="edit">
            {{ t('reuse.fix') }}
          </ElButton>
          <ElButton class="pl-8 pr-8" type="danger" :loading="loading" @click="delAction">
            {{ model === 1 ? t('formDemo.cancelAccount') : t('formDemo.cancelRequest') }}
          </ElButton>
        </div>
      </div>
      <div class="pl-57" v-if="type === 'approval-collab'">
        <el-button @click="approvalProduct" class="min-w-[120px]" type="warning">{{ t('router.approve') }}</el-button>
        <el-button class="min-w-[120px]">{{ t('router.notApproval') }}</el-button>
      </div>
    </template>
  </ContentWrap>
</template>
<style lang="scss" scoped>
@import '@/styles/statusHistory.scss' ;

:deep(.el-dialog__body) {
  display: flex;
  overflow: auto;
  justify-content: center;
}

:deep(.el-button) {
  min-width: 150px;
  min-height: 40px;
}

::v-deep(.el-upload--picture-card) {
  background-color: unset;
  border: unset;
  align-items: flex-start;
  button {
    font-size: 13px;
  }
}

::v-deep(.readonly-info) {
  .el-input__wrapper{
    box-shadow: none;
    padding: 0
  }
}
.box{ 
    line-height: 23px !important; 
 }
</style>
