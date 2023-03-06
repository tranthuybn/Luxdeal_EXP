<script setup lang="ts">
import { h, reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/TableDataBase.vue'
import { ATTACH_DOCUMENT } from '@/utils/API.Variables'
import {  filterStatusGeneral } from '@/utils/filters'
import { getPaymentList } from '@/api/Business'
import { dateTimeFormat, formatStatusGeneral } from '@/utils/format'
import { useRouter } from 'vue-router'
import { ElButton } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useAppStore } from '@/store/modules/app'


const { t } = useI18n()
const { push } = useRouter()
const router = useRouter()
const appStore = useAppStore()
const Utility = appStore.getUtility
const eyeIcon = useIcon({ icon: 'emojione-monotone:eye-in-speech-bubble' })

const action = (row: any, type: string) => {
  if (type === 'detail' || type === 'edit' || !type) {
    push({
      name: `${String(router.currentRoute.value.name)}.${Utility}`,
      params: { id: row.id, type: type, tab: row.voucherType }
    })
  }
}

const columns = reactive<TableColumn[]>([
  {
    field: 'id',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'code',
    label: t('reuse.proposalCode'),
    minWidth: '110',
    headerAlign: "left"
  },
  {
    field: 'description',
    label: t('reuse.reasonSpendMoney'),
    minWidth: '200',
    headerAlign: "left"  
  },
  {
    field: 'totalMoney',
    label: t('reuse.amountOfMoney'),
    minWidth: '130',
    align: 'right',
    sortable: true,
    headerAlign: "left"
  },
  {
    field: 'peopleName',
    label: t('reuse.subject'),
    minWidth: '450',
    filters: '',
    headerAlign: "left"
  },
  {
    field: 'attachDocument',
    label: t('reuse.attachDocument'),
    minWidth: '200',
    filters: '',
    formatter: (_record: Recordable, __: TableColumn, cellValue: TableSlotDefault) => {
      return h(cellValue ? h('div', ATTACH_DOCUMENT[1].label) : h('div', ATTACH_DOCUMENT[0].label))
    },
    headerAlign: "left"
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '130',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    },
    headerAlign: "left"
  },
  {
    field: 'createdBy',
    label: t('reuse.creator'),
    minWidth: '130',
    headerFilter: 'Name',
    headerAlign: "left"
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '130',
    filters: filterStatusGeneral,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return formatStatusGeneral(cellValue)
    },
    headerAlign: "left"
  },
  {
    field: 'operator',
    label: t('reuse.operator'),
    minWidth: '90',
    headerAlign: 'left',
    align: 'center',
    formatter: (row: Recordable, __: TableColumn, _cellValue: boolean) => {
      return h('div', { style: 'display:flex;justify-content: center;' }, [
        h(ElButton, { icon: eyeIcon, onClick: () => action(row, 'detail') }),
      ])
    }
  }

])
</script>
<template>
  <tableDatetimeFilterBasicVue :columns="columns" :api="getPaymentList" :customOperator="4" />
</template>
