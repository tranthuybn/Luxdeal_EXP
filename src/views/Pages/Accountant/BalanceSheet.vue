<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton } from 'element-plus'
import { getAccountantBalanceList } from '@/api/Accountant'
import { useIcon } from '@/hooks/web/useIcon'
import TableType01 from '@/views/Pages/Components/tableType01-datetimefilter-basic.vue'
import { h } from 'vue'
const { t } = useI18n()

const eyeIcon = useIcon({ icon: 'emojione-monotone:eye-in-speech-bubble' })

const seeDetail = (record: Recordable, data: TableSlotDefault) => {
  console.log(record, data)
}
const unitCategories = [
  { field: 'void', width: '50' },
  {
    field: 'accountCode',
    label: t('reuse.accountCode'),
    minWidth: '100'
  },
  {
    field: 'accountName',
    label: t('userDemo.username'),
    minWidth: '150'
  },
  {
    field: 'openingBalance',
    label: t('reuse.openingBalance'),
    children: [
      {
        field: 'openingBalanceOwed',
        label: t('reuse.owed'),
        minWidth: '100',
        align: 'right'
      },
      {
        field: 'openingBalanceCash',
        label: t('reuse.cash'),
        minWidth: '100',
        align: 'right'
      }
    ]
  },
  {
    field: 'arisingInThePeriod',
    label: t('reuse.arisingInThePeriod'),
    children: [
      {
        field: 'owedArisingInThePeriod',
        label: t('reuse.owed'),
        minWidth: '100',
        align: 'right'
      },
      {
        field: 'cashArisingInThePeriod',
        label: t('reuse.cash'),
        minWidth: '100',
        align: 'right'
      }
    ]
  },
  {
    field: 'arisingInTheEndOfPeriod',
    label: t('reuse.arisingInTheEndOfPeriod'),
    children: [
      {
        field: 'owedArisingInTheEndOfPeriod',
        label: t('reuse.owed'),
        minWidth: '100',
        align: 'right'
      },
      {
        field: 'cashArisingInTheEndOfPeriod',
        label: t('reuse.cash'),
        minWidth: '100',
        align: 'right'
      }
    ]
  },
  {
    field: 'status',
    label: t('reuse.operator'),
    minWidth: '100',
    fixed: false,
    align: 'center',
    formatter: (record: Recordable, __: TableColumn, cellValue: TableSlotDefault) => {
      return h(ElButton, {
        style: { margin: 'auto' },
        icon: eyeIcon,
        onClick: () => seeDetail(record, cellValue)
      })
    }
  }
]
</script>
<template>
  <TableType01
    :columns="unitCategories"
    :api="getAccountantBalanceList"
    :selection="false"
    isOperatorColumnCustomize
  />
</template>
<style></style>
