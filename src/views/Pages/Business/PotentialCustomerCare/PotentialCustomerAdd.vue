<script setup lang="ts">
import { TableOperator } from '../../Components/TableBase'
import { getBranchList } from '@/api/HumanResourceManagement'
import {
  addNewPotentialCustomer,
  getPotentialCustomerById,
  updatePotentialCustomer,
  UpdatePotentialCustomerHistory,
  deletePotentialCustomer,
  deletePotentialCustomerHistory,
  getOrderList,
  getEmployeeRatingList,
  getPotentialCustomerList
} from '@/api/Business'
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import { useValidator } from '@/hooks/web/useValidator'
import { onBeforeMount, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/hooks/web/useI18n'
import moment from 'moment'
import {
  ElInput,
  ElCollapse,
  ElCollapseItem,
  ElButton,
  ElTable,
  ElTableColumn,
  ElDatePicker,
  ElForm,
  ElFormItem,
  ElNotification,
  FormInstance,
  ElMessageBox
} from 'element-plus'
import { orderType, dateTimeFormat } from '@/utils/format'
import {ComponentOptions, tableChildren, tableDataType, potentialCustomerInfo, potentialCustomerHistoryInfo, setFormCustomData } from './type.d'
import InfinitOptions from '@/components/Select/InfinitOptions.vue'

const pageIndex = ref(1)
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const { required, ValidService, requiredOption, checkLength } = useValidator()
const { t } = useI18n()
const percentIcon = useIcon({ icon: 'material-symbols:percent' })
const tableData = ref<tableDataType[]>([])
const ExpandedRow = ref([])
const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const indexSale = ref(0)
const type = router.currentRoute.value.params.type == ':type' ? 'add' : String(router.currentRoute.value.params.type)
const rules = reactive({
  classify: [required(), requiredOption()],
  supplier: [required(), requiredOption()],
  companyName: [requiredOption()],
  taxCode: [requiredOption()],
  customerName: [required()],
  phonenumber: [required(), ValidService.checkPhone],
  email: [ValidService.checkEmail],
  serviceDetails: [{
    validator: (...config) => checkLength(config, 0, 256)
  }]
})
const changePhoneNumber = ref(false)
const activeName = ref('collapse[0].name')

const customPostDataHistory = (data) => {
  const customDataHistory = {} as potentialCustomerHistoryInfo
  customDataHistory.id = id
  customDataHistory.staffId = data.staffId
  customDataHistory.content = data.content
  customDataHistory.percentageOfSales = data.percentageOfSales
  return customDataHistory
}

const handleSave = async (row) => {
  row.edited = false
  if (type == 'edit') {
    row = customPostDataHistory(row)
    row.percentageOfSales = Number(row.percentageOfSales)
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
const handleEdit = async (row) => {
  row.edited = true
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
const handleDelete = async (payload) => {
  if (type == 'add') tableData.value.splice(payload, 1)
  if (type == 'edit') {
    const haveHistoryCare = tableData.value[payload].family[0].customerCareContent
    if(haveHistoryCare) {
      ElNotification({
          message: t('reuse.cantDeleteSale'),
          type: 'warning'
      })
      return
    }
    ElMessageBox.confirm(t('reuse.deleteWarning'), t('reuse.deleteCustomerCareHistory'), {
      confirmButtonText: t('reuse.confirm'),
      cancelButtonText: t('reuse.cancel'),
      type: 'info'
    })
    .then(async () => {
      await deletePotentialCustomer({ ...payload })
      .then(() =>
        {
          ElNotification({
          message: t('reuse.deleteSuccess'),
          type: 'success'
          })
          tableData.value.splice(payload, 1)
        }
      )
      .catch(() =>
        ElNotification({
          message: t('reuse.deleteFail'),
          type: 'warning'
        })
      )
    })
    .catch(() => {
      ElNotification({
          message: t('reuse.deleteCancel'),
          type: 'info'
      })
    })
  }
}

const handleItemDelete = async (payload, scope) => {
  if (type == 'add') tableData.value[scope.$index].family.splice(payload, 1)
  if (type == 'edit') {
    const overdueTime = tableData.value[scope.$index].family[payload].date
    const momentDate =  moment(overdueTime).startOf('day')
    const currentDate = moment().startOf('day')
    if(momentDate.isBefore(currentDate)) {
      ElNotification({
          message: t('reuse.overdueTimeCantDelete'),
          type: 'warning'
      })
      return
    }
    ElMessageBox.confirm(t('reuse.deleteWarning'), t('reuse.deleteCustomerCareContent'), {
      confirmButtonText: t('reuse.confirm'),
      cancelButtonText: t('reuse.cancel'),
      type: 'info'
    })
     .then(async () => {
        await deletePotentialCustomerHistory({ ...payload })
        .then(() =>
          {
            ElNotification({
              message: t('reuse.deleteSuccess'),
              type: 'success'
            })
            tableData.value[scope.$index].family.splice(payload, 1)
          }
        )
        .catch(() =>
          ElNotification({
            message: t('reuse.deleteFail'),
            type: 'warning'
          })
        )
      })
      .catch(() => {
        ElNotification({
          message: t('reuse.deleteCancel'),
          type: 'info'
        })
      })
  }

}
const size = ref<'' | 'large' | 'small'>('')

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

const getMapOrderData =  ({code, serviceType, userName, createdAt,createdBy , id}) => ({
  label: code,
  serviceType: t(`${orderType(serviceType)}`),
  userName,
  createdAt: dateTimeFormat(createdAt),
  createdBy,
  value: id
})
const getMapCustomerData = ({name, id, phonenumber, service}) => ({
  label: name,
  phonenumber,
  service:  t(`${orderType(service)}`),
  value: id
})

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
    value: false,
    componentProps: {
      style: 'width: 100%',
      allowCreate: true,
      filterable: true,
      onChange: (data) => {
        changeValueClassify(data)
      },
      placeholder: t('reuse.personal'),
      options: [
        {
          label: t('reuse.personal'),
          value: false
        },
        {
          label: t('reuse.enterPrise'),
          value: true
        }
      ]
    },
    colProps: {
      span: 7
    }
  },
  {
    field: 'supplier',
    label: '',
    component: 'Select',
    value: t('reuse.customer'),
    componentProps: {
      allowCreate: true,
      filterable: true,
      style: 'width: 100%',
      options: [
        {
          value: 1,
          label: t('reuse.customer')
        },
        {
          value: 2,
          label: t('reuse.supplier')
        },
        {
          value: 3,
          label: t('formDemo.joint')
        }
      ]
    },
    formItemProps: {
      labelWidth: '0'
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'customerName',
    label: t('reuse.customerName'),
    component: 'SelectMultipleOption',
    componentProps: {
      fields: [t('reuse.customerName'), t('reuse.phoneNumber'), t('reuse.customerService')],
      placeholder: t('formDemo.enterCustomerName'),
      allowCreate: true,
      valueKey: "value" ,
      labelKey: "label",
      keyToRemoteSearch: 'Search',
      hiddenKey: ['value'],
      params: {IsOrganization: 0},
      mapFunction: getMapCustomerData,
      api: getPotentialCustomerList,
      onChange: fillCustomerInfo,
      onBlur: setCustomerName,
    },
    colProps: {
      span: 13
    },
  },
  {
    field: 'companyName',
    label: t('reuse.companyName'),
    component: 'SelectMultipleOption',
    componentProps: {
      allowCreate: true,
      fields: [t('reuse.customerName'), t('reuse.phoneNumber'), t('reuse.customerService')],
      placeholder: t('reuse.enterSelectCompanyName'),
      valueKey: "value" ,
      keyToRemoteSearch: 'Search',
      labelKey: "label",
      hiddenKey: ['value'],
      params: {IsOrganization: 1},
      mapFunction: getMapCustomerData,
      api: getPotentialCustomerList,
      onChange: fillCustomerInfo,
      onBlur: setCustomerName
    },
    colProps: {
      span: 13
    },
    hidden: true
  },
  {
    field: 'taxCode',
    label: t('reuse.taxCode'),
    component: 'Input',
    value: '',
    hidden: true,
    componentProps: {
      style: 'width: 100%',
      // allowCreate: true,
      // filterable: true,
      placeholder: t('reuse.enterSelectTaxCode')
    },
    colProps: {
      span: 13
    }
  },
  {
    field: 'representative',
    label: t('reuse.representative'),
    hidden: true,
    component: 'Input',
    componentProps: {
      placeholder: t('reuse.enterRepresentativeName')
    },
    colProps: {
      span: 13
    }
  },

  {
    field: 'phonenumber',
    label: t('reuse.phoneNumber'),
    component: 'SelectMultipleOption',
    componentProps: {
      fields: [t('reuse.customerName'), t('reuse.phoneNumber'), t('reuse.customerService')],
      placeholder: t('reuse.enterPhoneNumber'),
      allowCreate: true,
      valueKey: "value" ,
      labelKey: "phonenumber",
      hiddenKey: ['value'],
      mapFunction: getMapCustomerData,
      api: getPotentialCustomerList,
      onChange: fillCustomerInfo,
      onBlur: setCustomerPhoneNumber,
      onClick : setCustomerPhoneNumber
    },
    colProps: {
      span: 13
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
      span: 13
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
      span: 13
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
    value: 219,
    componentProps: {
      allowCreate: true,
      filterable: true,
      style: 'width: 100%',
      placeholder: t('reuse.firstTime'),
      options: [
        {
          label: t('reuse.firstTime'),
          value: 219
        },
        {
          label: t('reuse.transacted'),
          value: 220
        }
      ]
    },
    colProps: {
      span: 13
    }
  },
  {
    field: 'isOnline',
    label: t('reuse.online') + '/' + t('reuse.offline'),
    component: 'Select',
    title: 'katsuke',
    value: false,
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
      span: 13
    }
  },
  {
    field: 'customerContactChannel',
    label: t('reuse.approachingChannel'),
    component: 'Select',
    value: 222,
    componentProps: {
      allowCreate: true,
      filterable: true,
      placeholder: t('reuse.enterSelectOutreachChannel'),
      style: 'width: 100%',
      options: [
        {
          label: t('reuse.zalo'),
          value: 221
        },
        {
          label:  t('reuse.facebook'),
          value: 222
        }
      ]
    },
    colProps: {
      span: 13
    }
  },
  {
    field: 'newCustomerSource',
    label: t('reuse.originated'),
    component: 'Select',
    value: 223,
    componentProps: {
      allowCreate: true,
      filterable: true,
      placeholder: t('reuse.enterSelectSource'),
      style: 'width: 100%',
      options: [
        {
          label: t('reuse.selfArrivingGuests'),
          value: 223
        },
        {
          label: t('reuse.passersby'),
          value: 224
        }
      ]
    },
    colProps: {
      span: 13
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
      span: 13
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
          label: t('reuse.pawn'),
          value: 4
        },
        {
          label: t('workplace.spa'),
          value: 5
        }
      ]
    },
    colProps: {
      span: 13
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
      span: 13
    }
  },
  {
    field: 'resultAndStatus',
    label: t('reuse.resultsAndStatus'),
    component: 'Divider'
  },
  {
    field: 'result',
    label: t('reuse.result'),
    component: 'SelectMultipleOption',
    componentProps: {
      fields: [t('reuse.orderCode'),t('formDemo.orderType'),t('reuse.customerName'), t('reuse.createDate'), t('reuse.creator')],
      valueKey: "value" ,
      labelKey: "label",
      hiddenKey: ['value'],
      keyToRemoteSearch: 'Keyword',
      mapFunction: getMapOrderData,
      api: getOrderList,
    },
    colProps: {
      span: 13
    }
  },
  {
    field: 'status',
    label: t('reuse.status'),
    component: 'Radio',
    value: 1,
    colProps: {
      span: 13
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
      ],
    }
  }
])

async function getParamsOrder(customerName) {
  formRef.value?.setSchema([
    {
      field: 'result',
      path: 'componentProps.params',
      value: {Keyword: customerName}
    }
  ])
}

function setCustomerName({target}) {
  formRef.value?.setValues({
    companyName: target.value,
    customerName: target.value,
  })
}
async function setCustomerPhoneNumber({target}) {
  formRef.value?.setValues({
    phonenumber: target.value,
  })
  const existCustomer = await checkPhoneNumberExist()
  if(existCustomer) fillCustomerInfo(existCustomer) 
}

async function checkPhoneNumberExist() {
  const formData = await formRef.value?.getFormData()
  if(formData?.phonenumber && formData?.phonenumber.length === 10) {
    const existedCustomer = await getPotentialCustomerList({Search: formData.phonenumber})
    if(existedCustomer && existedCustomer.data.length > 0) { 
      return existedCustomer.data[0]?.id 
    }
    else{
      if(type === 'edit') {
        ElMessageBox.confirm(t('reuse.changePhoneNumberAlert'), t('reuse.updateCustomerPhoneNumber'), {
          confirmButtonText: t('reuse.confirm'),
          cancelButtonText: t('reuse.cancel'),
          type: 'info'
        })
        .then(() => {
          changePhoneNumber.value = true
        })
        .catch(() => {

        })
      }
    }
  }
}

async function fillCustomerInfo (id) {
  if(id) {
    ElMessageBox.confirm(t('reuse.getAvailableCustomer'), t('reuse.availableCustomer'), {
      confirmButtonText: t('reuse.confirm'),
      cancelButtonText: t('reuse.cancel'),
      type: 'info'
    })
    .then(async () => {
      await getPotentialCustomerById({Id: id})
      .then(({data}) => {
        formRef.value?.setValues({
          supplier: data.supplier || 1,
          taxCode: data.taxCode,
          companyName: data.name,
          customerName: data.name,
          representative: data.representative,
          phonenumber: data.phonenumber,
          email: data.email,
          link: data.link,
          transactionHistory: 220,
          isOnline: data.isOnline,
          accessChannel: data.accessChannel,
          newCustomerSource: data.source,
          Note: data.note,
          serviceDetails: data.serviceDetails,
          result: data.customerOrderId,
          status: data.statusId
        })
        getParamsOrder(data.name)
      })
      .catch(() => {
        ElNotification({
          message: t('reuse.cantFindData'),
          type: 'warning'
        })
      })
    })
    .catch(() => {
      formRef.value?.setValues({
        phonenumber: '',
      })
    })
  }
}
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
const changeValueClassify = (data) => {
    if(data == true){
      columnProfileCustomer[3].hidden = true
      columnProfileCustomer[4].hidden = false
      columnProfileCustomer[5].hidden = false
      columnProfileCustomer[6].hidden = false
    }else{ 
      columnProfileCustomer[3].hidden = false
      columnProfileCustomer[4].hidden = true
      columnProfileCustomer[5].hidden = true
      columnProfileCustomer[6].hidden = true
    }
    clearData()
}

const clearData = () => {
  formRef.value?.setValues({})
}

// get list company
let cutomerOptions = ref<Array<ComponentOptions>>([])
const getSaleOptions = async () => {
  if (cutomerOptions.value.length === 0) {
    const res = await getEmployeeRatingList({ PageIndex: 1, PageSize: 2000 })
    if (res && res.data.length > 0) {
      cutomerOptions.value = res.data.map((data) => ({
        label: data.employeeName,
        value: data.id,
        tax: data?.taxCode,
        phonenumber: data?.phonenumber,
        email: data?.email
      }))
    }
  }
  if (cutomerOptions.value!.length > 0) {
    if (columnProfileCustomer[4].componentProps?.options !== undefined) {
      columnProfileCustomer[4].componentProps.options = cutomerOptions.value
    }
  }
}
const getMapData = ({employeeCode, employeeName, id}) => ({employeeCode, label: employeeName, value: id})
const formRef = ref<InstanceType<typeof TableOperator>>()

const form = ref<FormInstance>()


onBeforeMount(async () => {
  await getSaleOptions()
})
// add history for sale
const historyRow = reactive<tableDataType>({
  id: id,
  indexSale: 1,
  staffId: '',
  staffName: '',
  content: '',
  createdAt: '',
  date: '',
  percentageOfSales: 0,
  manipulation: '',
  edited: true,
  family: []
})

const addNewSale = () => {
  const tempObj = { ...historyRow }
  tempObj.indexSale =  tableData.value.length + 1
  tempObj.content =  ''
  tempObj.date = moment().format('YYYY/MM/DD')
  tempObj.family = [
    {
      date: moment().format('YYYY/MM/DD'),
      customerCareContent: '',
      editedChild: true
    }
  ]
  tableData.value.push(tempObj)
}

//custom form data

const emptyFormCustom = {} as setFormCustomData
const formDataCustomize = ref(emptyFormCustom)
//set form value
const customizeData = (formData) => {
  formDataCustomize.value.email = formData.email
  formDataCustomize.value.phonenumber = formData.phonenumber
  formDataCustomize.value.link = formData.link
  formDataCustomize.value.representative = formData.representative
  formDataCustomize.value.isOnline = formData.isOnline
  formDataCustomize.value.taxCode = formData.taxCode
  formDataCustomize.value.serviceDetails = formData.serviceDetail
  formDataCustomize.value.customerContactChannel = formData.accessChannel
  formDataCustomize.value.transactionHistory = formData.historyTransaction
  formDataCustomize.value.Note = formData.note
  formDataCustomize.value.newCustomerSource = formData.source
  formDataCustomize.value.result = formData.customerOrderId
  formDataCustomize.value.supplier = formData.supplier || 1
  formDataCustomize.value.customerName = formData.name
  formDataCustomize.value.companyName = formData.name
  formDataCustomize.value.classify = formData.isOrganization
  formDataCustomize.value.service = formData.service
  formDataCustomize.value.status = formData.statusId
  //tableData.value = formData.potentialCustomerHistorys[0] ? formData.potentialCustomerHistorys : []
  const result : Array<tableDataType> = Object.values(formData.potentialCustomerHistorys.reduce((acc, curr) => {
      const key = curr.staffId;
      if (!acc[key]) {
        indexSale.value++
        acc[key] = {
          indexSale: indexSale.value,
          date: curr.createdAt,
          createdAt: curr.createdAt,
          staffId: curr.staffId,
          content: curr.content,
          percentageOfSales: curr.percentageOfSales,
          id: curr.id,
          family: [],
        };
      }
      acc[key].family.push({
        date: curr.createdAt,
        customerCareContent: curr.content,
      });
      return acc;
    }, {}));
  tableData.value = result.reverse()
  changeValueClassify(formDataCustomize.value.classify)
}

// data update api
const customData = (data) => {
  const potentialSaleList = reactive<Array<potentialCustomerHistoryInfo>>([])
  if (tableData.value.length > 0) {
    tableData.value.forEach((element) => {
      if (element.family && Array.isArray(element.family) && element.family.length > 0)
        element.family.forEach((ChildEl) => {
          potentialSaleList.push({
            id: element.indexSale,
            staffId: element.staffId,
            content: ChildEl?.customerCareContent ?? '',
            percentageOfSales: Number(element.percentageOfSales)
          })
        })
    })
  }

  const customData = {} as potentialCustomerInfo
  customData.id = id
  customData.isOrganization = data.classify
  customData.name = data.classify ? data.companyName : data.customerName
  customData.supplier = data.supplier || 1
  customData.userName = data.userName
  customData.code = data.code
  customData.phonenumber = data.phonenumber
  customData.email = data.email
  customData.link = data.link
  customData.taxCode = data.taxCode
  customData.isOnline = data.isOnline
  customData.accessChannel = data.customerContactChannel
  customData.source = data.newCustomerSource
  customData.note = data.Note
  customData.service = data.service || 1
  customData.serviceDetail = data.serviceDetails
  customData.customerOrderId = data.result
  customData.statusId = data.status
  customData.total = 0
  customData.representative = data.representative
  customData.historyTransaction = data.transactionHistory
  customData.potentialCustomerHistorys = potentialSaleList
  customData.OrderCode  = ''
  return customData
}

const postData = async (data) => {
  data = customData(data)
  await addNewPotentialCustomer(data)
    .then(() => {
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      })
      router.push({
        name: `business.potential-customer-care.potential-customer-list`
      })
    })
    .catch(({response}) => {
      console.log('error', response.data)
      ElNotification({
        message: response.data.message,
        type: 'warning'
      })
    })
}
const editData = async (data) => {
  if(changePhoneNumber.value) {
    postData(data)
    return
  }
  data = customData(data)
  await updatePotentialCustomer(data)
    .then(() => {
      ElNotification({
        message: t('reuse.updateSuccess'),
        type: 'success'
      })
      router.push({
        name: `business.potential-customer-care.potential-customer-list`
      })
    })
    .catch(() =>
      ElNotification({
        message: t('reuse.updateFail'),
        type: 'warning'
      })
    )
}

const disabledForm = ref(false)
const btnAddSale = ref(false)
watch(
  () => type,
  () => {
    if(type == 'detail'){
      btnAddSale.value = true
    }

    if(type == 'edit'){
      if (columnProfileCustomer[21].componentProps !== undefined) {
        columnProfileCustomer[21].componentProps.disabled = false
      }
    }
  },
  {
    deep: true,
    immediate: true
  }
)
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
        <el-form class="px-4" ref="form" :disabled="disabledForm" label-width="20px">
          <el-table
            :data="tableData"
            :border="true"
            :expand-row-keys="ExpandedRow"
            row-key="id"
          >
            <el-table-column type="expand">
              <template #default="props">
                <div class="my-5">
                  <h3 class="font-medium text-lg text-center py-4">
                    {{ t('reuse.historySaleCustomerCare') }}
                  </h3>
                  <div class="flex w-[100%] justify-center">
                    <el-table fixed class="flex justify-center" :data="props.row.family" :border="true">
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
                        width="150"
                      >
                        <template #default="child">
                          <el-button
                            v-if="child.row.editedChild"
                            type="primary"
                            size="default"
                            :disabled="btnAddSale"
                            @click.prevent="handleItemEdit(child, props)"
                          >
                            {{ t('reuse.save') }}
                          </el-button>
                          <el-button
                            v-else
                            size="default"
                            :disabled="btnAddSale"
                            @click="handleItemEdit(child, props)"
                            >{{ t('formDemo.edit') }}</el-button
                          >
                          <el-button
                            size="default"
                            type="danger"
                            :disabled="btnAddSale"
                            @click="handleItemDelete(child.$index, props)"
                            >{{ t('reuse.delete') }}</el-button
                          >
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                  <div class="flex w-[100%] justify-center">
                    <div class="w-[1040px]"><el-button
                        class="mt-4 w-36"
                        :disabled="btnAddSale"
                        @click="addActions(props.$index)"
                        >+ {{ t('reuse.addActions') }}
                      </el-button>
                      </div
                    >
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              :label="`${t('reuse.sale')}`"
              prop="indexSale"
              class="text-black font-bold"
              min-width="150"
            >
              <template #default="data">
                Sale {{ data.row.indexSale }}
              </template>
            </el-table-column>
            <el-table-column :label="`${t('reuse.lastContent')}`" prop="content" min-width="500">
              <template #default="scope">
                <!-- <el-input v-model="scope.row.lastContent" v-if="scope.row.edited" /> -->
                <div>{{ scope.row.content }}</div>
              </template>
            </el-table-column>
            <el-table-column :label="`${t('reuse.date')}`" prop="createdAt" min-width="220">
              <template #default="data">
                <!-- <ElInput v-model="data.row.date" v-if="data.row.edited" /> -->
                <div> {{ dateTimeFormat(data.row.createdAt) }}</div>
              </template>
            </el-table-column>
            <el-table-column :label="`${t('reuse.saleName')}`" prop="staffId" min-width="250">
              <template #default="props">
                <InfinitOptions 
                  :fields="[t('reuse.employeeCode'),t('reuse.employeeName')]"
                  valueKey="value" 
                  labelKey="label"
                  :hiddenKey="['value']"
                  :clearable="false"
                  :pageIndex="pageIndex"
                  :disabled="!props.row.edited"
                  :type="type"
                  :api="getEmployeeRatingList"
                  :mapFunction="getMapData"
                  :defaultValue="props.row.staffId"
                  @update-value="(_value, option) => props.row.staffId = option.value"
                />
              </template>
            </el-table-column>
            <el-table-column
              :label="`${t('reuse.orderSalesAssign')}`"
              prop="percentageOfSales"
              min-width="200"
            >
              <template #default="data">
                <el-form-item
                  v-if="data && data.$index >= 0"
                  label=" "
                  :prop="'dataList.' + data.$index + '.name'"
                  style="margin: 0"
                  size="large"
                >
                  <el-input
                    controls-position="right"
                    v-model="data.row.percentageOfSales"
                    :suffix-icon="percentIcon"
                    type="number"
                    max="100"
                    min="0"
                    v-if="data.row.edited"
                  />
                  <div v-else>{{ data.row.percentageOfSales }}</div>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column :label="`${t('formDemo.manipulation')}`" min-width="150" prop="manipulation">
              <template #default="scope">
                <el-button
                  v-if="scope.row.edited"
                  type="primary"
                  size="default"
                  :disabled="btnAddSale"
                  @click.prevent="handleSave(scope.row)"
                >
                  {{ t('reuse.save') }}
                </el-button>
                <el-button
                  v-else
                  size="default"
                  :disabled="btnAddSale"
                  @click.prevent="handleEdit(scope.row)"
                >
                  {{ t('formDemo.edit') }}
                </el-button>
                <el-button
                  type="danger"
                  size="default"
                  :disabled="btnAddSale"
                  @click.prevent="handleDelete(scope.$index)"
                >
                  {{ t('reuse.delete') }}
                </el-button>
              </template>
            </el-table-column>
            </el-table>
        </el-form>
        <el-button class="mt-4 w-32 mx-4" @click="addNewSale" :disabled="btnAddSale"> 
          + {{ t('reuse.addSale') }} 
        </el-button>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style lang="less" scoped>

::v-deep(.btn-wrap) {
    margin-left: 127px;
  }
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
  margin-bottom: 20px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

</style>
