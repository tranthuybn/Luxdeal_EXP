<script setup lang="ts">
import { reactive, ref, h, unref, watch, onMounted } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import {
  ElUpload,
  ElButton,
  ElDivider,
  ElTable,
  ElTableColumn,
  ElRadioGroup,
  ElRadio,
  ElDialog,
  ElMessage,
  ElInput,
  UploadProps,
  ElImage,
  UploadFile,
  ElInputNumber,
  ElNotification,
  ElMessageBox
} from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { Form } from '@/components/Form'
import SelectTable from '@/components/SelectTable.vue'
import { dateTimeFormat, moneyFormat } from '@/utils/format'
import { useIcon } from '@/hooks/web/useIcon'
import {
  createPointExchange,
  deletePointExchange,
  getCustomerList,
  getSettingPoint,
  updatePointExchange
} from '@/api/Business'
import router from '@/router'
import { FORM_IMAGES } from '@/utils/format'
import CurrencyInputComponent from '@/components/CurrencyInputComponent.vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useRouter } from 'vue-router'
import { API_URL } from '@/utils/API_URL'
import moment from 'moment'

const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const viewIcon = useIcon({ icon: 'uil:search' })
const deleteIcon = useIcon({ icon: 'uil:trash-alt' })
const { t } = useI18n()
const { register, elFormRef, methods } = useForm()
// upload image

const schema = reactive<FormSchema[]>([
  {
    field: 'generalInformation',
    label: t('formDemo.generalInformation'),
    component: 'Divider',
    colProps: {
      span: 12
    }
  },
  {
    field: 'code',
    label: t('router.packageAccumulatePointsCode'),
    component: 'Input',
    componentProps: {
      disabled: true
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'type',
    label: t('reuse.type'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('formDemo.addNotes')
    }
  },
  {
    field: 'point',
    label: t('reuse.pointsNumber'),
    component: 'Input',
    colProps: {
      span: 24
    },
    formItemProps: {
      style: { margin: 0 }
    }
  },
  {
    field: 'price',
    label: t('reuse.exchangedMoney'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'duration',
    label: t('formDemo.duration'),
    component: 'DatePicker',
    colProps: {
      span: 24
    },
    componentProps: {
      type: 'daterange',
      format: 'DD/MM/YYYY',
      valueFormat: 'YYYY-MM-DD'
    }
  },
  {
    field: 'description',
    label: t('reuse.shortDescription'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('reuse.shortDescription')
    }
  },
  {
    field: 'target',
    label: t('reuse.subjectsOfApplication'),
    component: 'Divider',
    colProps: {
      span: 12
    }
  },
  {
    field: 'targetType',
    component: 'Input',
    value: 2,
    colProps: {
      span: 24
    },
    formItemProps: {
      style: { margin: 0 }
    }
  },
  {
    field: 'table',
    component: 'Input',
    colProps: {
      span: 24
    },
    formItemProps: {
      style: { margin: 0 }
    }
  }
])

const forceRemove = ref(false)

let TableData = ref([
  {
    name: '',
    id: null,
    code: ''
  }
])

// select MSP đổi tên thông tin sản phẩm
const changeName = (value, obj, scope) => {
  forceRemove.value = false
  const selected = TableData.value
    .filter((row) => row !== scope.row)
    .find((customer) => customer.id == value)
  if (selected !== undefined) {
    scope.row.id = null
    scope.row.name = null
    ElMessage({
      message: t('reuse.customerCodeExist'),
      type: 'warning'
    })
  } else {
    scope.row.name = obj.name
    if (scope.$index == TableData.value.length - 1) {
      pushTable()
    }
  }
}
const pushTable = () => {
  TableData.value.push({
    name: '',
    id: null,
    code: ''
  })
}
// open or close change combo dialog
const typeDialog = ref(false)

// table change combo
const tableTypePoint = [
  {
    type: 1,
    point: null,
    price: null
  },
  {
    type: 2,
    point: null,
    price: null
  },
  {
    type: 3,
    point: null,
    price: null
  },
  {
    type: 4,
    point: null,
    price: null
  },
  {
    type: 5,
    point: null,
    price: null
  },
  {
    type: 6,
    point: null,
    price: null
  },
  {
    type: 7,
    point: null,
    price: null
  }
]
const radio = ref(-1)
let id = ref(0)
let type = ref(String(router.currentRoute.value.params.type))
const code = `TD${Date.now()}`
// radio condition combo
onMounted(async () => await callApiCustomerList())
watch(
  () => id.value,
  async () => {
    if (type.value == 'detail') {
      disabledEverything()
    }
    if (type.value == 'detail' || type.value == 'edit') {
      await callApiDetail()
    }
  }
)
id.value = Number(router.currentRoute.value.params.id)
const formDetail = ref()

const callApiDetail = async () => {
  const res = await getSettingPoint({ Id: id.value })
  if (res && res.data.length > 0) {
    formDetail.value = res.data[0]
    const { setValues } = methods
    setValues({
      code: res.data[0]?.code,
      description: res.data[0]?.description,
      duration: [res.data[0]?.startDate, res.data[0]?.endDate],
      point: res.data[0]?.point,
      price: res.data[0]?.price,
      type: res.data[0]?.type,
      targetType: res.data[0]?.targetType
    })
    formatTypePointTransaction(res.data[0]?.type)
    TableData.value = res.data[0]?.customers
    pushTable()
    radio.value = res.data[0]?.type - 1
    tableTypePoint[radio.value].point = res.data[0]?.point
    tableTypePoint[radio.value].price = res.data[0]?.price
    res.data[0]?.image ? (imageUrl.value = API_URL.concat(res.data[0]?.image)) : ''

    if (formDetail.value.isDelete || formDetail.value.endDate < moment().format()) {
      disabledEverything()
    }
  }
}
const disabled = ref(false)
const disabledEverything = () => {
  disabled.value = true
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
}

// Call api danh sách sản phẩm

const tempListCustomers = ref()
const listCustomers = ref()

const params = reactive({
  pageSize: 10,
  pageIndex: 1,
  Keyword: ''
})
const callApiCustomerList = async () => {
  const res = await getCustomerList({ ...params })
  tempListCustomers.value = listCustomers.value = res.data.map((customer) => ({
    code: customer.code ?? '',
    phoneNumber: customer.phonenumber,
    name: customer.name,
    id: customer.id
  }))

  const { setValues } = methods
  setValues({
    code: code
  })
}

const scrollBottom = ref(false)
const noMoreData = ref(false)
const ScrollBottom = () => {
  scrollBottom.value = true
  params.pageIndex = params.pageIndex + 1
  noMoreData.value
    ? ''
    : getCustomerList({ ...params })
        .then((res) => {
          res.data.length == 0
            ? (noMoreData.value = true)
            : res.data.map((customer) =>
                listCustomers.value.push({
                  code: customer.code,
                  phoneNumber: customer.phonenumber,
                  name: customer.name,
                  id: customer.id
                })
              )
        })
        .catch(() => {
          noMoreData.value = true
        })
  tempListCustomers.value = listCustomers.value
}
const searchCustomer = async (keyword) => {
  params.Keyword = keyword
  if (keyword) {
    params.pageIndex = 1
    const res = await getCustomerList({ ...params })
    tempListCustomers.value = res.data.map((customer) =>
      listCustomers.value.push({
        code: customer.code,
        phoneNumber: customer.phonenumber,
        name: customer.name,
        id: customer.id
      })
    )
  } else {
    tempListCustomers.value = listCustomers.value
  }
}
const { required, ValidService, notSpecialCharacters } = useValidator()
const rules = reactive({
  description: [
    required(),
    { validator: notSpecialCharacters },
    { validator: ValidService.checkSpace.validator },
    { validator: ValidService.checkNameLength.validator }
  ],
  type: [required()],
  duration: [required()],
  targetType: [required()]
})
const removeLastRow = (index) => {
  if (TableData.value.length < 2) {
    return
  }
  TableData.value.splice(index, 1)
}
const customFormPost = (form) => {
  form.startDate = form?.duration[0]
  form.endDate = moment(form?.duration[1])
    .add(23, 'hours')
    .add(59, 'minutes')
    .add(59, 'seconds')
    .format('YYYY-MM-DD HH:mm:ss')
  form.Image = rawUploadFile.value?.raw
  form.CustomerIds = TableData.value.map((row) => row.id).toString()
  return form
}
const customFormUpdate = (form) => {
  form.startDate = form?.duration[0]
  form.endDate = moment(form?.duration[1])
    .add(23, 'hours')
    .add(59, 'minutes')
    .add(59, 'seconds')
    .format('YYYY-MM-DD HH:mm:ss')
  form.Image = rawUploadFile.value?.raw
  form.Id = id.value
  form.CustomerIds = TableData.value.map((row) => row.id).toString()
  return form
}
const { push } = useRouter()
const createSettingPoint = async () => {
  let formValid = false
  const formRef = unref(elFormRef)
  await formRef?.validate((isValid) => {
    if (isValid) {
      formValid = true
    }
  })
  const { getFormData } = methods
  let form = await getFormData()
  if (form?.targetType == 2 && (TableData.value.length < 1 || TableData.value[0]?.id == null)) {
    ElMessage({
      message: t('reuse.tableCustomerNotFillInformation'),
      type: 'warning'
    })
    formValid = false
  }
  if (formValid) {
    removeTable()
    form = customFormPost(form)
    await createPointExchange(FORM_IMAGES(form))
      .then(() => {
        ElNotification({
          message: t('reuse.addSuccess'),
          type: 'success'
        }),
          push({
            name: `business.accumulate-points.settings-points`
          })
      })
      .catch((error) =>
        ElNotification({
          title: t('reuse.addFail'),
          message: error.response.data.message,
          type: 'error'
        })
      )
  }
}
const removeTable = () => {
  let removeId: number[] = []
  TableData.value.forEach((row, index) => {
    if (row.id == null) {
      removeId.push(index)
    }
  })
  removeId.reverse().forEach((x) => removeLastRow(x))
}
const updateSettingPoint = async () => {
  let formValid = false
  const formRef = unref(elFormRef)
  await formRef?.validate((isValid) => {
    if (isValid) {
      formValid = true
    }
  })
  const { getFormData } = methods
  let form = await getFormData()
  if (form?.targetType == 2 && (TableData.value.length < 1 || TableData.value[0]?.id == null)) {
    ElMessage({
      message: t('reuse.tableCustomerNotFillInformation'),
      type: 'warning'
    })
    formValid = false
  }
  if (formValid) {
    removeTable()
    form = customFormUpdate(form)
    await updatePointExchange(FORM_IMAGES(form))
      .then(() => {
        ElNotification({
          message: t('reuse.updateSuccess'),
          type: 'success'
        }),
          push({
            name: `business.accumulate-points.settings-points`
          })
      })
      .catch((error) =>
        ElNotification({
          title: t('reuse.updateFail'),
          message: error.response.data.message,
          type: 'error'
        })
      )
  }
}

const cancelSettingPoint = async () => {
  ElMessageBox.confirm(t('reuse.doYouWantToCancelPointPackage'), t('reuse.cancelPointPackage'), {
    confirmButtonText: t('reuse.cancel'),
    confirmButtonClass: '!bg-red-500',
    cancelButtonText: t('reuse.exit')
  }).then(async () => {
    await deletePointExchange({ Id: id.value })
      .then(() => {
        ElNotification({
          message: t('reuse.deleteSuccess'),
          type: 'success'
        }),
          push({
            name: `business.accumulate-points.settings-points`
          })
      })
      .catch((error) =>
        ElNotification({
          title: t('reuse.deleteFail'),
          message: error.response.data.message,
          type: 'error'
        })
      )
  })
}

const chooseType = () => {
  if (
    radio.value !== -1 &&
    tableTypePoint[radio.value].point !== null &&
    tableTypePoint[radio.value].price
  ) {
    typeDialog.value = false
    const { setValues } = methods
    setValues({
      type: tableTypePoint[radio.value].type,
      point: tableTypePoint[radio.value].point,
      price: tableTypePoint[radio.value].price
    })
    formatTypePointTransaction(tableTypePoint[radio.value].type)
  } else {
    ElMessage({
      message: t('reuse.notFillAllInformation'),
      type: 'warning'
    })
  }
}
const formatterType = (row, _column: any) => {
  switch (row.type) {
    case 1:
      return h('div', [
        `${t('reuse.buyPointExchange')}`,
        h('div', { class: 'text-orange-400' }, `${t('reuse.customerBuyPointExchange')}`)
      ])
    case 2:
      return h('div', [
        `${t('reuse.pointsForSellOrder')}`,
        h('div', { class: 'text-orange-400' }, `${t('reuse.customerGetPointWhenBuyProduct')}`)
      ])
    case 3:
      return h('div', [
        `${t('reuse.pointsForRentOrder')}`,
        h('div', { class: 'text-orange-400' }, `${t('reuse.customerGetPointWhenRentProduct')}`)
      ])
    case 4:
      return h('div', [
        `${t('reuse.pointsForDepositOrder')}`,
        h('div', { class: 'text-orange-400' }, `${t('reuse.customerGetPointWhenDepositProduct')}`)
      ])
    case 5:
      return h('div', [
        `${t('reuse.pointsForPawnOrder')}`,
        h('div', { class: 'text-orange-400' }, `${t('reuse.customerGetPointWhenPawnProduct')}`)
      ])
    case 6:
      return h('div', [
        `${t('reuse.pointsForSpaOrder')}`,
        h('div', { class: 'text-orange-400' }, `${t('reuse.customerGetPointWhenSpaProduct')}`)
      ])
    case 7:
      return h('div', [
        `${t('reuse.pointsForAffiliate')}`,
        h('div', { class: 'text-orange-400' }, `${t('reuse.customerGetPointWhenRefer')}`)
      ])
    default:
      return ''
  }
}
const typePointTransaction = ref('')
const formatTypePointTransaction = (val) => {
  switch (val) {
    case 1:
      return (typePointTransaction.value = `${t('reuse.buyPointExchange')}`)
    case 2:
      return (typePointTransaction.value = `${t('reuse.pointsForSellOrder')}`)
    case 3:
      return (typePointTransaction.value = `${t('reuse.pointsForRentOrder')}`)
    case 4:
      return (typePointTransaction.value = `${t('reuse.pointsForDepositOrder')}`)
    case 5:
      return (typePointTransaction.value = `${t('reuse.pointsForPawnOrder')}`)
    case 6:
      return (typePointTransaction.value = `${t('reuse.pointsForSpaOrder')}`)
    case 7:
      return (typePointTransaction.value = `${t('reuse.pointsForAffiliate')}`)
    default:
      return ''
  }
}
const imageUrl = ref('')
let rawUploadFile = ref<UploadFile>()
const handleChange: UploadProps['onChange'] = async (uploadFile, _uploadFiles) => {
  const validImage = await beforeAvatarUpload(uploadFile, 'single')
  if (validImage) {
    imageUrl.value = URL.createObjectURL(uploadFile.raw!)
    rawUploadFile.value = uploadFile
  }
}
const dialogImageUrl = ref(false)
const previewImage = () => {
  dialogImageUrl.value = true
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
    return true
  }
  return true
}
const handleRemove = (_file) => {
  imageUrl.value = ''
  rawUploadFile.value = undefined
}
const changeTypeToEdit = () => {
  enableEverything()
}
const enableEverything = () => {
  disabled.value = false
  const { setProps } = methods
  setProps({
    disabled: false
  })
  type.value = 'edit'
}
</script>
<template>
  <div class="flex w-[100%] gap-6 bg-white">
    <div class="w-[60%]">
      <Form :schema="schema" @register="register" :rules="rules">
        <template #code="formData">
          <span>{{ formData.code }}</span>
        </template>
        <template #point="formData">
          <span>{{ formData.point }} {{ t('reuse.points') }}</span>
        </template>
        <template #price="formData">
          <span>{{ moneyFormat(formData.price) }}</span>
        </template>
        <template #type>
          <div class="flex items-center w-[100%] gap-4">
            <div class="w-[100%] bg-transparent flex items-center gap-4">
              <el-input v-model="typePointTransaction" disabled />
              <el-button
                @click="typeDialog = true"
                :icon="plusIcon"
                :disabled="disabled"
                style="padding: 8px 34px"
                >{{ t('formDemo.change') }}</el-button
              >
            </div>
          </div>
        </template>
        <template #targetType="formData">
          <el-radio-group v-model="formData.targetType" class="ml-4" :disabled="disabled">
            <el-radio :label="3" size="large">
              <div class="text-[#303133] font-normal dark:text-white">{{
                t('reuse.allCustomer')
              }}</div></el-radio
            >
            <el-radio :label="2" size="large"
              ><div class="text-[#303133] font-normal dark:text-white">{{
                t('formDemo.chooseCustomerDetail')
              }}</div></el-radio
            >
          </el-radio-group>
        </template>
        <template #table="form">
          <el-table
            :data="TableData"
            v-if="form.targetType !== 3"
            border
            :class="[
              'bg-[var(--el-color-white)] dark:(bg-[var(--el-color-black)] border-[var(--el-border-color)] border-1px)'
            ]"
            style="width: 100%"
          >
            <el-table-column :label="`${t('reuse.customerCode')}`" :min-width="2" prop="code">
              <template #default="scope">
                <SelectTable
                  v-model="scope.row.id"
                  :fields="[
                    t('reuse.customerCode'),
                    t('reuse.phoneNumber'),
                    t('formDemo.customerName')
                  ]"
                  :items="tempListCustomers"
                  width="500px"
                  valueKey="id"
                  labelKey="code"
                  :hiddenKey="['id']"
                  :placeHolder="t('reuse.chooseCustomerCode')"
                  @scroll-bottom="ScrollBottom"
                  @keyword="searchCustomer"
                  @change="(value, obj) => changeName(value, obj, scope)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="name" :label="t('formDemo.customerName')" :min-width="4" />
            <el-table-column :label="`${t('formDemo.manipulation')}`" align="center" :min-width="2">
              <template #default="scope">
                <el-button
                  @click="removeLastRow(scope.$index)"
                  type="danger"
                  :disabled="disabled"
                  >{{ t('reuse.delete') }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </template>
      </Form>
      <el-divider content-position="left">{{ t('formDemo.status') }}</el-divider>
      <div class="flex gap-4 items-center pt-4 pb-6">
        <label class="w-[16%] text-right">{{ t('formDemo.status') }}</label>
        <div>
          <p class="status lightGray day-updated text-blue-400">{{
            t('reuse.newInitialization')
          }}</p>
          <p class="date text-gray-300">
            {{
              formDetail?.createdAt
                ? dateTimeFormat(formDetail?.createdAt)
                : dateTimeFormat(new Date())
            }}
          </p>
        </div>
        <!-- Hủy trước khi hoạt động -->
        <div v-if="formDetail?.isDelete && formDetail.updatedAt < formDetail.startDate">
          <p class="status red red-updated text-red-500">{{ t('reuse.cancelPackage') }}</p>
          <p class="date text-gray-300">
            {{ dateTimeFormat(formDetail.updatedAt) }}
          </p>
        </div>
        <!-- Hoạt động -->
        <div v-if="formDetail !== undefined" class="flex gap-4">
          <!-- Đang hoạt động -->
          <div>
            <p class="status lightGray day-updated text-blue-400">{{
              t('reuse.runningPointAccumulationPackage')
            }}</p>
            <p class="date text-gray-300">
              {{ dateTimeFormat(formDetail?.startDate) }}
            </p>
          </div>
          <!-- Đang hoạt động thì hủy -->
          <div v-if="formDetail?.isDelete && formDetail.updatedAt < formDetail.endDate">
            <p class="status red red-updated text-red-500">{{ t('reuse.cancelPackage') }}</p>
            <p class="date text-gray-300">
              {{ dateTimeFormat(formDetail.updatedAt) }}
            </p>
          </div>
          <!-- Chạy hết hoạt động -->
          <div v-if="!formDetail?.isDelete && formDetail?.endDate < moment().format()">
            <p class="status darkGray darkGray-updated text-black">{{ t('common.doneLabel') }}</p>
            <p class="date text-gray-300">
              {{ dateTimeFormat(formDetail?.endDate) }}
            </p>
          </div>
        </div>
      </div>
      <div class="flex gap-4 items-center h-12 justify-center mb-12">
        <!-- Tạo gói khi ở màn Thêm mới -->
        <el-button type="primary" @click="createSettingPoint" v-if="type == 'add'">{{
          t('reuse.finishPacking')
        }}</el-button>
        <!--Lưu khi sửa gói chưa hoạt động và chưa hủy gói -->
        <el-button
          v-if="type == 'edit' && formDetail?.endDate > moment().format() && !formDetail?.isDelete"
          @click="updateSettingPoint"
          >{{ t('reuse.save') }}</el-button
        >
        <!--Hủy gói khi ở màn Sửa và chưa hủy -->
        <el-button
          type="danger"
          @click="cancelSettingPoint"
          v-if="type == 'edit' && formDetail?.endDate > moment().format() && !formDetail?.isDelete"
          >{{ t('reuse.cancelPackage') }}</el-button
        >
        <el-button
          v-if="
            type == 'detail' && formDetail?.endDate > moment().format() && !formDetail?.isDelete
          "
          @click="changeTypeToEdit"
          >{{ t('formDemo.edit') }}</el-button
        >
      </div>
    </div>
    <div class="w-[40%]">
      <div class="text-sm text-[#303133] font-medium pt-4 pl-4 dark:text-[#fff]">
        <el-divider content-position="left">{{ t('reuse.picture') }}</el-divider>
      </div>
      <div class="flex">
        <div class="pl-4">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            action="#"
            :auto-upload="false"
            :on-change="handleChange"
            :disabled="disabled"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-button :icon="plusIcon" class="uploadIcon" v-else :disabled="disabled" />
          </el-upload>
          <div class="w-full flex justify-center" v-if="imageUrl">
            <ElButton :icon="viewIcon" @click="previewImage" />
            <ElButton :icon="deleteIcon" :disabled="disabled" @click="handleRemove" />
          </div>
          <el-dialog top="5vh" v-model="dialogImageUrl" width="130vh">
            <div class="flex justify-center items-center">
              <el-image class="h-full" :src="imageUrl" alt="Preview Image" />
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>

  <!-- Dialog change combo -->
  <el-dialog
    v-model="typeDialog"
    :title="t('reuse.choosePointExchangeType')"
    width="55%"
    align-center
    class="z-50"
  >
    <el-divider />
    <el-table :data="tableTypePoint" border style="width: 100%">
      <el-table-column prop="radioComboTable" width="50" align="center">
        <template #default="scope">
          <el-radio v-model="radio" :label="scope.$index" size="large" :disabled="disabled"
            ><span></span
          ></el-radio>
        </template>
      </el-table-column>
      <el-table-column :label="t('reuse.condition')" :formatter="formatterType" :min-width="4" />
      <el-table-column :label="t('reuse.pointsNumber')" :min-width="2">
        <template #default="scope">
          <el-input-number v-model="scope.row.point" controls-position="right" :min="0" />
        </template>
      </el-table-column>
      <el-table-column :label="t('reuse.exchangedMoney')" :min-width="2">
        <template #default="scope">
          <CurrencyInputComponent v-model="scope.row.price" />
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button class="w-[150px]" type="primary" @click="chooseType"
          >{{ t('reuse.save') }}
        </el-button>
        <el-button class="w-[150px]" @click="typeDialog = false">{{ t('reuse.exit') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.lightGray {
  background-color: #e0e0e0;
}
.darkGray {
  background-color: #a0a0a0;
}
.red {
  background-color: #ff9999;
}
.day-updated {
  position: relative;
  padding-left: 20px;
  width: fit-content;
}
.day-updated::after {
  content: '';
  position: absolute;
  top: 0;
  right: -12px;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 14px solid transparent;
  border-left: 12px solid #e0e0e0;
}
.day-updated::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent;
  border-left: 12px solid white;
}
.red-updated {
  position: relative;
  padding-left: 20px;
  width: fit-content;
}
.red-updated::after {
  content: '';
  position: absolute;
  top: 0;
  right: -12px;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 14px solid transparent;
  border-left: 12px solid #ff9999;
}
.red-updated::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent;
  border-left: 12px solid white;
}
.darkGray-updated {
  position: relative;
  padding-left: 20px;
  width: fit-content;
}
.darkGray-updated::after {
  content: '';
  position: absolute;
  top: 0;
  right: -12px;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 14px solid transparent;
  border-left: 12px solid #a0a0a0;
}
.darkGray-updated::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent;
  border-left: 12px solid white;
}
.avatar {
  width: 178px;
  height: 178px;
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

.uploadIcon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
:deep(.el-row) {
  width: 100%;
}
:deep(.el-form-item) {
  margin-left: 7% !important;
}
</style>
