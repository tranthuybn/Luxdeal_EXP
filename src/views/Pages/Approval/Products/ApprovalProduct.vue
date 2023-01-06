<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { getProductsApproval } from '@/api/Approval'
import { h } from 'vue'
import TableType01 from '../../Components/TableDataBase.vue'
import { useI18n } from '@/hooks/web/useI18n'
import { filterTableCategory, filterTableStatus } from '@/utils/filters'
import { setImageDisplayInDOm } from '@/utils/domUtils'
import { useRouter } from 'vue-router'
import { ElButton } from 'element-plus'
import { businessStatusTransferToText, dateTimeFormat } from '@/utils/format'
const { t } = useI18n()

const columnsApprovalProduct = [
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'categoryName',
    label: t('reuse.productCode') + '/' + t('reuse.service'),
    minWidth: '150'
  },
  {
    field: 'name',
    label: t('reuse.productName') + '/' + t('reuse.service'),
    minWidth: '250'
  },
  {
    field: 'description',
    label: t('reuse.description'),
    minWidth: '250',
    formatter: (_: Recordable, __: TableColumn, cellValue: any) => {
      return h('span', { innerHTML: cellValue })
    }
  },
  {
    field: 'categories[1]?.value',
    label: t('reuse.category'),
    minWidth: '150',
    filters: filterTableCategory
  },
  {
    field: 'productImages[0]?.path',
    label: t('reuse.image'),
    minWidth: '150',
    align: 'center',
    formatter: (record: Recordable, column: TableColumn, _cellValue: TableSlotDefault) =>
      setImageDisplayInDOm(record, column, record.image)
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate') + '/' + t('reuse.edit'),
    minWidth: '150',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'createdBy',
    label: t('reuse.creator') + '/' + t('reuse.edit'),
    minWidth: '150',
    headerFilter: 'Name'
  },
  {
    field: 'conditions',
    label: t('reuse.approveCondition'),
    minWidth: '150'
  },
  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterTableStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return h('div', businessStatusTransferToText(cellValue))
    }
  },
  {
    field: 'operator',
    label: t('reuse.operator'),
    minWidth: '200',
    formatter: (row: Recordable, __: TableColumn, _cellValue: boolean) => {
      return h('div', { class: 'btn-detail_Approval' }, [
        h(ElButton, { type: 'primary', onClick: () => action(row, 'detail') }, 'Duyệt chi tiết '),
        h('span', { class: 'arrowRight' })
      ])
    }
  }
]

const { push } = useRouter()
const action = (row: any, _type: string) => {
  console.log('row: ', row)
  push({
    name: `products-services.productLibrary.Products.${utility}`,
    params: { id: row.targetId, type: 'detail' }
  })
}
const utility = 'Utility'
</script>
<template>
  <ContentWrap
    class="relative"
    :title="t('reuse.browseNewlyLaunchedProducts')"
    :message="t('reuse.browseNewlyLaunchedProducts')"
  >
    <TableType01
      :columns="columnsApprovalProduct"
      :api="getProductsApproval"
      isOperatorColumnCustomize
      :selection="false"
      :removeHeaderFilter="true"
      :customOperator="3"
    />
  </ContentWrap>
</template>

<style scoped>
::v-deep(.arrowRight) {
  position: relative;
  height: 0;
  right: 20px;
  top: 12px;
}
::v-deep(.btn-detail_Approval) {
  display: flex;
  justify-content: center;
}

::v-deep(.btn-detail_Approval > button) {
  padding: 8px 24px 8px 10px;
}
</style>
