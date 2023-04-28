<script setup lang="ts">
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, watch, ref, unref, onBeforeMount, reactive } from 'vue'
import { TableData } from '@/api/table/types'
import {
  ElRow,
  ElCol,
  ElButton,
  UploadUserFile,
  ElMessage,
  ElMessageBox,
  ElNotification,
  ElDivider,
  ElForm,
  ElFormItem,
} from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { TableResponse } from '@/views/Pages/Components/Type'
import { useRoute, useRouter } from 'vue-router'
import { approvalProducts } from '@/api/Approval'
import { FORM_IMAGES, dateTimeFormat } from '@/utils/format'
import moment from 'moment'
import { renderStatus } from '@/utils/status'
import DocumentUpload from '@/views/Pages/Components/DocumentUpload.vue'

const { t } = useI18n()
const route = useRoute()
const loading = ref(false)
const tabs = ref()
const formValue = ref()
const { push } = useRouter()
const router = useRouter()
const currentDate = ref(moment().format("DD/MM/YYYY"))
const statusHistory = reactive<Array<IStatusHistory>>([])
const deleteFileIds = ref()
const listFileUpload = ref<UploadUserFile[]>([])
const disabledForm = ref(false)
const fileUploadList = ref()
const isApproved = ref(false)
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

const imageUrl = ref()
//set data for form edit and detail
const setFormValue = async () => {
  //neu can xu li du lieu thi emit len component de tu xu li du lieu
  await customizeData()
  const { setValues } = methods
  if (props.formDataCustomize) {
    setValues(props.formDataCustomize)
  } else {
    setValues(formValue.value)
  }
  const dataStatus = formValue.value?.statusHistory.map((item, index) => ({
    statusName: item.name,
    statusValue: index + 1,
    approveAt: dateTimeFormat(item.approveAt),
  }))
  statusHistory.push(...dataStatus)
  if(formValue.value?.collaboratorFiles && formValue.value?.collaboratorFiles?.length > 0) {
    fileUploadList.value = formValue.value.collaboratorFiles.map(item => (item?.file))
  }
  isApproved.value = formValue.value.status !== 0
}

//Lấy dữ liệu từ bảng khi ấn nút detail hoặc edit
watch(
  () => props.type,
  () => {
    if (props.type === 'detail' || props.type === 'approval-collab') {
      disabledForm.value = true
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
    if (isValid) {
      loading.value = true
      const { getFormData } = methods
      let data = (await getFormData()) as TableData
      data.Images = listFileUpload.value.length > 0 ? listFileUpload.value?.map((file) => (file.raw || null)) : []
      //callback cho hàm emit
      if (type == 'add') {
        data.backRouter = true
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
        data.Images = data.imageurl ?? imageUrl.value
        emit('edit-data', data)
        loading.value = false
      }
      imageUrl.value = undefined
    } else {
      ElMessage.error(t('reuse.notFillAllInformation'))
    }
  })
}

//if schema has image then split screen
let fullSpan = ref<number>()
props.hasImage ? (fullSpan.value = 12) : (fullSpan.value = 24)
//set Title
let title = ref(props.title)
if (props.title == 'undefined') {
  title.value = 'Category'
}

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
const delAction = () => {
  {
    ElMessageBox.confirm(`${t('reuse.deleteWarning')}`, props.deleteTitle, {
      confirmButtonText: t('reuse.delete'),
      cancelButtonText: t('reuse.exit'),
      type: 'warning',
      confirmButtonClass: 'ElButton--danger'
    })
      .then(async () => {
        await props.delApi({ Id: props.id })
        .then(res => {
          ElNotification({
              message: res.data.message ?? t('reuse.requestDeleteAccountSuccess'),
              type: 'success'
          }),
          router.go(-1)
        })
        .catch(err => { 
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

onBeforeMount(() => {
  tabs.value = String(route.params.tab)
  if(props.type === 'add' || props.type === ':type') {
    statusHistory.push({
      statusName: t('reuse.newInitialization'),
      statusValue: 1,
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

const handleDocumentUpload = (listFile, delFileIds) => {
  listFileUpload.value = listFile
  deleteFileIds.value = delFileIds
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
                <div class="flex gap-8">
                  <div class="w-56">
                    <ElFormItem
                      :label="t('reuse.phoneNumber')"
                      v-if="customerObj.phonenumber"
                    >
                      {{ customerObj.phonenumber }}
                  </ElFormItem>
                  </div>
                  <ElFormItem
                      label-width="auto"
                      :label="`${t('reuse.email')}:`"
                      v-if="customerObj.email"
                    >
                      {{ customerObj.email }}
                  </ElFormItem>
                </div>
                <div class="flex gap-8">
                  <div class="w-56">
                    <ElFormItem
                      :label="t('reuse.citizenIdentificationNumber')"
                      v-if="customerObj.cccd"
                    >
                      {{ customerObj.cccd }}
                    </ElFormItem>
                  </div>

                  <ElFormItem
                    label-width="auto"
                    :label="`${t('formDemo.supplyDate')}:`"
                    v-if="customerObj.cccdCreateAt"
                  >
                    {{ dateTimeFormat(customerObj.cccdCreateAt) }}
                  </ElFormItem>

                  <ElFormItem
                    label-width="auto"
                    :label="`${t('formDemo.supplyAddress')}:`"
                    v-if="customerObj.cccdPlaceOfGrant"
                  >
                    <span class="leading-5">{{ customerObj.cccdPlaceOfGrant }}</span>
                  </ElFormItem>
                </div>
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
            <div class="flex items-start flex-wrap gap-y-3">
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
                    <div class="italic text-xs text-gray-500" :class="[index == statusHistory.length - 1 ? 'opacity-100' : 'opacity-60']">{{item.approveAt}}</div>
                </div>
              </div>
            </div>
          </template>
        </Form>
      </ElCol>
      <ElCol :span="hasImage ? 12 : 0" v-if="hasImage" >
        <ElDivider content-position="left" class="font-bold ml-2">{{ t('formDemo.attachments') }}</ElDivider>
        <DocumentUpload :disabledButton="disabledForm" :imageRequired="imageRequired" :type="type" :fileUploadList="fileUploadList" @update-value="handleDocumentUpload"/>
      </ElCol>
    </ElRow>
    <template #under v-if="!removeButton">
      <div class="w-[100%]" v-if="type === 'add'">
        <div class="w-[50%] flex justify-left gap-2">
          <ElButton type="primary" :loading="loading" @click="save('add')">
            {{ model === 1 ?  t('reuse.saveAndPending') : t('reuse.saveAndComfirm')}}
          </ElButton>
          <ElButton v-if="model === 2" type="primary" :loading="loading">
            {{ t('reuse.paidAndFinish')}}
          </ElButton>
          <ElButton type="danger" :loading="loading" @click="cancel()">
            {{ t('reuse.cancel') }}
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
        <div v-if="model === 1 && isApproved" class="w-[50%] flex justify-left gap-2">
          <ElButton class="pl-8 pr-8" :loading="loading" @click="edit">
            {{ t('reuse.fix') }}
          </ElButton>
          <ElButton class="pl-8 pr-8" type="danger" :loading="loading" @click="delAction">
            {{ model === 1 ? t('formDemo.cancelAccount') : t('formDemo.cancelRequest') }}
          </ElButton>
        </div>
      </div>
      <div v-if="type === 'approval-collab'">
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
