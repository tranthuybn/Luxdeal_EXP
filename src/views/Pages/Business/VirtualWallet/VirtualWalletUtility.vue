<script setup lang="ts">
import { useIcon } from '@/hooks/web/useIcon'
import { ElCollapse, ElCollapseItem, ElButton } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { Collapse } from '../../Components/Type'
import { h, reactive, ref } from 'vue'
import TableOperator from '../../Components/TableBase/src/TableOperator.vue'
import { Table } from '@/components/Table'
import { useRouter } from 'vue-router'
import { getCustomerVirtualEWalletList } from '@/api/Business'
const { t } = useI18n()
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })

//get data from router
const router = useRouter()
let id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)

const formVirtualWallet = reactive<FormSchema[]>([
  {
    field: 'Divider',
    label: t('reuse.customerInfo'),
    component: 'Divider'
  },
  {
    field: 'customerCode',
    label: t('reuse.customerCode'),
    component: 'Input',
    colProps: { span: 13 }
  },
  {
    field: 'customerName',
    label: t('reuse.customerName'),
    component: 'Input',
    colProps: { span: 13 }
  },
  {
    field: 'phoneNumber',
    label: t('reuse.phoneNumber'),
    component: 'Input',
    colProps: { span: 13 }
  },
  { field: 'email', label: t('reuse.email'), component: 'Input', colProps: { span: 13 } },
  {
    field: 'Divider2',
    label: t('reuse.statusPoint'),
    component: 'Divider'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    component: 'Radio',
    colProps: { span: 13 },
    componentProps: {
      options: [
        { label: t('reuse.using'), value: true },
        { label: t('reuse.lockPoint'), value: false }
      ]
    }
  }
])
const tableHistoryMoney = [
  {
    field: 'depositAndUsageMethod',
    label: t('reuse.depositAndUsageMethod'),
    minWidth: '250'
  },
  {
    field: 'moneyDeposit',
    label: t('reuse.moneyDeposit'),
    minWidth: '200'
  },
  {
    field: 'moneyUsed',
    label: t('reuse.moneyUsed'),
    minWidth: '130'
  },
  {
    field: 'totalMoney',
    label: t('reuse.total'),
    minWidth: '130'
  },
  {
    field: 'date',
    label: t('reuse.date'),
    minWidth: '130'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '130'
  },
  {
    field: 'operator',
    label: t('reuse.operator'),
    minWidth: '100',
    align: 'center',
    formatter: (record: Recordable, __: TableColumn, cellValue: TableSlotDefault) => {
      return h(
        ElButton,
        {
          style: { margin: 'auto' },
          type: 'danger',
          onClick: () => seeDetail(record, cellValue)
        },
        t('reuse.cancelMoney')
      )
    }
  }
]

const seeDetail = (record: Recordable, data: TableSlotDefault) => {
  console.log(record, data)
}
const collapse: Array<Collapse> = reactive([
  {
    icon: minusIcon,
    name: 'Detail Customer Virtual Wallet',
    title: t('reuse.productInformation'),
    columns: formVirtualWallet
  },
  {
    icon: plusIcon,
    name: 'History Deposit and Usage',
    title: t('reuse.productAttributeTable'),
    columns: tableHistoryMoney,
    tableList: [],
    loading: true
  }
])
let nameCollapse = ''
const collapseChangeEvent = async (val) => {
  if (val && val.length > 0) {
    const collapseItem = collapse.find(
      (element) => ((nameCollapse = val.slice(-1)), element.name == nameCollapse)
    )
    if (collapseItem !== undefined) {
      //await callTableApi(collapseItem)
    }
    collapse.forEach((el) => {
      if (val.includes(el.name)) el.icon = minusIcon
      else if (el.icon == minusIcon) el.icon = plusIcon
    })
  } else {
    collapse.forEach((el) => {
      el.icon = plusIcon
    })
  }
}
const activeName = ref(collapse[0].name)
</script>
<template>
  <el-collapse
    v-model="activeName"
    @change="collapseChangeEvent"
    :class="[
      'bg-[var(--el-color-white)] dark:(bg-[var(--el-color-black)] border-[var(--el-border-color)] border-1px)'
    ]"
    ><el-collapse-item :name="collapse[0].name">
      <template #title>
        <el-button class="header-icon" :icon="collapse[0].icon" link />
        <span class="text-center">{{ collapse[0].title }}</span>
      </template>
      <TableOperator
        :type="type"
        :id="id"
        :schema="collapse[0].columns"
        :removeButton="true"
        :multiple-images="false" /></el-collapse-item
    ><el-collapse-item :name="collapse[1].name"
      ><template #title>
        <el-button class="header-icon" :icon="collapse[1].icon" link />
        <span class="text-center">{{ collapse[1].title }}</span> </template
      ><Table :api="getCustomerVirtualEWalletList" :columns="collapse[1].columns"
        ><template #operator
          ><el-button type="danger">{{ t('reuse.cancelMoney') }}</el-button></template
        ></Table
      ></el-collapse-item
    ></el-collapse
  ></template
>
