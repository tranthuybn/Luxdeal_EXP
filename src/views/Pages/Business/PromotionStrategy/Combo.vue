<script setup lang="ts">
import { provide, reactive, h } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/TableDataBase.vue'
import { getCampaignList } from '@/api/Business'
import { filterCampaignStatus, filterVoucherCondition } from '@/utils/filters'
import { dateTimeFormat, formatStatusVoucher, formatSubjectVoucher } from '@/utils/format'
import { PROMOTION_STRATEGY } from '@/utils/API.Variables'

import { useRouter } from 'vue-router'
import { ElButton } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useAppStore } from '@/store/modules/app'

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



const { t } = useI18n()
const params = { CampaignType: PROMOTION_STRATEGY[4].key }
provide('parameters', {
  params
})

const columns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'code',
    label: t('reuse.comboCode'),
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
    field: 'spaService',
    label: t('reuse.spaService'),
    headerAlign: 'left',
    minWidth: '200',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        // assuming `items` is a ref with array value
        row?.productProperties.map((item) => {
          if (item.code) {
            return h('p', `${item.spaServiceNames}`)
          }
        })
      )
    }
  },
  {
    field: 'condition',
    label: t('formDemo.condition'),
    minWidth: '130',
    headerAlign: 'left',
    filters: filterVoucherCondition,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return t(`${formatSubjectVoucher(cellValue)}`)
    }
  },
  {
    field: 'productCode',
    label: t('reuse.productCode'),
    minWidth: '200',
    headerAlign: 'left',
    formatter: (row, _column, _cellValue, _index) => {
      return h(
        'ul',
        // assuming `items` is a ref with array value
        row?.productProperties.map((item) => {
          if (item.code) {
            return h('span', `${item.code}`)
          }
        })
      )
    }
  },
  {
    field: 'spaService',
    label: t('reuse.cost'),
    headerAlign: 'left',
    sortable: true,
    minWidth: '200',
  },
  {
    field: 'spaService',
    label: t('reuse.comboPrice'),
    headerAlign: 'left',
    sortable: true,
    minWidth: '200',
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
    filters: filterCampaignStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
     return t(`${formatStatusVoucher(cellValue)}`)
    }
  },
  {
    field: 'operator',
    label: t('reuse.operator'),
    minWidth: '150',
    headerAlign: 'left',
    align: 'center',
    formatter: (row: Recordable, __: TableColumn, _cellValue: boolean) => {
      return h('div', { style: 'display:flex;justify-content: center;' }, [
        h(ElButton, { icon: eyeIcon, onClick: () => action(row, 'detail') }),
        h(ElButton, { icon: editIcon, onClick: () => action(row, 'edit') })
      ])
    }
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue :columns="columns" :api="getCampaignList" :customOperator="5" />
</template>
