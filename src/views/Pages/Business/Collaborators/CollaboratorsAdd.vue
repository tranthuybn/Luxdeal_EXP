<script setup lang="ts">
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import { h, onBeforeMount, reactive, ref, unref } from 'vue'
import { useForm } from '@/hooks/web/useForm'
import { useI18n } from '@/hooks/web/useI18n'
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
  ElTable,
  ElTableColumn,
  ElInput,
  ElCheckbox
} from 'element-plus'
const { t } = useI18n()
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'information',
    title: t('reuse.customerInfo')
  }
]
const { register } = useForm()
const dialogVisible = ref(false)
const disabled = ref(false)
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
const CollaboratorCode = Math.random()
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
const customersValue = ref('')
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
  }
  optionCallCustomerAPi++
}
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
  console.log('infoCompany: ', typeof infoCompany.taxCode)
}
onBeforeMount(() => {
  callCustomersApi()
})
//lay du lieu tu router
// const router = useRouter()
//const id = String(router.currentRoute.value.params.id)
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
                    <div>{{ CollaboratorCode }}</div>
                  </div>
                </div>
              </template>
              <template #discountCollaborator>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[16%] text-right">{{ t('formDemo.discountCollaborator') }}</label>
                  <div class="w-[80%] w-[100%] outline-none pl-2 bg-transparent">
                    <ElInput
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
                    <ElCheckbox :v-model="true" :label="t('formDemo.isActive')" size="large" />
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
                  action="#"
                  list-type="picture-card"
                  :auto-upload="false"
                  class="relative"
                >
                  <template #file="{ file }">
                    <div>
                      <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                      <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-preview"> </span>
                        <span v-if="!disabled" class="el-upload-list__item-delete"> </span>
                        <span v-if="!disabled" class="el-upload-list__item-delete"> </span>
                      </span>
                    </div>
                  </template>
                  <el-dialog v-model="dialogVisible" class="absolute">
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
          <ElButton class="min-w-42" type="primary"> {{ t('reuse.saveAndPending') }} </ElButton>
          <ElButton class="min-w-42"> {{ t('reuse.cancel') }} </ElButton>
        </div>
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
