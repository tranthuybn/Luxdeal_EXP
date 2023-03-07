<script setup lang="ts">
import { reactive, h } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/TableDataBase.vue'
import { PROMOTION_STRATEGY } from '@/utils/API.Variables'
import { getCampaignList } from '@/api/Business'
import { provide } from 'vue'
import {
  filterPromotionPrice,
  filterSubject,
  filterVoucherType,
  filterVoucherCondition,
  filterTableStatus
} from '@/utils/filters'
import {
  dateTimeFormat,
  formatStatusVoucher,
  formatSubjectVoucher,
  VoucherType
} from '@/utils/format'
import { ElButton } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/store/modules/app'

const { t } = useI18n()
const params = { CampaignType: PROMOTION_STRATEGY[3].key }
provide('parameters', {
  params
})
const columns = reactive<TableColumn[]>([
  {
    field: 'id',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'code',
    label: t('reuse.voucherCode'),
    minWidth: '130',
    headerAlign: 'left',
  },
  {
    field: 'description',
    label: t('reuse.descriptions'),
    minWidth: '250',
    headerAlign: 'left',
  },
  {
    field: 'voucherType',
    label: t('reuse.type'),
    headerAlign: 'left',
    minWidth: '200',
    filters: filterVoucherType,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return VoucherType(cellValue)
    }
  },
  {
    field: 'condition',
    label: t('formDemo.condition'),
    headerAlign: 'left',
    minWidth: '130',
    filters: filterVoucherCondition,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${formatSubjectVoucher(cellValue)}`)
    }
  },
  {
    field: 'targetType',
    label: t('reuse.subject'),
    headerAlign: 'left',
    minWidth: '200',
    filters: filterSubject,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${formatSubjectVoucher(cellValue)}`)
    }
  },
  {
    field: 'reduce',
    label: t('reuse.promotion'),
    headerAlign: 'left',
    minWidth: '150',
    filters: filterPromotionPrice
  },
  {
    field: 'fromDate',
    label: t('reuse.start'),
    minWidth: '130',
    headerAlign: 'left',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'toDate',
    label: t('common.doneLabel'),
    minWidth: '130',
    headerAlign: 'left',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '130',
    headerAlign: 'left',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdBy',
    label: t('reuse.creator'),
    minWidth: '130',
    headerAlign: 'left',
    headerFilter: 'Name'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    headerAlign: 'left',
    filters: filterTableStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
     return t(`${formatStatusVoucher(cellValue)}`)
    }
  },
  {
    field: 'operator',
    label: t('reuse.operator'),
    minWidth: '200',
    headerAlign: 'left',
    formatter: (row: Recordable, __: TableColumn, _cellValue: boolean) => {
      return h('div', { style: 'display:flex;justify-content: center;' }, [
        h(ElButton, { icon: eyeIcon, onClick: () => action(row, 'detail') }),
        h(ElButton, { icon: editIcon, onClick: () => action(row, 'edit') })
      ])
    }
  }
])
const eyeIcon = useIcon({ icon: 'emojione-monotone:eye-in-speech-bubble' })
const editIcon = useIcon({ icon: 'akar-icons:chat-edit' })
const { push } = useRouter()
const router = useRouter()
const appStore = useAppStore()
const Utility = appStore.getUtility
const action = (row: any, type: string) => {
  if (type === 'detail' || type === 'edit' || !type) {
    push({
      name: `${String(router.currentRoute.value.name)}.${Utility}`,
      params: { id: row.id, type: type, tab: row.voucherType }
    })
  }
}
</script>
<template>
  <tableDatetimeFilterBasicVue 
    :columns="columns" :titleAdd="t('formDemo.addNewVoucher')" 
    :api="getCampaignList"
    :customOperator="3" />
</template>
