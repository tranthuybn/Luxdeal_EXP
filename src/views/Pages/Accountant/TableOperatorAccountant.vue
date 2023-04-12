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
  ElImage,
  ElDivider,
  ElTreeSelect,
} from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import type { UploadFile } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { API_URL } from '@/utils/API_URL'
import { approvalProducts } from '@/api/Approval'
import { FORM_IMAGES, dateTimeFormat } from '@/utils/format'
import { statusService } from '@/utils/status'
import moment from 'moment'
import { TableResponse } from '@/views/Pages/Components/Type'
import InfinitOptions from '@/components/Select/InfinitOptions.vue'
import { getStaffList, getAllCustomer, getAccountantList, balanceAccount } from '@/api/Business'
import { IStatusHistory, ListImages } from './types'
import { usePermission, printPage, formartDate } from '@/utils/tsxHelper'
import receiptsPaymentPrint from '@/views/Pages/Components/formPrint/src/receiptsPaymentPrint.vue'

const currentUser = (JSON.parse(JSON.parse(localStorage.getItem('STAFF_INFO') || '')?.v)) || {}
const { t } = useI18n()
const doCloseOnClickModal = ref(false)
const { push } = useRouter()
const router = useRouter()
const route = useRoute()
const { currentRoute } = useRouter()
const userPermission = usePermission(currentRoute.value)
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
  hasAttachDocument: {
    type: Boolean,
    default: false,
    description: 'add attach document'
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
    default: 0
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
    descriptions: 'title add button'
  },
  showSaveAndAddBtnOnTypeEdit: {
    type: Boolean,
    default: false
  },
  disabledCancelBtn: {
    type: Boolean,
    default: false
  },
  module: {
    type: Number,
    default: 1,
    descriptions: '1: Receipt and Payment, 2: Balance'
  },
  splitScreen: {
    type: Boolean,
    default: false
  }
})
// eslint-disable-next-line vue/no-setup-props-destructure
const schema = props.schema
const formValue = ref()
const currentDate = ref(moment().format("DD/MM/YYYY"))
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const imageUrl = ref()
const addIcon = useIcon({ icon: 'uil:plus' })
const viewIcon = useIcon({ icon: 'uil:search' })
const deleteIcon = useIcon({ icon: 'uil:trash-alt' })
const deleteFileIds: any = []
const fileList = ref<UploadUserFile[]>([])
const loading = ref(false)
const fullSpan = ref<number>()
const rawUploadFile = ref<UploadFile>()
const optionPeopleType = ref()
const optionCreatedBy = ref(currentUser)
const accountNumberOptions = ref()
const pageIndex = ref(1)
const createdByOptions = ref([{}])
const peopleTypeOptions = ref([{}])
const nameDialog = ref('')
const isDisabled = ref(false)

const emit = defineEmits(['post-data', 'customize-form-data', 'edit-data'])
const { register, methods, elFormRef } = useForm({schema})
const { getFormData, setProps } = methods

//if schema has image then split screen
props.hasImage || props.hasAttachDocument || props.splitScreen ? (fullSpan.value = 12) : (fullSpan.value = 24)

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
      if(props.module == 1) setStatusHistory()
    } else {
      ElNotification({
        message: t('reuse.cantGetData'),
        type: 'warning'
      })
    }
  }
}

//formValue lay tu api
const customizeData = async () => {
  emit('customize-form-data', formValue.value)
}

//set data for form edit and detail
const setFormValue = async () => {
  //neu can xu li du lieu thi emit len component de tu xu li du lieu
  await customizeData()
  const { setValues, setSchema, setProps } = methods
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
  // If an accountNumber in detail balance is assigned in a receiptForm (or paymentForm), disabled some filed
  if(formValue.value.iStatus && props.type == 'edit' && props.module == 2) {
    const arrField = ['typeAccount', 'accountNumber1', 'accountNumber2', 'status']
    const config = arrField.map(item => (
      {
        field: item,
        path: 'componentProps.disabled',
        value: true
      }
    )
    )
    setSchema(config)
  }

  // If a receiptForm (or paymentForm) is approval in detail page, cancel disabled some filed
  if(props.module == 1) {
    if(formValue.value.isApproved && !formValue.value.isCancel) {
      const arrField = ['createdBy', 'description', 'peopleId', 'totalMoney', 'enterMoney' ]
      const config = arrField.map(item => (
        {
          field: item,
          path: 'componentProps.disabled',
          value: true
        }
      ))
      isDisabled.value = true
      setSchema(config)
    } else if(!formValue.value.isApproved || formValue.value.isCancel) {
      setProps({disabled: true})
    }
  }
}

//Get data when click detail or edit button
watch(
  () => props.type,
  async () => {
    const { setProps } = methods
    if (props.type === 'detail' && props.module === 2 || props.type === 'approval') setProps({disabled: true})
    if (props.type === 'detail' || props.type === 'edit' || props.type === 'approval') {
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


//doc du lieu tu bang roi emit len goi API
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
        if(optionCreatedBy.value?.id) {
          data.createdBy = optionCreatedBy.value.name
          data.createdById = optionCreatedBy.value.id
        }
        emit('post-data', data)
        loading.value = false
      }
      if (type == 'saveAndAdd') {
        data.typeBtn = 'saveAndAdd'
        emit('post-data', data)
        unref(elFormRef)!.resetFields()
        loading.value = false
      }
      if (type == 'edit') {
        data.backRouter = true
        data.Id = props.id
        // fix cung theo api (nen theo 1 quy tac)
        data.NewPhotos = fileList.value
        data.DeleteFileIds = deleteFileIds
        data.Imageurl = data.Image ? null : imageUrl.value
        if(props.module == 1) {
          const form = await getFormData()
          if(!form?.paid) {
            ElNotification({
              message: t('reuse.carryingWarnMessage'),
              type: 'warning'
            })
            loading.value = false
            return
          }
          if(!formValue.value.isTransacted) formValue.value.isTransacted = !formValue.value.isTransacted
          setStatusHistory()
        }
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
//set Title
let title = ref(props.title)
if (props.title == 'undefined') {
  title.value = 'Category'
}

const handleRemove = (file: UploadFile) => {
  fileList.value = fileList.value?.filter((image) => image.url !== file.url)
  ListFileUpload.value = ListFileUpload.value?.filter((image) => image.url !== file.url)
  // remove image when edit data
  if (props.formDataCustomize.Images.length > 0) {
    let imageRemove = props.formDataCustomize?.Images.find(
      (image) => `${API_URL}${image.path}` === file.url
    )
    if (imageRemove) {
      deleteFileIds.push(imageRemove?.id)
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

const edit = () => {
  push({
    name: `${String(router.currentRoute.value.name)}`,
    params: {
      backRoute: `${String(router.currentRoute.value.name)}`,
      type: 'edit',
      id: props.id
    }
  })
}

//Image handle
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
const listType = ref<ListImages>('text')
!props.multipleImages ? (listType.value = 'text') : (listType.value = 'picture-card')


onBeforeMount(async () => {
  const accountNumberList = await getAccountantList({})
  accountNumberOptions.value = accountNumberList.data.filter(item => item.isActive)
    .map(item => ({
      label: `${item.accountNumber} | ${item.accountName}`,
      value: item.id,
      children: item.children.length > 0 ? 
        item.children.map(item => ({label: `${item.accountNumber} | ${item.accountName}`, value: item.id})) : []
    }))
})

const handleChangeOptions = (option,form, formType) => {
  switch (formType) {
    case 'createdBy' :
      optionCreatedBy.value = option
      form.createdBy = Number(option.id)
      return
    case 'peopleId' : 
      optionPeopleType.value = option
      form.peopleId = Number(option.id)
      return
    default: return ''
  }
}

const approvalId = String(route.query.approvalId)
const approvalProduct = async (val) => {
  const payload = { ItemType: 5, Id: parseInt(approvalId), IsApprove: val }
  await approvalProducts(FORM_IMAGES(payload))
    .then(() => {
      ElNotification({
        message: val ? t('reuse.approveSuccess') : t('reuse.cancelApproveSuccess'),
        type: 'success'
      })
      push({
        name: `approve.payment-approval.receipts-and-expenditures`
      })
    })
    .catch(() =>
      ElNotification({
        message: t('reuse.approveFail'),
        type: 'warning'
      })
    )
}

const handleAccounting = async () => {
  const form = await getFormData()
  if(!form?.paid) {
    ElNotification({
      message: t('reuse.accountingWarnMessage'),
      type: 'warning'
    })
    return
  }
  await save('edit')
  const payload = {
    AccountId: formValue.value.accountNumber,
    ReceiptId: formValue.value.id,
    User: formValue.value.createdBy,
    IsActive: true,
    Status: 3
  }
  await balanceAccount(payload)
  .then(() => {
      ElNotification({
        message: t('reuse.accountingSuccess'),
        type: 'success'
      })
      setProps({disabled: true})
      formValue.value.isAccounted = !formValue.value.isAccounted
      if(!formValue.value.isTransacted) formValue.value.isTransacted = !formValue.value.isTransacted
      setStatusHistory()
    })
  .catch(() =>
    ElNotification({
      message: t('reuse.accountingFail') ,
      type: 'error'
    })
  )
}
const cancelAccounting = async () => {
  const payload = {
    AccountId: formValue.value.accountNumber,
    ReceiptId: formValue.value.id,
    User: formValue.value.createdBy,
    IsActive: false,
    Status: 1
  }

  await balanceAccount(payload)
  .then(() => {
      ElNotification({
        message: t('reuse.cancelAccountingSuccess'),
        type: 'success'
      })
      setProps({disabled: false})
      formValue.value.isAccounted = !formValue.value.isAccounted
      formValue.value.isTransacted = !formValue.value.isTransacted
      setStatusHistory()
    })
  .catch(() =>
    ElNotification({
      message: t('reuse.cancelAccountingFail') ,
      type: 'error'
    })
  )
}

const PrintReceipts = ref(false)
// form phiếu thu
const formReceipts = ref()

const getFormReceipts = () => {
  if (formValue.value.enterMoney) {
    formReceipts.value = {
      codeReceipts: formValue.value.code,
      moneyReceipts: formValue.value.totalMoney,
      reasonCollectingMoney: formValue.value.description,
      enterMoney: formValue.value.enterMoney,
      payment: formValue.value.typeOfPayment == 1 ? t('reuse.cashPayment') : t('reuse.cardPayment')
    }
    nameDialog.value = formValue.value.type == 1 ? t('reuse.receiptForm') : t('reuse.paymentForm')

    PrintReceipts.value = !PrintReceipts.value
  } else {
    ElMessage({
      showClose: true,
      message: 'Vui lòng nhập tiền bằng chữ',
      type: 'error'
    })
  }
}

const setStatusHistory = () => {
  const newStatus = [
    {
      statusName: t('reuse.initializeAndWrite'),
      statusValue: 0, 
      approvedAt: formartDate(formValue.value?.createdAt),
      isActive: true
    }, 
    {
      statusName: formValue.value?.type == 1 ? t('reuse.checkReceipts') : t('reuse.approvalPayment'),
      statusValue: 1, 
      approvedAt: formartDate(formValue.value?.approvedAt),
      isActive: formValue.value?.isApproved || !formValue.value?.isCancel
    }, 
    {
      statusName: formValue.value?.type == 1 ? t('reuse.collectedMoney') : t('formDemo.paidMoney'),
      statusValue: 2, 
      approvedAt: formartDate(formValue.value?.transactedAt) || currentDate.value,
      isActive: formValue.value?.isTransacted ,
    }, 
    {
      statusName: t('reuse.planned'),
      statusValue: 3, 
      approvedAt: formartDate(formValue.value?.accountedAt) || currentDate.value,
      isActive: formValue.value?.isAccounted,
    }, 
    {
      statusName: t('button.cancel'),
      statusValue: 4, 
      approvedAt: formartDate(formValue.value?.cancelAt),
      isActive: formValue.value?.isCancel ,
    },
  ]
  if(statusHistory.length > 0) statusHistory.splice(0, statusHistory.length)
  statusHistory.push(...newStatus)
}

const getMapData = ({code, phonenumber,name, id, email}) => ({label: `${name} | ${phonenumber}`, code, value: phonenumber, name, id, email  })
</script>
<template>
  <ContentWrap :title="title" :back-button="backButton">
     <div id="recpPaymentPrint">
        <slot>
          <receiptsPaymentPrint
            v-if="formReceipts"
            :dataEdit="formReceipts"
            :nameDialog="nameDialog"
          />
        </slot>
      </div>

    <!-- Dialog In phiếu thu chi -->
      <el-dialog :close-on-click-modal="doCloseOnClickModal" v-model="PrintReceipts" class="font-bold" width="40%" align-center >
        <div class="section-bill">
          <div class="flex gap-3 justify-end">
            <el-button @click="printPage('recpPaymentPrint')">{{ t('button.print') }}</el-button>

            <el-button class="btn" @click="PrintReceipts = false">{{ t('reuse.exit') }}</el-button>
          </div>
          <div class="dialog-content">
            <slot>
              <receiptsPaymentPrint
                v-if="formReceipts"
                :dataEdit="formReceipts"
                :nameDialog="nameDialog"
              />
            </slot>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button class="btn" @click="PrintReceipts = false">{{ t('reuse.exit') }}</el-button>
          </span>
        </template>
      </el-dialog>

    <ElRow class="pl-8" :gutter="20" justify="space-between">
      <ElCol :span="fullSpan">
        <Form :rules="rules" @register="register" >
          <template #statusHistory>
              <div class="mr-5 flex flex-col justify-start gap-2" v-if="type=='add'">
                <div>
                  <span
                      class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-black dark:bg-transparent"
                    ></span>
                    <span class="box status--initial dark:text-divck" >
                      {{ t('reuse.initializeAndWrite') }}
                      <span class="triangle-right"></span>
                    </span>
                </div>
                <div class="italic text-xs text-gray-500">{{ currentDate }}</div>
              </div>
              <div v-else class="flex items-start shrink-0" >
                <div          
                    class="duplicate-status align-top"
                    v-for="(item, index) in statusHistory"
                    :key="index"
                >
                  <div v-if="item.isActive" class="mr-5 flex flex-col justify-start gap-2 ">
                      <div>
                        <span
                          class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-black dark:bg-transparent"
                        ></span>
                        <span class="box dark:text-divck" :class="statusService(item.statusValue)" >
                          {{item.statusName }}    
                          <span class="triangle-right"></span>
                        </span>
                      </div>
                      <div class="italic text-xs text-gray-500">{{dateTimeFormat(item.approvedAt)}}</div>
                  </div>
                </div>
              </div>
          </template>
          
          <template #createdBy="form">
            <InfinitOptions 
              :fields="[t('reuse.employeeCode'),t('reuse.phoneNumber'),t('reuse.employeeName')]"
              min-width="500px"
              valueKey="id" 
              labelKey="label"
              :hiddenKey="['id', 'label', 'email']"
              :clearable="false"
              :items="createdByOptions"
              :disabled="isDisabled"
              :pageIndex="pageIndex"
              :api="getStaffList"
              :mapFunction="getMapData"
              :defaultValue="form.createdBy"
              @update-value="(_value, option) => handleChangeOptions(option, form, 'createdBy')"
            />
          </template>

          <template #accountNumber="form">
            <el-tree-select
              v-model="form.accountNumber"
              :data="accountNumberOptions"
              check-strictly
              :render-after-expand="false"
              show-checkbox
            />
          </template>

          <template #peopleId="form">
            <InfinitOptions 
              :fields="[t('reuse.customerCode'),t('reuse.phoneNumber'),t('reuse.customerName')]"
              min-width="500px"
              valueKey="id" 
              labelKey="label"
              :hiddenKey="['id', 'email', 'label']"
              :clearable="false"
              :placeHolder="t('reuse.selectObject')"
              :items="peopleTypeOptions"
              :disabled="isDisabled"
              :pageIndex="pageIndex"
              :api="getAllCustomer"
              :mapFunction="getMapData"
              :defaultValue="form.peopleId"
              @update-value="(_value, option) => handleChangeOptions(option, form, 'peopleId')"
            />
            <ul class="mt-2">
              <li v-if="optionPeopleType?.name" class="leading-5">{{ optionPeopleType.name }}</li>
              <li v-if="optionPeopleType?.value" class="leading-5">{{ t('reuse.phoneNumber') }}: {{ optionPeopleType.value }}</li>
              <li v-if="optionPeopleType?.email" class="leading-5">{{ t('reuse.email') }}: {{ optionPeopleType.email }}</li>
            </ul>
          </template>
        </Form>
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
      <ElCol :span="hasAttachDocument ? 12 : 0" v-if="hasAttachDocument" class="max-h-400px overflow-y-auto">
        <ElDivider content-position="left" class="text-center font-bold ml-2">{{ t('reuse.attachDocument') }}</ElDivider>
      </ElCol>
    </ElRow>
    <template #under>
      <div class="w-[100%]" v-if="props.type === 'add'">
        <div class="w-[50%] flex justify-left gap-2 ml-8">
          <div v-if="module == 2">
            <ElButton type="primary" :loading="loading" @click="save('add')">
              {{ t('reuse.save') }}
            </ElButton>
            <ElButton type="primary" :loading="loading" @click="save('saveAndAdd')">
              {{ t('reuse.saveAndAdd') }}
            </ElButton>
          </div>
          <div v-if="module == 1">
            <ElButton :loading="loading">
              {{ t('button.print') }}
            </ElButton>
            <ElButton type="primary" :loading="loading" @click="save('add')">
              {{ t('reuse.saveAndPending') }}
            </ElButton>
          </div>
          <ElButton :type="module == 1 ? 'danger' : '' " :loading="loading" @click="cancel()">
              {{ t('reuse.cancel') }}
          </ElButton>
        </div>
      </div>
      <div class="w-[100%]" v-if="props.type === 'edit'">
        <div v-if="module == 2" class="w-[50%] flex justify-left gap-2 ml-8">
          <ElButton type="primary" :loading="loading" @click="save('edit')">
            {{ t('reuse.save') }}
          </ElButton>
          <ElButton :loading="loading" @click="cancel()">
            {{ t('reuse.cancel') }}
          </ElButton>  
        </div>
      </div>
      <div class="w-[100%]" v-if="props.type === 'detail'">
        <div class="flex justify-left gap-2 ml-5">
          <div v-if="module == 2">
            <ElButton class="pl-8 pr-8" :loading="loading" @click="edit">
              {{ t('reuse.fix') }}
            </ElButton>
            <ElButton :disabled="disabledCancelBtn" class="pl-8 pr-8" type="danger" :loading="loading" @click="delAction">
              {{ t('reuse.delete') }}
            </ElButton>
          </div>
          <div v-if="module == 1 && !formValue?.isCancel" >
             <ElButton v-if="formValue?.isApproved" class="pl-8 pr-8" @click="getFormReceipts" :loading="loading">
                {{ t('button.print') }}
              </ElButton>
              <ElButton v-if="!formValue?.isAccounted  && formValue?.isApproved" @click="save('edit')" class="pl-8 pr-8" :loading="loading">
                {{ t('button.carrying') }}
              </ElButton>
              <ElButton v-if="!formValue?.isAccounted  && formValue?.isApproved" type="primary" @click="handleAccounting" class="pl-8 pr-8" :loading="loading">
                {{ t('reuse.accounting') }}
              </ElButton>
              <ElButton v-if="formValue?.isAccounted  && formValue?.isApproved" type="primary" @click="cancelAccounting" class="pl-8 pr-8" :loading="loading">
                {{ t('reuse.cancelAccounting') }}
              </ElButton>
             <ElButton v-if="userPermission?.deletable && !formValue?.isAccounted " class="pl-8 pr-8" type="danger" :loading="loading" @click="delAction">
              {{ t('reuse.cancel') }}
             </ElButton>
          </div>
        </div>
      </div>
      <div class="pl-57" v-if="props.type === 'approval'">
        <el-button @click="approvalProduct(true)" class="min-w-[120px]" type="warning">{{ t('router.approve') }}</el-button>
        <el-button  @click="approvalProduct(false)" class="min-w-[120px]">{{ t('router.notApproval') }}</el-button>
      </div>
    </template>
  </ContentWrap>
</template>
<style lang="scss" scoped>
.avatar-uploader{
  .avatar {
    display: block;
    width: 250px;
    padding-bottom: 1rem;
  }
  .el-upload {
    position: relative;
    margin-left: 2rem;
    overflow: hidden;
    cursor: pointer;
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    transition: var(--el-transition-duration-fast);
  }
  &:deep(.el-upload) {
    display: flex;
  }
  .el-upload:hover {
    border-color: var(--el-color-primary);
  }
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
.triangle-left {
  position: absolute;
  z-index: 100;
  width: 0;
  height: 0;
}

.triangle-right {
  position: absolute;
  right: -12px;
  width: 0;
  height: 0;
  border-top: 13px solid transparent;
  border-bottom: 12px solid transparent;
  border-left: 11px solid #ccc;
}
.box {
  position: relative;
  display: flex;
  width: fit-content;
  padding: 0 10px 0 20px;
  background-color: #ccc;
  border: 1px solid #ccc;
  opacity: 1;
  align-items: center;
  line-height: 23px;
}
::v-deep(.readonly-info) {
  .el-input__wrapper{
    box-shadow: none;
    padding: 0
  }
}

.shrink-0{
  flex-shrink: 0;
}

@media screen {
  #recpPaymentPrint {
    display: none;
  }
}

.status--approval {
  color: rgb(234 179 8); 
  background-color: #fff0d9;
  border: 1px solid #fff0d9;
  .triangle-right{
    border-left: 11px solid #fff0d9 !important;
  }
}

.status--transacted, .status--accounted {
  color: rgb(59 130 246);
  background-color: #f4f8fd;
  border: 1px solid #f4f8fd;
  .triangle-right{
    border-left: 11px solid #f4f8fd !important;
  }
}

.status--cancel{
  color: rgb(238, 48, 15); 
  background-color: #fce5e1;
  border: 1px solid #fce5e1;
  .triangle-right{
    border-left: 11px solid #fce5e1 !important;
  }
}

</style>
