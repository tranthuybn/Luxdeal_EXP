<script setup lang="ts">
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import { h, onBeforeMount, reactive, ref, unref, watch } from 'vue'
import { useForm } from '@/hooks/web/useForm'
import { TableBase } from '../../Components/TableBase/index'
import { useI18n } from '@/hooks/web/useI18n'
import { getCollaboratorsById, getGenCodeCollaborators, addNewCollaborators } from '@/api/Business'
import { useRouter } from 'vue-router'
import { getAllCustomer } from '@/api/Business'
import { Form } from '@/components/Form'
import {
  ElCollapse,
  ElCollapseItem,
  ElUpload,
  ElSelect,
  ElOption,
  ElButton,
  ElDivider,
  ElInput,
  ElCheckbox,
  ElNotification,
  UploadInstance,
  UploadProps,
  UploadRawFile
} from 'element-plus'
const { t } = useI18n()
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'information',
    title: t('reuse.customerInfo')
  },
  {
    icon: plusIcon,
    name: 'information',
    title: t('reuse.ManageSalesHistoryAndCommissionPayments')
  }
]
const tableColumn = [
  {
    field: 'date',
    label: t('reuse.date'),
    minWidth: '150'
  },
  {
    field: 'code',
    label: t('reuse.orderCode') + '/' + t('formDemo.withdrawalRequestCode'),
    minWidth: '350'
  },
  {
    field: 'discount',
    label: '%' + t('formDemo.discount'),
    minWidth: '150'
  },
  {
    field: 'orderSales',
    label: t('reuse.orderSales'),
    minWidth: '150',
    align: 'right'
  },
  {
    field: 'intoDiscountComMoney',
    label: t('formDemo.intoDiscountComMoney'),
    minWidth: '150',
    align: 'center'
  },
  {
    field: 'spent',
    label: t('formDemo.spent'),
    minWidth: '150',
    align: 'center'
  },
  {
    field: 'cumulativeCom',
    label: t('formDemo.cumulativeCom'),
    minWidth: '150',
    align: 'center'
  }
]
const dialogVisible = ref(false)
// const disabled = ref(false)
const disabledTable = ref(false)
const newList = reactive<FormSchema[]>([
  {
    field: 'profileCollaborator',
    label: t('formDemo.profileCollaborator'),
    component: 'Divider'
  },
  {
    field: 'codeCollaborator',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'discountCollaborator',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('formDemo.enterDiscount')
    }
  },
  {
    field: 'customerInfo',
    label: t('reuse.customerInfo'),
    component: 'Divider'
  },
  {
    field: 'chooseACustomer',
    component: 'Select',
    colProps: {
      span: 24
    }
  },
  {
    field: 'companyInformation',
    component: 'Input',
    colProps: {
      span: 12
    }
  },
  {
    field: 'statusAndAccount',
    label: t('reuse.statusAndAccount'),
    component: 'Divider'
  },
  {
    field: 'status',
    component: 'Checkbox',
    value: [],
    colProps: {
      span: 24
    }
  }
])
const collapseChangeEvent = (val) => {
  if (val) {
    collapse.forEach((el) => {
      if (val.includes(el.name)) el.icon = minusIcon
      else if (el.icon == minusIcon) el.icon = plusIcon
    })
  } else
    collapse.forEach((el) => {
      el.icon = plusIcon
    })
}
let customerAddress = ref('')
// Call api danh sách khách hàng

const optionsCustomerApi = ref<Array<any>>([])
let optionCallCustomerAPi = 0
const callCustomersApi = async () => {
  if (optionCallCustomerAPi == 0) {
    const res = await getAllCustomer({ PageIndex: 1, PageSize: 20 })
    const getCustomerResult = res.data
    console.log('getCustomerResult', getCustomerResult)
    if (Array.isArray(unref(getCustomerResult)) && getCustomerResult?.length > 0) {
      optionsCustomerApi.value = getCustomerResult.map((product) => ({
        label: product.representative
          ? product.representative + ' | MST ' + product.taxCode
          : product.name + ' | ' + product.phonenumber,
        value: product.code,
        address: product.address,
        isOrganization: product.isOrganization,
        name: product.name,
        taxCode: product.taxCode,
        phonenumber: product.phonenumber,
        email: product.email,
        representative: product.representative
      }))
    }
    profileCustomer.value = getCustomerResult
  }
  optionCallCustomerAPi++
  console.log('saveValue', profileCustomer)
}
let profileCustomer = ref()
let infoCompany = reactive({
  name: '',
  taxCode: '',
  phone: '',
  email: '',
  representative: '',
  phonenumber: '',
  address: ''
})
const changeAddressCustomer = (data) => {
  if (data) {
    // customerAddress.value = optionsCustomerApi.value.find((e) => e.value == data)?.address ?? ''
    const result = optionsCustomerApi.value.find((e) => e.value == data)
    console.log('result: ', result)
    if (result.isOrganization) {
      customerAddress.value = optionsCustomerApi.value.find((e) => e.value == data)?.address ?? ''
      infoCompany.name = result.name
      infoCompany.taxCode = result.taxCode
      infoCompany.email = result.email
      infoCompany.representative = result.representative
      infoCompany.phonenumber = result.phonenumber
      infoCompany.address = result.address
    } else {
      customerAddress.value = optionsCustomerApi.value.find((e) => e.value == data)?.address ?? ''
      infoCompany.name = result.name
      infoCompany.taxCode = result.taxCode
      infoCompany.email = result.email
      infoCompany.representative = result.representative
      infoCompany.phonenumber = result.phonenumber
      infoCompany.address = result.address
    }
  } else {
    customerAddress.value = ''
  }
  console.log('infoCompany: ', infoCompany)
}
// eslint-disable-next-line vue/no-setup-props-destructure
const { register, methods, elFormRef } = useForm({
  newList
})
// get data from router
const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)
//Lấy dữ liệu từ bảng khi ấn nút detail hoặc edit
watch(
  () => type,
  () => {
    if (type === 'detail') {
      const { setProps } = methods
      setProps({
        disabled: true
      })
    }
    if (type === 'detail' || type === 'edit') {
      getTableValue()
    }
    if (type === 'add') {
      const { setProps } = methods
      setProps({
        disabledTable: true
      })
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
const formValue = ref()
const getTableValue = async () => {
  if (!isNaN(id)) {
    const res = await getCollaboratorsById({ id: id })
    if (res) {
      if (res.data?.list !== undefined) {
        formValue.value = res.data.list[0]
      } else {
        formValue.value = res.data
      }
    } else {
      ElNotification({
        message: t('reuse.cantGetData'),
        type: 'warning'
      })
    }
  }
}
const CustomerId = ref()
const getGenCodeCollaborator = async () => {
  await getGenCodeCollaborators({})
    .then((res) => {
      CustomerId.value = res
    })
    .catch((err) => {
      console.error(err)
    })
  CustomerId
}

type FormDataInput = {
  CollaboratorStatus: boolean
  Discount: number
  customersValue: any
}
type FormDataPost = {
  CustomerId: any
  Code: string
  CollaboratorStatus: number
  Discount: number
  AccountNumber: string
  AccountName: string
  BankId: string
  Files?: any
}
const customersValue = ref('')
const EmptyCustomData = {} as FormDataInput
const FormData = reactive(EmptyCustomData)
const customPostData = (FormData) => {
  const customData = {} as FormDataPost
  customData.CustomerId = CustomerId.value
  customData.Code = customersValue.value
  customData.Discount = FormData.Discount
  customData.AccountNumber = infoCompany.phonenumber
  customData.AccountName = infoCompany.phonenumber
  customData.BankId = infoCompany.phonenumber
  customData.Files = upload.value
  FormData.CollaboratorStatus
    ? (customData.CollaboratorStatus = 1)
    : (customData.CollaboratorStatus = 0)
  return customData
}

const save = async (type) => {
  if (type === 'add') {
    console.log('1', FormData)
    customPostData(FormData)
    console.log('2', customPostData(FormData))
    await addNewCollaborators({ ...customPostData(FormData) })
      .then(() =>
        ElNotification({
          message: t('reuse.addSuccess'),
          type: 'success'
        })
      )
      .catch((error) =>
        ElNotification({
          message: error,
          type: 'warning'
        })
      )
  }
}
const upload = ref<UploadInstance>()

const handleExceed: UploadProps['onExceed'] = (files) => {
  const file = files[0] as UploadRawFile
  upload.value!.handleStart(file)
}
onBeforeMount(() => {
  callCustomersApi()
  getGenCodeCollaborator()
})
const activeName = ref('1')
</script>
<template>
  <div class="demo-collapse dark:bg-[#141414]">
    <el-collapse v-model="activeName" @change="collapseChangeEvent">
      <el-collapse-item name="1">
        <template #title>
          <el-button class="header-icon" :icon="collapse[0].icon" link />
          <span class="text-center text-xl">{{ collapse[0].title }}</span>
        </template>
        <div class="flex w-[100%]">
          <div class="w-[50%]">
            <Form
              :schema="newList"
              label-position="top"
              hide-required-asterisk
              size="large"
              class="flex border-1 border-[var(--el-border-color)] border-none rounded-3xl box-shadow-blue bg-white dark:bg-[#141414]"
              @register="register"
            >
              <template #codeCollaborator>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[16%] text-right">{{ t('formDemo.CollaboratorCode') }}</label>
                  <div class="w-[80%] w-[100%] outline-none pl-2 bg-transparent">
                    <div>{{ CustomerId }}</div>
                  </div>
                </div>
              </template>
              <template #discountCollaborator>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[16%] text-right">{{ t('formDemo.discountCollaborator') }}</label>
                  <div class="w-[80%] w-[100%] outline-none pl-2 bg-transparent">
                    <ElInput
                      v-model="FormData.Discount"
                      :placeholder="t('formDemo.enterCommissionCalculatedOnOrderSales')"
                      :suffixIcon="h('div', '%')"
                    />
                  </div>
                </div>
              </template>
              <template #chooseACustomer>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[16%] text-right">{{ t('formDemo.chooseACustomer') }}</label>
                  <div class="flex items-center w-[80%] gap-4">
                    <div class="w-[100%] outline-none pl-2 bg-transparent">
                      <ElSelect
                        v-model="customersValue"
                        filterable
                        :clearable="true"
                        :placeholder="t('formDemo.chooseACustomer')"
                        @change="changeAddressCustomer"
                      >
                        <ElOption
                          v-for="item in optionsCustomerApi"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </ElSelect>
                    </div>
                  </div>
                </div>
              </template>
              <template #companyInformation>
                <div class="flex gap-4 w-[100%]" v-if="customersValue !== ''">
                  <label class="w-[33%] text-right">{{ t('formDemo.customerName') }}</label>
                  <div class="leading-6 mt-2 ml-2">
                    <div>{{ infoCompany.name }}</div>
                  </div>
                </div>
                <div class="flex gap-4 w-[100%]" v-if="customersValue !== ''"
                  ><label class="w-[33%] text-right">{{ t('formDemo.taxCode') }}</label>
                  <div class="leading-6 ml-2 mt-2">
                    <div>{{ infoCompany.taxCode }}</div>
                  </div></div
                >
                <div class="flex gap-4 w-[100%]" v-if="customersValue !== ''"
                  ><label class="w-[33%] text-right">{{ t('formDemo.represent') }}</label>
                  <div class="leading-6 ml-2 mt-2">
                    <div>{{ infoCompany.representative }}</div>
                  </div></div
                >
                <div class="flex gap-4 w-[100%]" v-if="customersValue !== ''"
                  ><label class="w-[33%] text-right">{{ t('reuse.phoneNumber') }}</label>
                  <div class="leading-6 ml-2 mt-2">
                    <div>{{ infoCompany.phonenumber }}</div>
                  </div></div
                >
                <div class="flex gap-4 w-[100%]" v-if="customersValue !== ''"
                  ><label class="w-[33%] text-right">{{ t('reuse.email') }}</label>
                  <div class="leading-6 ml-2 mt-2">
                    <div>{{ infoCompany.email }}</div>
                  </div></div
                >
                <div class="flex gap-4 w-[100%]" v-if="customersValue !== ''"
                  ><label class="w-[33%] text-right">{{ t('formDemo.address') }}</label>
                  <div class="leading-6 ml-2 mt-2">
                    <div>{{ infoCompany.address }}</div>
                  </div></div
                >
                <div class="flex gap-4 w-[100%]" v-if="customersValue !== ''"
                  ><label class="w-[33%] text-right">{{ t('reuse.accountBank') }}</label>
                  <div class="leading-6 ml-2 mt-2">
                    <div>{{ infoCompany.name }}</div>
                  </div></div
                >
              </template>
              <template #status>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[16%] text-right">{{ t('reuse.status') }}</label>
                  <div class="flex items-center ml-2 w-[80%] gap-4">
                    <ElCheckbox
                      v-model="FormData.CollaboratorStatus"
                      :label="t('formDemo.isActive')"
                      size="large"
                    />
                  </div>
                </div>
              </template>
            </Form>
          </div>
          <div class="w-[50%]">
            <div class="text-sm text-[#303133] font-medium p pl-4 dark:text-[#fff]">
              <el-divider content-position="left">{{ t('formDemo.attachments') }}</el-divider>
            </div>
            <div class="flex">
              <div class="pl-5">
                <div class="text-right">{{ t('formDemo.addPhotosOrFiles') }}</div>
                <div class="text-right text-[#FECB80] italic">Dưới 10 hồ sơ</div>
              </div>
              <div class="pl-4">
                <el-upload
                  ref="upload"
                  action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                  :limit="1"
                  :on-exceed="handleExceed"
                  :auto-upload="false"
                >
                  <el-dialog v-model="dialogVisible">
                    <div class="text-[#303133] font-medium dark:text-[#fff]"
                      >+ {{ t('formDemo.addPhotosOrFiles') }}</div
                    >
                  </el-dialog>
                </el-upload>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-center">
          <ElButton class="min-w-42" type="primary" @click="save('add')">
            {{ t('reuse.saveAndPending') }}
          </ElButton>
          <ElButton class="min-w-42"> {{ t('reuse.cancel') }} </ElButton>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="disabledTable" name="2">
        <template #title>
          <el-button class="header-icon" :icon="collapse[1].icon" link />
          <span class="text-center text-xl">{{ collapse[1].title }}</span>
        </template>
        <TableBase
          :removeDrawer="false"
          :expand="false"
          :customOperator="1"
          :paginationType="false"
          ref="tableBase01"
          :api="''"
          :maxHeight="'69vh'"
          :fullColumns="tableColumn"
          :selection="false"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped>
::v-deep(.el-select) {
  width: 100%;
}

::v-deep(.el-textarea__inner) {
  box-shadow: none;
  padding: 5px 0;
}

::v-deep(.el-form-item) {
  display: flex;
  align-items: center;
}

::v-deep(.el-upload--picture-card) {
  width: 160px;
  height: 40px;
  border: 1px solid #409eff;
}

::v-deep(.d-block > .el-row) {
  display: block;
}

::v-deep(.el-form-item__content) {
  display: block;
}

@media only screen and (min-width: 1920px) {
  ::v-deep(.el-col-xl-12) {
    max-width: 100%;
  }
}

::v-deep(label) {
  color: #828387;
}

::v-deep(.cell) {
  color: #303133;
}

::v-deep(.el-divider__text) {
  font-size: 16px;
}

.el-button--text {
  margin-right: 15px;
}

::v-deep(.el-input) {
  width: auto;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

::v-deep(.el-dialog__body) {
  padding-top: 0;
}

::v-deep(.el-dialog__header) {
  padding-bottom: 0;
}

::v-deep(.el-table th.el-table__cell) {
  padding: 0 !important;
}

::v-deep(.el-input) {
  width: 100%;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

::v-deep(.el-dropdown-menu__item) {
  padding: 5px 30px;
}

::v-deep(.el-table .cell) {
  word-break: break-word;
}

::v-deep(.input-width > .el-select .el-input) {
  width: 100%;
}

::v-deep(.fix-full-width > .el-input) {
  width: 100%;
}

::v-deep(.fix-full-width > .el-select .el-input) {
  width: 100% !important;
}
</style>
