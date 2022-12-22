<script setup lang="ts">
import { reactive, ref, onBeforeMount, h, unref } from 'vue'
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
  UploadUserFile,
  ElMessage,
  ElInput
} from 'element-plus'
import type { UploadFile } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { Form } from '@/components/Form'
import SelectTable from '@/components/SelectTable.vue'
import { dateTimeFormat } from '@/utils/format'
import { useIcon } from '@/hooks/web/useIcon'
import { createPointExchange, getCustomerList, getSettingPoint } from '@/api/Business'
import router from '@/router'
import { FORM_IMAGES } from '@/utils/format'
import CurrencyInputComponent from '@/components/CurrencyInputComponent.vue'
import { useValidator } from '@/hooks/web/useValidator'

const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const viewIcon = useIcon({ icon: 'uil:search' })
const deleteIcon = useIcon({ icon: 'uil:trash-alt' })
const { t } = useI18n()
const { register, elFormRef, methods } = useForm()
// upload image
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
let fileList = ref<UploadUserFile[]>([])
const ListFileUpload = ref()
const handleRemove = (file: UploadFile) => {
  fileList.value = fileList.value.filter((image) => image.url !== file.url)
  ListFileUpload.value = ListFileUpload.value.filter((image) => image.url !== file.url)
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

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
      valueFormat: 'MM-DD-YYYY'
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
    colProps: {
      span: 24
    }
  },
  {
    field: 'table',
    component: 'Input',
    colProps: {
      span: 24
    }
  }
])

const forceRemove = ref(false)

const TableData = reactive([
  {
    name: '',
    phoneNumber: '',
    id: null,
    code: ''
  }
])

// select MSP đổi tên thông tin sản phẩm
const changeName = (value, obj, scope) => {
  forceRemove.value = false
  const selected = TableData.filter((row) => row !== scope.row).find(
    (customer) => customer.id == value
  )
  if (selected !== undefined) {
    scope.row.id = null
    scope.row.name = null
    ElMessage({
      message: t('reuse.customerCodeExist'),
      type: 'warning'
    })
  } else {
    scope.row.name = obj.name
  }
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
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)
const code = `TD${Date.now()}`
// radio condition combo
onBeforeMount(() => {
  callApiCustomerList()
  if (type == 'detail' || type == 'edit') {
    callApiDetail()
  } else {
    const { setValues } = methods
    setValues({
      code: code
    })
  }
})

const callApiDetail = async () => {
  const res = await getSettingPoint({ Id: id })
  if (res) {
  }
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
  code: [required()],
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
  TableData.splice(index, 1)
}
const customFormPost = (form) => {
  form.startDate = form?.duration[0]
  form.endDate = form?.duration[1]
  delete form.duration
  return form
}
const createSettingPoint = async () => {
  let formValid = false
  const formRef = unref(elFormRef)
  await formRef?.validate((isValid) => {
    console.log('isValid', isValid)
    if (isValid) {
      formValid = true
    }
  })
  if (formValid) {
    const { getFormData } = methods
    let form = await getFormData()
    form = customFormPost(form)
    await createPointExchange(FORM_IMAGES(form))
  }
  const { getFormData } = methods
  let form = await getFormData()
  console.log('form', form, formValid)
}
const cancelSettingPoint = () => {}

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
const targetTypeTable = ref(true)
const targetChange = (data) => {
  if (data == 3) {
    targetTypeTable.value = false
  }
  if (data == 2) {
    targetTypeTable.value = true
  }
}
</script>
<template>
  <div class="flex w-[100%] gap-6 bg-white">
    <div class="w-[50%]">
      <Form
        :schema="schema"
        size="large"
        class="flex border-1 border-[var(--el-border-color)] border-none rounded-3xl box-shadow-blue text-base pt-4 w-full"
        @register="register"
        :rules="rules"
      >
        <template #code="formData">
          <span>{{ formData.code }}</span>
        </template>
        <template #point="formData">
          <span>{{ formData.point }} {{ t('reuse.points') }}</span>
        </template>
        <template #price="formData">
          <span>{{ formData.price }} đ</span>
        </template>
        <template #type>
          <div class="flex items-center w-[100%] gap-4">
            <div class="w-[100%] bg-transparent flex items-center gap-4">
              <el-input v-model="typePointTransaction" disabled />
              <el-button @click="typeDialog = true" :icon="plusIcon" style="padding: 8px 34px">{{
                t('formDemo.change')
              }}</el-button>
            </div>
          </div>
        </template>
        <template #targetType="formData">
          <el-radio-group v-model="formData.targetType" class="ml-4" @change="targetChange">
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
        <template #table>
          <el-table
            v-if="targetTypeTable"
            :data="TableData"
            border
            :class="[
              'bg-[var(--el-color-white)] dark:(bg-[var(--el-color-black)] border-[var(--el-border-color)] border-1px)'
            ]"
          >
            <el-table-column :label="`${t('reuse.customerCode')}`" min-width="150" prop="code">
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
            <el-table-column prop="name" :label="t('formDemo.customerName')" min-width="480" />
            <el-table-column :label="`${t('formDemo.manipulation')}`" align="center" min-width="90">
              <template #default="scope">
                <button
                  @click.prevent="removeLastRow(scope.$index)"
                  class="bg-[#EA4F37] pt-2 pb-2 pl-4 pr-4 text-[#fff]"
                  >Xóa</button
                >
              </template>
            </el-table-column>
          </el-table>
        </template>
      </Form>
    </div>
    <div class="w-[50%]">
      <div class="text-sm text-[#303133] font-medium p pl-4 dark:text-[#fff]">
        <el-divider content-position="left">{{ t('reuse.picture') }}</el-divider>
      </div>
      <div class="flex">
        <div class="pl-4">
          <el-upload
            :icon="plusIcon"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="1"
            class="relative"
          >
            <ElButton :icon="plusIcon" />
            <template #file="{ file }">
              <div>
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <ElButton :icon="viewIcon" />
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <ElButton :icon="deleteIcon" />
                  </span>
                </span>
              </div>
            </template>
          </el-upload>
          <el-dialog width="80%" v-model="dialogVisible">
            <img class="w-full" :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
        </div>
      </div>
    </div>
  </div>

  <div class="flex w-[100%] gap-6 bg-white">
    <div class="w-[50%] pl-2">
      <el-divider content-position="left">{{ t('formDemo.status') }}</el-divider>
      <div class="flex gap-4 items-center pt-4 pb-6">
        <label class="w-[16%] text-right">{{ t('formDemo.status') }}</label>
        <div>
          <p class="status bg-gray-300 day-updated">{{ t('reuse.initializeAndWrite') }}</p>
          <p class="date text-gray-300">
            {{ dateTimeFormat(new Date()) }}
          </p>
        </div>
      </div>
      <div class="flex gap-4 items-center h-12 justify-center mb-12">
        <el-button type="primary" @click="createSettingPoint">{{
          t('reuse.finishPacking')
        }}</el-button>
        <el-button type="danger" @click="cancelSettingPoint">{{
          t('reuse.cancelPackage')
        }}</el-button>
        <el-button v-if="false">{{ t('formDemo.edit') }}</el-button>
        <el-button v-if="false">{{ t('formDemo.add') }}</el-button>
      </div>
    </div>
    <div class="w-[50%]"></div>
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
      <el-table-column prop="radioComboTable" width="90" align="center">
        <template #default="scope">
          <el-radio v-model="radio" :label="scope.$index" size="large"><span></span></el-radio>
        </template>
      </el-table-column>
      <el-table-column :label="t('reuse.condition')" :formatter="formatterType" width="400" />
      <el-table-column :label="t('reuse.pointsNumber')">
        <template #default="scope">
          <el-input v-model="scope.row.point" type="number" :min="0" />
        </template>
      </el-table-column>
      <el-table-column :label="t('reuse.exchangedMoney')">
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
  border-left: 12px solid rgba(209, 213, 219, var(--tw-bg-opacity));
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
</style>
