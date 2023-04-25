<script setup lang="ts">
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, watch, ref, unref, reactive } from 'vue'
import { TableData } from '@/api/table/types'
import {
  ElRow,
  ElCol,
  ElButton,
  ElDialog,
  UploadUserFile,
  ElMessage,
  ElMessageBox,
  ElNotification,
  ElDivider
} from 'element-plus'

import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import type { UploadFile } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { approvalProducts } from '@/api/Approval'
import { FORM_IMAGES } from '@/utils/format'
import { statusService } from '@/utils/status'
import moment from 'moment'
import { TableResponse } from '@/views/Pages/Components/Type'
import InfinitOptions from '@/components/Select/InfinitOptions.vue'
import { getStaffList, getAllCustomer, getAccountantList, balanceAccount, getCustomerById } from '@/api/Business'
import { IStatusHistory, ListImages } from './types'
import { usePermission, printPage, formartDate } from '@/utils/tsxHelper'
import receiptsPaymentPrint from '@/views/Pages/Components/formPrint/src/receiptsPaymentPrint.vue'
import DocumentUpload from '@/views/Pages/Components/DocumentUpload.vue'

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
const fileUploadList = ref()
const currentDate = ref(moment().format("DD/MM/YYYY"))
const deleteFileIds = ref()
const loading = ref(false)
const fullSpan = ref<number>()
const fullSpanAttachDocument = ref(false)
const rawUploadFile = ref<UploadFile>()
const optionPeopleType = ref()
const optionCreatedBy = ref(currentUser)
const pageIndex = ref(1)
const createdByOptions = ref([{}])
const nameDialog = ref('')
const disabledForm = ref(false)
const isDisabled = ref(false)
const listFileUpload = ref<UploadUserFile[]>([])
const emit = defineEmits(['post-data', 'customize-form-data', 'edit-data'])
const { register, methods, elFormRef } = useForm({schema})
const { getFormData, setProps } = methods

//if schema has image then split screen
props.hasAttachDocument || props.splitScreen ? (fullSpan.value = 12) : (fullSpan.value = 24)

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
      const arrField = ['createdId', 'description', 'peopleId', 'totalMoney', 'enterMoney' ]
      const config = arrField.map(item => (
        {
          field: item,
          path: 'componentProps.disabled',
          value: true
        }
      ))
      isDisabled.value = true
      setSchema(config)
    } else if(!formValue.value.isApproved || formValue.value.isCancel || formValue.value.isAccounted) {
      setProps({disabled: true})

    }
    await getCustomerById({Id: formValue.value.peopleId})
    .then(res => optionPeopleType.value = {
      label: `${res.data.name} | ${res.data.phonenumber}`,
      code: res.data.code,
      value: res.data.phonenumber,
      name: res.data.name,
      id: res.data.id,
      email: res.data.email
    })
    .catch(error => {throw new Error(error)})
    fullSpanAttachDocument.value = !!formValue.value.orderCode

    if(formValue.value?.documents && formValue.value?.documents?.length > 0) {
     fileUploadList.value = formValue.value.documents.map(item => item)
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
    disabledForm.value = props.type === 'approval' || props.type === 'detail'
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
    if (isValid) {
      loading.value = true
      const { getFormData } = methods
      let data = (await getFormData()) as TableData
      props.multipleImages
        ? (data.Images = listFileUpload.value
            ? listFileUpload.value?.map((file) => (file.raw ? file.raw : null))
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
        data.DeleteFileIds = deleteFileIds.value
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

const listType = ref<ListImages>('text')
!props.multipleImages ? (listType.value = 'text') : (listType.value = 'picture-card')

const handleChangeOptions = (option,form, formType) => {
  switch (formType) {
    case 'createdId' :
      optionCreatedBy.value = option
      form.createdId = Number(option.id)
      return
    case 'peopleId' : 
      optionPeopleType.value = option
      form.peopleId = Number(option.id)
      return
    case 'accountNumber' : 
      form.accountNumber = Number(option.value)
      return
    default: return ''
  }
}

const approvalId = String(route.params.approvalId)
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
const getMapAccountNumberData = ({accountNumber, accountName, id , children}) => ({
  label: `${accountNumber} | ${accountName}`,
  value: id,
  children: children.length > 0 ? 
    children.map(item => ({label: `${item.accountNumber} | ${item.accountName}`, value: item.id})) : []
})
const handleDocumentUpload = (listFile, delFileIds) => {
  listFileUpload.value = listFile
  deleteFileIds.value = delFileIds
}

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
                      <div class="italic text-xs text-gray-500">{{item.approvedAt}}</div>
                  </div>
                </div>
              </div>
          </template>
          
          <template #createdId="form">
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
              :defaultValue="form.createdId"
              @update-value="(_value, option) => handleChangeOptions(option, form, 'createdId')"
            />
          </template>

          <template #accountNumber="form">
            <InfinitOptions 
              min-width="500px"
              valueKey="value" 
              labelKey="label"
              :hiddenKey="['value', 'label']"
              :clearable="false"
              :pageIndex="pageIndex"
              :isTreeSelect="true"
              :api="getAccountantList"
              :mapFunction="getMapAccountNumberData"
              :defaultValue="form.accountNumber"
              @check-change="(option) => handleChangeOptions(option, form, 'accountNumber')"
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
      <ElCol :span="hasAttachDocument ? 12 : 0" v-if="hasAttachDocument">
        <ElDivider content-position="left" class="text-center font-bold ml-2 fixed top-0">{{ t('reuse.attachDocument') }}</ElDivider>
        <ElRow>
          <ElCol :span="fullSpanAttachDocument ? 12 : 24">
            <DocumentUpload :disabledButton="disabledForm" :imageRequired="imageRequired" :type="type" :fileUploadList="fileUploadList" @update-value="handleDocumentUpload"/>
          </ElCol>
          <ElCol :span=12>
            <div v-if="fullSpanAttachDocument">
                <span>{{ `${t('reuse.orderCode')}: ` }}</span>
                <span class="font-bold">{{formValue.orderCode}}</span>
            </div>
          </ElCol>
        </ElRow>
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
