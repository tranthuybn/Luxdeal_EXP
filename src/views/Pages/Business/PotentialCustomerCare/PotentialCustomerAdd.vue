<script setup lang="ts">
import { TableOperator } from '../../Components/TableBase'
import { getBranchList } from '@/api/HumanResourceManagement'
import {
  addNewPotentialCustomer,
  getCustomer,
  getPotentialCustomerById,
  updatePotentialCustomer,
  UpdatePotentialCustomerHistory
} from '@/api/Business'
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import { useValidator } from '@/hooks/web/useValidator'
import { onBeforeMount, onBeforeUpdate, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/hooks/web/useI18n'
import moment from 'moment'
import {
  ElCollapse,
  ElCollapseItem,
  ElButton,
  ElTable,
  ElTableColumn,
  ElInput,
  ElDatePicker,
  ElOption,
  ElSelect,
  ElForm,
  ElFormItem,
  ElNotification
} from 'element-plus'
import { dateTimeFormat } from '@/utils/format'
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const { required, ValidService } = useValidator()
const { t } = useI18n()
const rules = reactive({
  classify: [required()],
  supplier: [required()],
  companyName: [required()],
  taxCode: [required()],
  customerName: [required()],
  phonenumber: [required(), ValidService.checkPhone],
  email: [required(), ValidService.checkEmail],
  percentageOfSales: [ValidService.checkNumber]
})
type FormValueType = string | number | boolean
type ComponentOptions = {
  label?: string
  value?: FormValueType
  disabled?: boolean
  key?: string | number
  children?: ComponentOptions[]
  options?: ComponentOptions[]
}
interface tableChildren {
  date?: string
  customerCareContent?: String
  manipulation?: string
  editedChild?: Boolean
}
interface tableDataType {
  id: any
  staffId: Number
  staffName: String
  content: String
  createdAt: String
  percentageOfSales: NonNullable<Number>
  manipulation: string
  edited: Boolean
  family: Array<tableChildren> | []
}

interface potentialCustomerInfo {
  id: any
  name: String
  userName: String
  code: String
  phonenumber: String
  email: String
  link: String
  taxCode: String
  isOrganization: Boolean
  historyTransaction: Number
  isOnline: Boolean
  accessChannel: Number
  source: Number
  note: String
  service: Number
  serviceDetail: string
  orderCode: string
  statusId: Number
  total: Number
}

interface potentialCustomerHistoryInfo {
  id: any
  staffId: Number
  content: string
  percentageOfSales: number
}

const parentBorder = ref(false)
let tableData = ref<tableDataType[]>([])
const ExpandedRow = ref([])

//lay du lieu tu router
const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)

const postData = (data) => {
  const customerHistory = reactive<
    Array<{ id: Number; content: String; percentageOfSales: Number }>
  >([])
  if (tableData.value.length > 0) {
    tableData.value.forEach((element) => {
      if (element.family && Array.isArray(element.family) && element.family.length > 0)
        element.family.forEach((ChildEl) => {
          customerHistory.push({
            id: element?.staffId ?? 0,
            content: ChildEl['customerCareContent'] ?? '',
            percentageOfSales: element.percentageOfSales
          })
        })
    })
  }
  const payload = {
    name: data.name,
    userName: 'string',
    code: 'string',
    taxCode: data.taxCode.toString(),
    phonenumber: data.phonenumber,
    email: data.email,
    link: data.link,
    historyTransaction: data.transactionHistory,
    isOnline: data.isOnline,
    accessChannel: data.customerContactChannel,
    source: data.newCustomerSource,
    note: data.Note,
    service: data.service[0],
    serviceDetail: data.serviceDetails,
    orderId: 1,
    statusId: 1,
    total: 1,
    potentialCustomerHistorys: customerHistory
  }

  addNewPotentialCustomer(payload)
  console.log('payload', payload)
}

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
const activeName = ref('collapse[0].name')

const handleEdit = async (row) => {
  row.edited = !row.edited

  if (type == 'edit') {
    row = customPostDataHistory(row)
    await UpdatePotentialCustomerHistory({ ...row })
      .then(() =>
        ElNotification({
          message: t('reuse.updateSuccess'),
          type: 'success'
        })
      )
      .catch(() =>
        ElNotification({
          message: t('reuse.updateFail'),
          type: 'warning'
        })
      )
  }
}
let isLastChild = false
let lastChildContent = ref('')
let isLastDate = false
let lastChildDate = ref('')
const handleItemEdit = (child, scope) => {
  child.row.editedChild = !child.row.editedChild
  scope.row.content = child.row.customerCareContent
  scope.row.createdAt = child.row.date
  if (child.$index == scope.row.family.length - 1) {
    isLastChild = true
    lastChildContent.value = child.row.customerCareContent
    isLastDate = true
    lastChildDate.value = child.row.date
  }
  isLastChild
    ? (scope.row.content = lastChildContent.value)
    : (scope.row.content = child.row.customerCareContent)
  isLastDate ? (scope.row.createdAt = lastChildDate.value) : (scope.row.createdAt = child.row.date)
}
const addActions = (props) => {
  const newObj: tableChildren = {
    date: '',
    manipulation: '',
    customerCareContent: '',
    editedChild: true
  }
  const temp: tableChildren[] = tableData.value[props].family ?? []
  temp.push(newObj)
}
const handleDelete = (payload) => {
  tableData.value.splice(payload, 1)
}

const handleItemDelete = (payload, scope) => {
  tableData.value[scope.$index].family.splice(payload, 1)
}
const size = ref<'' | 'large' | 'small'>('')

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

const columnProfileCustomer = reactive<FormSchema[]>([
  {
    field: 'customerInfo',
    label: t('reuse.customerInfo'),
    component: 'Divider'
  },
  {
    field: 'classify',
    label: t('reuse.classify'),
    component: 'Select',
    componentProps: {
      allowCreate: true,
      filterable: true,
      style: 'width: 100%',
      placeholder: t('reuse.personal'),
      options: [
        {
          label: t('reuse.personal'),
          value: true
        },
        {
          label: t('reuse.enterPrise'),
          value: false
        }
      ]
    },
    colProps: {
      span: 10
    }
  },

  {
    field: 'supplier',
    label: '',
    component: 'Select',
    componentProps: {
      allowCreate: true,
      filterable: true,
      style: 'width: 100%',
      placeholder: t('reuse.supplier'),
      options: []
    },
    formItemProps: {
      labelWidth: '0'
    },
    colProps: {
      span: 10
    }
  },

  {
    field: 'companyName',
    label: t('reuse.companyName'),
    component: 'Select',
    componentProps: {
      style: 'width: 100%',
      allowCreate: true,
      filterable: true,
      placeholder: t('reuse.enterSelectCompanyName')
    },
    colProps: {
      span: 20
    }
  },

  {
    field: 'taxCode',
    label: t('reuse.taxCode'),
    component: 'Select',
    componentProps: {
      style: 'width: 100%',
      allowCreate: true,
      filterable: true,
      placeholder: t('reuse.enterSelectTaxCode')
    },
    colProps: {
      span: 20
    }
  },

  {
    field: 'name',
    label: t('reuse.representative'),
    component: 'Input',
    componentProps: {
      placeholder: t('reuse.enterRepresentativeName')
    },
    colProps: {
      span: 20
    }
  },

  {
    field: 'phonenumber',
    label: t('reuse.phoneNumber'),
    component: 'Input',
    componentProps: {
      placeholder: t('reuse.enterPhoneNumber')
    },
    colProps: {
      span: 20
    }
  },
  {
    field: 'email',
    label: t('reuse.email'),
    component: 'Input',
    componentProps: {
      placeholder: t('reuse.enterEmail'),
      style: 'width: 100%'
    },
    colProps: {
      span: 20
    }
  },
  {
    field: 'link',
    label: t('reuse.link'),
    component: 'Input',
    componentProps: {
      placeholder: t('reuse.socialNetwork'),
      style: 'width: 100%'
    },
    colProps: {
      span: 20
    }
  },
  {
    field: 'customerClassification',
    label: t('reuse.customerClassification'),
    component: 'Divider'
  },
  {
    field: 'transactionHistory',
    label: t('reuse.transactionHistory'),
    component: 'Select',
    componentProps: {
      allowCreate: true,
      filterable: true,
      style: 'width: 100%',
      placeholder: t('reuse.firstTime'),
      options: [
        {
          label: 'Lần đầu',
          value: 219
        },
        {
          label: 'Đã giao dịch',
          value: 220
        }
      ]
    },
    colProps: {
      span: 20
    }
  },
  {
    field: 'isOnline',
    label: t('reuse.online') + '/' + t('reuse.offline'),
    component: 'Select',
    title: 'àcasfa',
    componentProps: {
      placeholder: t('reuse.offline'),
      style: 'width: 100%',
      options: [
        {
          label: 'Online',
          value: true
        },
        {
          label: 'Offline',
          value: false
        }
      ]
    },
    colProps: {
      span: 20
    }
  },
  {
    field: 'customerContactChannel',
    label: t('reuse.approachingChannel'),
    component: 'Select',
    componentProps: {
      allowCreate: true,
      filterable: true,
      placeholder: t('reuse.enterSelectOutreachChannel'),
      style: 'width: 100%',
      options: [
        {
          label: 'Zalo',
          value: 221
        },
        {
          label: 'Facebook',
          value: 222
        }
      ]
    },
    colProps: {
      span: 20
    }
  },
  {
    field: 'newCustomerSource',
    label: t('reuse.originated'),
    component: 'Select',
    componentProps: {
      allowCreate: true,
      filterable: true,
      placeholder: t('reuse.enterSelectSource'),
      style: 'width: 100%',
      options: [
        {
          label: 'Tự đến',
          value: 223
        },
        {
          label: 'Vãng lai',
          value: 224
        }
      ]
    },
    colProps: {
      span: 20
    }
  },
  {
    field: 'Note',
    label: t('reuse.note'),
    component: 'Input',
    componentProps: {
      placeholder: t('reuse.enterNote'),
      style: 'width: 100%'
    },
    colProps: {
      span: 20
    }
  },
  {
    field: 'customerService',
    label: t('reuse.customerService'),
    component: 'Divider'
  },
  {
    field: 'service',
    label: t('reuse.service'),
    component: 'Select',
    componentProps: {
      allowCreate: true,
      filterable: true,
      placeholder: t('reuse.selectService'),
      style: 'width: 100%',
      options: [
        {
          label: t('workplace.sale'),
          value: 1
        },
        {
          label: t('workplace.deposit'),
          value: 2
        },
        {
          label: t('workplace.lease'),
          value: 3
        },
        {
          label: t('workplace.mortgage'),
          value: 4
        },
        {
          label: t('workplace.spa'),
          value: 5
        }
      ]
    },
    colProps: {
      span: 20
    }
  },
  {
    field: 'serviceDetails',
    label: t('reuse.serviceDetails'),
    component: 'Input',
    componentProps: {
      placeholder: t('reuse.enterDetailedRequirements'),
      style: 'width: 100%'
    },
    colProps: {
      span: 20
    }
  },
  {
    field: 'resultAndStatus',
    label: t('reuse.result') + ' & ' + t('reuse.status'),
    component: 'Divider'
  },
  {
    field: 'result',
    label: t('reuse.result'),
    component: 'Select',
    componentProps: {
      allowCreate: true,
      filterable: true,
      placeholder: t('reuse.selectOrder'),
      style: 'width: 100%',
      options: [
        {
          label: '1',
          value: 1
        },
        {
          label: '2',
          value: 2
        }
      ]
    },
    colProps: {
      span: 20
    }
  },
  {
    field: 'status',
    label: t('reuse.status'),
    component: 'Checkbox',
    value: [],
    colProps: {
      span: 24
    },
    componentProps: {
      options: [
        {
          label: t('reuse.newData'),
          value: 1
        },
        {
          label: t('reuse.takingCare'),
          value: 2
        },
        {
          label: t('common.doneLabel'),
          value: 3
        }
      ]
    }
  }
])
const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'information',
    title: t('reuse.customerInfo'),
    columns: columnProfileCustomer,
    api: getBranchList,
    buttonAdd: '',
    hasImage: false,
    rules: rules,
    typeForm: 'form',
    id: id,
    type: type
  }
]
// get Customer
let cutomerOptions = ref<Array<ComponentOptions>>([])
console.log('type:', type, 'id:', id)
const getCustomerOptions = async () => {
  if (cutomerOptions.value.length === 0) {
    const res = await getCustomer({ PageIndex: 1, PageSize: 20 })
    if (res && res.data.length > 0) {
      cutomerOptions.value = res.data.map((data) => ({
        label: data.name,
        value: data.id
      }))
    }
  }
  if (cutomerOptions.value!.length > 0) {
    if (columnProfileCustomer[2].componentProps?.options !== undefined) {
      columnProfileCustomer[2].componentProps.options = cutomerOptions.value
    }
  }
}
onBeforeMount(async () => {
  await getCustomerOptions()
})
// add history for sale
const historyRow = reactive<tableDataType>({
  id: moment().toString(),
  staffId: 1,
  staffName: '',
  content: '',
  createdAt: '',
  percentageOfSales: 0,
  manipulation: '',
  edited: true,
  family: []
})
onBeforeUpdate(async () => {
  await getCustomerOptions()
})
const addNewSale = () => {
  const tempObj = { ...historyRow }
  tempObj.staffId = tableData.value.length + 1
  tempObj.family = [
    {
      date: '',
      customerCareContent: '',
      editedChild: true
    }
  ]
  tableData.value.push(tempObj)
}

//custom form data
type setFormCustomData = {
  email: string
  link: string
  phonenumber: string
  status: number[]
  name: string
  taxCode: string
  serviceDetails: string
  customerContactChannel: number
  transactionHistory: string
  isOnline: boolean
  Note: string
  newCustomerSource: number
  service: number
}
const emptyFormCustom = {} as setFormCustomData
const formDataCustomize = ref(emptyFormCustom)
//set form value
const customizeData = (formData) => {
  console.log('formData', formData)
  // formDataCustomize.value = formData
  formDataCustomize.value.email = formData.email
  formDataCustomize.value.phonenumber = formData.phonenumber
  formDataCustomize.value.link = formData.link
  formDataCustomize.value.name = formData.name
  formDataCustomize.value.isOnline = formData.isOnline
  formDataCustomize.value.taxCode = formData.taxCode
  formDataCustomize.value.serviceDetails = formData.serviceDetail
  formDataCustomize.value.customerContactChannel = formData.accessChannel
  formDataCustomize.value.transactionHistory = formData.historyTransaction
  formDataCustomize.value.Note = formData.note
  formDataCustomize.value.newCustomerSource = formData.source
  formDataCustomize.value['status'] = []
  if (formData.statusId == 1) {
    formDataCustomize.value['status'].push(1)
  }
  if (formData.statusId == 2) {
    formDataCustomize.value['status'].push(2)
  }
  if (formData.statusId == 3) {
    formDataCustomize.value['status'].push(3)
  }
  formDataCustomize.value.service = formData.service
  console.log('tableData: ', tableData)
  tableData.value[0] = formData.potentialCustomerHistorys[0]
  tableData.value[0].family = [{}]
  tableData.value[0].family[0].customerCareContent = formData.potentialCustomerHistorys[0].content
  tableData.value[0].family[0].date = formData.potentialCustomerHistorys[0].createdAt
  console.log('family: ', tableData.value[0].family)
}
// data update api
const customPostData = (data) => {
  const customData = {} as potentialCustomerInfo
  customData.id = id
  customData.name = data.name
  customData.userName = data.userName
  customData.code = data.code
  customData.phonenumber = data.phonenumber
  customData.email = data.email
  customData.link = data.link
  customData.taxCode = data.taxCode
  customData.isOrganization = true
  customData.historyTransaction = data.transactionHistory
  customData.isOnline = data.isOnline
  customData.accessChannel = data.customerContactChannel
  customData.source = data.newCustomerSource
  customData.note = data.Note
  customData.service = data.service
  customData.serviceDetail = data.serviceDetails
  customData.orderCode = ''
  customData.statusId = 1
  customData.total = 0
  return customData
}

const customPostDataHistory = (data) => {
  const customDataHistory = {} as potentialCustomerHistoryInfo
  customDataHistory.id = id
  customDataHistory.staffId = data.staffId
  customDataHistory.content = data.content
  customDataHistory.percentageOfSales = data.percentageOfSales
  return customDataHistory
}

const editData = async (data) => {
  data = customPostData(data)
  await updatePotentialCustomer(JSON.stringify(data))
    .then(() =>
      ElNotification({
        message: t('reuse.updateSuccess'),
        type: 'success'
      })
    )
    .catch(() =>
      ElNotification({
        message: t('reuse.updateFail'),
        type: 'warning'
      })
    )
}
let disableData = false
</script>
<template>
  <div class="demo-collapse dark:bg-[#141414]">
    <el-collapse v-model="activeName" @change="collapseChangeEvent">
      <el-collapse-item name="collapse[0].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[0].icon" link />
          <span class="text-center text-xl">{{ t('reuse.customerInfo') }}</span>
        </template>
        <TableOperator
          ref="formRef"
          :schema="columnProfileCustomer"
          :type="type"
          :id="id"
          :apiId="getPotentialCustomerById"
          @post-data="postData"
          @customize-form-data="customizeData"
          @edit-data="editData"
          :formDataCustomize="formDataCustomize"
          :rules="rules"
          :hasImage="false"
        />
      </el-collapse-item>
      <el-collapse-item :name="collapse[0].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[0].icon" link />
          <span class="text-center text-xl">{{ t('reuse.saleHistoryCustomerCare') }}</span>
        </template>
        <el-form :disabled="disableData" ref="form" label-width="20px">
          <div>
            <div>
              <el-table
                :data="tableData"
                :border="parentBorder"
                :expand-row-keys="ExpandedRow"
                row-key="id"
              >
                <el-table-column type="expand">
                  <template #default="props">
                    <div>
                      <h3 style="text-align: center" class="font-medium text-lg">{{
                        t('reuse.historySaleCustomerCare')
                      }}</h3>
                      <div class="flex w-[100%] justify-center">
                        <el-table fixed class="flex justify-center" :data="props.row.family">
                          <el-table-column
                            :label="`${t('reuse.customerCareContent')}`"
                            prop="customerCareContent"
                            width="700"
                          >
                            <template #default="data">
                              <ElInput
                                v-model="data.row.customerCareContent"
                                v-if="data.row.editedChild"
                              />
                              <div v-else>{{ data.row.customerCareContent }}</div>
                            </template>
                          </el-table-column>
                          <el-table-column :label="`${t('reuse.date')}`" prop="date" width="220">
                            <template #default="data">
                              <!-- <ElInput v-model="data.row.date" v-if="data.row.editedChild" />
                            <div v-else>{{ data.row.date }}</div> -->
                              <el-date-picker
                                v-model="data.row.date"
                                v-if="data.row.editedChild"
                                type="date"
                                placeholder="Pick a day"
                                :disabled-date="disabledDate"
                                :size="size"
                                format="DD/MM/YYYY"
                                value-format="YYYY-MM-DD"
                              />
                              <div v-else type="date" :size="size">{{
                                dateTimeFormat(data.row.date)
                              }}</div>
                            </template>
                          </el-table-column>
                          <el-table-column
                            :label="`${t('formDemo.manipulation')}`"
                            prop="manipulation"
                            width="180"
                          >
                            <template #default="child">
                              <el-button
                                v-if="child.row.editedChild"
                                type="primary"
                                size="default"
                                @click.prevent="handleItemEdit(child, props)"
                              >
                                {{ t('reuse.save') }}
                              </el-button>
                              <el-button
                                v-else
                                size="default"
                                @click="handleItemEdit(child, props)"
                                >{{ t('formDemo.edit') }}</el-button
                              >
                              <el-button
                                size="default"
                                type="danger"
                                @click="handleItemDelete(child.$index, props)"
                                >{{ t('reuse.delete') }}</el-button
                              >
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                      <div class="flex w-[100%] justify-center">
                        <div class="w-[1040px]"
                          ><el-button
                            class="mt-4"
                            style="width: 14%"
                            @click="addActions(props.$index)"
                            >+ {{ t('reuse.addActions') }}</el-button
                          ></div
                        >
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="`${t('reuse.sale')}`"
                  prop="staffId"
                  class="text-black font-bold"
                  width="150"
                >
                  <template #default="data">
                    {{ data.row.staffId }}
                  </template>
                </el-table-column>
                <el-table-column :label="`${t('reuse.lastContent')}`" prop="content" width="720">
                  <template #default="scope">
                    <!-- <el-input v-model="scope.row.lastContent" v-if="scope.row.edited" /> -->
                    <div>{{ scope.row.content }}</div>
                  </template>
                </el-table-column>
                <el-table-column :label="`${t('reuse.date')}`" prop="createdAt" width="220">
                  <template #default="data">
                    <!-- <ElInput v-model="data.row.date" v-if="data.row.edited" /> -->
                    <div> {{ dateTimeFormat(data.row.createdAt) }}</div>
                  </template>
                </el-table-column>
                <el-table-column :label="`${t('reuse.saleName')}`" prop="staffName" width="250">
                  <!-- <template #default="data">
                  <ElInput v-model="data.row.saleName" v-if="data.row.edited" />
                  <div v-else>{{ data.row.saleName }}</div>
                </template> -->
                  <template #default="props">
                    <el-select
                      v-model="props.row.staffName"
                      filterable
                      class="m-2"
                      size="large"
                      v-if="props.row.edited"
                    >
                      <el-option
                        v-for="(item, index) in cutomerOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value!"
                      />
                    </el-select>
                    <div v-else>{{ props.row.staffName }}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="`${t('reuse.orderSalesAssign')}`"
                  prop="percentageOfSales"
                  :rules="rules.percentageOfSales"
                >
                  <template #default="data">
                    <el-form-item
                      v-if="data && data.$index >= 0"
                      label=" "
                      :prop="'dataList.' + data.$index + '.name'"
                      :rules="[]"
                    >
                      <ElInput
                        type="Number"
                        step="5"
                        min="0"
                        v-model="data.row.percentageOfSales"
                        v-if="data.row.edited"
                      />
                      <div v-else>{{ data.row.percentageOfSales }}</div>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column :label="`${t('formDemo.manipulation')}`" prop="manipulation">
                  <template #default="scope">
                    <el-button
                      v-if="scope.row.edited"
                      type="primary"
                      size="default"
                      @click.prevent="handleEdit(scope.row)"
                    >
                      {{ t('reuse.save') }}
                    </el-button>
                    <el-button
                      v-else
                      type="primary"
                      size="default"
                      @click.prevent="handleEdit(scope.row)"
                    >
                      {{ t('formDemo.edit') }}
                    </el-button>
                    <el-button
                      type="danger"
                      size="default"
                      @click.prevent="handleDelete(scope.$index)"
                    >
                      {{ t('reuse.delete') }}
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button class="mt-4" style="width: 7%" @click="addNewSale"
                >+ {{ t('reuse.addSale') }}</el-button
              >
            </div>
          </div>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped>
.header-icon {
  margin: 10px;
}
.text-center {
  font-size: 20px;
}

::v-deep(.el-table__header-wrapper) {
  display: flex;
  justify-content: center;
}
/* DatePicker Css  */
.demo-date-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}
.demo-date-picker .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}
.demo-date-picker .block:last-child {
  border-right: none;
}
.demo-date-picker .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
