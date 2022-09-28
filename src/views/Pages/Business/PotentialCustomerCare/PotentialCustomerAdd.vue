<script setup lang="ts">
// import CollapseBase from '@/views/Pages/Components/CollapseBase.vue'
import { TableOperator } from '../../Components/TableBase'
import { getBranchList } from '@/api/HumanResourceManagement'
import { addNewPotentialCustomer, getCustomer, getPotentialCustomerListById } from '@/api/Business'
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import { isNumber } from '@/utils/is'
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
  oderSalesAssign: [ValidService.checkNumber]
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
  sale: Number
  saleName: String
  lastContent: String
  date: String
  oderSalesAssign: NonNullable<Number>
  manipulation: string
  edited: Boolean
  family: Array<tableChildren> | []
}
const parentBorder = ref(false)
const tableData = ref<tableDataType[]>([])
const ExpandedRow = ref([])

//lay du lieu tu router
const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)

const postData = (data) => {
  const cumtomerHistory: Array<any> = []
  if (tableData.value.length > 0) {
    tableData.value.forEach((element) => {
      if (element.family && Array.isArray(element.family) && element.family.length > 0)
        element.family.forEach((ChildEl) => {
          cumtomerHistory.push({
            id: element.sale,
            staffId: 0,
            content: ChildEl.customerCareContent,
            percentageOfSales: isNumber(element.oderSalesAssign)
              ? element.oderSalesAssign
              : parseInt(element.oderSalesAssign)
          })
        })
    })
  }
  const payload = {
    name: data.name,
    userName: 'string',
    code: 'string',
    phonenumber: data.phonenumber,
    email: data.email,
    link: data.link,
    historyTransaction: data.transactionHistory,
    isOnline: true,
    accessChannel: data.customerContactChannel,
    source: data.newCustomerSource,
    note: data.Note,
    service: 1,
    serviceDetail: data.serviceDetails,
    orderId: 1,
    statusId: 1,
    total: 1,
    potentialCustomerHistorys: cumtomerHistory
  }

  addNewPotentialCustomer(payload)
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

const handleEdit = (row) => {
  row.edited = !row.edited
}
let isLastChild = false
let lastChildContent = ref('')
let isLastDate = false
let lastChildDate = ref('')
const handleItemEdit = (child, scope) => {
  child.row.editedChild = !child.row.editedChild
  scope.row.lastContent = child.row.customerCareContent
  scope.row.date = child.row.date
  if (child.$index == scope.row.family.length - 1) {
    isLastChild = true
    lastChildContent.value = child.row.customerCareContent
    isLastDate = true
    lastChildDate.value = child.row.date
  }
  isLastChild
    ? (scope.row.lastContent = lastChildContent.value)
    : (scope.row.lastContent = child.row.customerCareContent)
  isLastDate ? (scope.row.date = lastChildDate.value) : (scope.row.date = child.row.date)
}

const addActions = (props) => {
  const newObj: tableChildren = {
    date: '',
    manipulation: '',
    customerCareContent: '',
    editedChild: true
  }
  tableData.value[props].family.push(newObj)
}
const handleDelete = (payload) => {
  tableData.value.splice(payload, 1)
}

const handleItemDelete = (payload, scope) => {
  tableData.value[scope.$index].family.splice(payload, 1)
}
const size = ref<'' | 'large' | 'small'>('')

const shortcuts = [
  {
    text: 'Today',
    value: new Date()
  },
  {
    text: 'Yesterday',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return date
    }
  },
  {
    text: 'A week ago',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      return date
    }
  }
]

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
      multiple: true,
      style: 'width: 100%',
      placeholder: t('reuse.personal'),
      options: [
        {
          label: t('reuse.personal'),
          value: 1
        },
        {
          label: t('reuse.enterPrise'),
          value: 2
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
      multiple: true,
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
      multiple: true,
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
      multiple: true,
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
    field: 'historyTransactionName',
    label: t('reuse.transactionHistory'),
    component: 'Select',
    componentProps: {
      allowCreate: true,
      filterable: true,
      style: 'width: 100%',
      placeholder: t('reuse.firstTime'),
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
    field: 'isOnline',
    label: t('reuse.online') + '/' + t('reuse.offline'),
    component: 'Select',
    title: 'àcasfa',
    componentProps: {
      allowCreate: true,
      filterable: true,
      multiple: true,
      placeholder: t('reuse.offline'),
      style: 'width: 100%',
      options: [
        {
          label: t('reuse.online'),
          value: 1
        },
        {
          label: t('reuse.offline'),
          value: 2
        }
      ]
    },
    colProps: {
      span: 20
    }
  },
  {
    field: 'accessChannelName',
    label: t('reuse.approachingChannel'),
    component: 'Select',
    componentProps: {
      allowCreate: true,
      filterable: true,
      placeholder: t('reuse.enterSelectOutreachChannel'),
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
    field: 'sourceName',
    label: t('reuse.originated'),
    component: 'Select',
    componentProps: {
      allowCreate: true,
      filterable: true,
      placeholder: t('reuse.enterSelectSource'),
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
    field: 'note',
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
      multiple: true,
      placeholder: t('reuse.selectService'),
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
    field: 'serviceDetail',
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
      multiple: true,
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
          value: '1'
        },
        {
          label: t('reuse.takingCare'),
          value: '2'
        },
        {
          label: t('common.doneLabel'),
          value: '3'
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
    if (res.data && res.data.data.length > 0) {
      cutomerOptions.value = res.data.data.map((data) => ({
        label: data.name,
        value: data.id
      }))
    }
  }
}
onBeforeMount(async () => {
  await getCustomerOptions()
  if (cutomerOptions.value.length > 0) {
    if (columnProfileCustomer[2].componentProps?.options !== undefined) {
      columnProfileCustomer[2].componentProps.options = cutomerOptions.value
    }
  }
})
// add history for sale
const historyRow = reactive<tableDataType>({
  id: moment().toString(),
  sale: 1,
  saleName: '',
  lastContent: '',
  date: '',
  oderSalesAssign: 0,
  manipulation: '',
  edited: true,
  family: []
})
onBeforeUpdate(async () => {
  await getCustomerOptions()
})
const addNewSale = () => {
  const tempObj = { ...historyRow }
  tempObj.sale = tableData.value.length + 1
  tempObj.family = [
    {
      date: '',
      customerCareContent: '',
      editedChild: true
    }
  ]
  tableData.value.push(tempObj)
}
</script>
<template>
  <!-- <CollapseBase :collapse="collapse" :default="'information'" @post-data="postData" /> -->
  <div class="demo-collapse dark:bg-[#141414]">
    <el-collapse v-model="activeName" @change="collapseChangeEvent">
      <el-collapse-item :name="collapse[0].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[0].icon" link />
          <span class="text-center text-xl">{{ t('reuse.saleHistoryCustomerCare') }}</span>
        </template>
        <el-form ref="form" label-width="20px">
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
                                :shortcuts="shortcuts"
                                :size="size"
                                format="DD/MM/YYYY"
                                value-format="DD/MM/YYYY"
                              />
                              <div
                                v-else
                                type="date"
                                :disabled-date="disabledDate"
                                :shortcuts="shortcuts"
                                :size="size"
                                >{{ data.row.date }}</div
                              >
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
                  prop="sale"
                  class="text-black font-bold"
                  width="150"
                >
                  <template #default="data">
                    {{ data.row.sale }}
                  </template>
                </el-table-column>
                <el-table-column
                  :label="`${t('reuse.lastContent')}`"
                  prop="lastContent"
                  width="720"
                >
                  <template #default="scope">
                    <!-- <el-input v-model="scope.row.lastContent" v-if="scope.row.edited" /> -->
                    <div>{{ scope.row.lastContent }}</div>
                  </template>
                </el-table-column>
                <el-table-column :label="`${t('reuse.date')}`" prop="date" width="220">
                  <template #default="data">
                    <!-- <ElInput v-model="data.row.date" v-if="data.row.edited" /> -->
                    <div>{{ data.row.date }}</div>
                  </template>
                </el-table-column>
                <el-table-column :label="`${t('reuse.saleName')}`" prop="saleName" width="250">
                  <!-- <template #default="data">
                  <ElInput v-model="data.row.saleName" v-if="data.row.edited" />
                  <div v-else>{{ data.row.saleName }}</div>
                </template> -->
                  <template #default="props">
                    <el-select
                      v-model="props.row.saleName"
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
                    <div v-else>{{ props.row.saleName }}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="`${t('reuse.orderSalesAssign')}`"
                  prop="oderSalesAssign"
                  :rules="rules.oderSalesAssign"
                >
                  <template #default="data">
                    <el-form-item
                      v-if="data && data.$index >= 0"
                      label=" "
                      :prop="'dataList.' + data.$index + '.name'"
                      :rules="[
                        {
                          required: true,
                          message: t('reuse.orderSaleAsignrequired'),
                          trigger: 'blur',
                          max: 2
                        }
                      ]"
                    >
                      <ElInput
                        type="Number"
                        step="5"
                        min="0"
                        v-model="data.row.oderSalesAssign"
                        v-if="data.row.edited"
                      />
                      <div v-else>{{ data.row.oderSalesAssign }}</div>
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
      <el-collapse-item :name="collapse[0].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[0].icon" link />
          <span class="text-center text-xl">{{ t('reuse.saleHistoryCustomerCare') }}</span>
        </template>
        <TableOperator
          ref="formRef"
          :schema="columnProfileCustomer"
          :type="type"
          :id="id"
          @post-data="postData"
          :rules="rules"
        />
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
