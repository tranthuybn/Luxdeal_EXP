import { useI18n } from '@/hooks/web/useI18n'
import { ref, unref } from 'vue'
import TableType01 from '@/views/Pages/Components/TableBase.vue'
import { reactive } from 'vue'
import { getCustomer } from '@/api/Business'
const tableBase01 = ref<ComponentRef<typeof TableType01>>()
const seeDetail = (...param) => {
  const array = Array.isArray(unref(tableBase01)?.tableObject.tableList)
    ? unref(tableBase01)?.tableObject.tableList
    : []
  if (array && array.length > 0) {
    array.forEach((el) => {
      if (el.id === param[0].id) el['approveOrNot'] = !param[2]
    })
  }
}
const { t } = useI18n()

let optionsApi = reactive([])
export const callApiClassify = async () => {
  const res = await getCustomer('')
  if (res.data && res.data.length > 0) {
    optionsApi = res.data.map((product) => ({
      label: product.name,
      value: product.id
    }))
  }
}

export const columnProfileCustomer = reactive<FormSchema[]>([
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
      placeholder: t('reuse.enterPrise'),
      options: optionsApi
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
      options: [
        {
          label: 'CustomerName 1',
          value: '1'
        },
        {
          label: 'CustomerName 2',
          value: '2'
        }
      ]
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
    field: 'representative',
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
    field: 'phoneNumber',
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
      placeholder: t('reuse.firstTime')
    },
    colProps: {
      span: 20
    }
  },
  {
    field: 'initializeData',
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
          value: '1'
        },
        {
          label: t('reuse.offline'),
          value: '2'
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
      style: 'width: 100%'
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
      style: 'width: 100%'
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
      multiple: true,
      placeholder: t('reuse.selectService'),
      style: 'width: 100%',
      options: [
        {
          label: 'Service 1',
          value: '1'
        },
        {
          label: 'Service 2',
          value: '2'
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
      multiple: true,
      placeholder: t('reuse.selectOrder'),
      style: 'width: 100%',
      options: [
        {
          label: 'Order 1',
          value: '1'
        },
        {
          label: 'Order 2',
          value: '2'
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
