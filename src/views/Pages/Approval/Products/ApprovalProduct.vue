<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { getProductsApproval } from '@/api/Approval'
import { h, reactive } from 'vue'
import TableType01 from '../../Components/TableDataBase.vue'
import { useI18n } from '@/hooks/web/useI18n'
import { filterTableCategory, filterTableStatus } from '@/utils/filters'
import { setImageDisplayInDOm } from '@/utils/domUtils'
import { useRouter } from 'vue-router'
import { ElButton } from 'element-plus'
const { t } = useI18n()
const columns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'productCode',
    label: t('reuse.productCode') + '/' + t('reuse.service'),
    minWidth: '150'
  },
  {
    field: 'productName',
    label: t('reuse.productName'),
    minWidth: '150'
  },
  {
    field: 'description',
    label: t('reuse.description'),
    minWidth: '200'
  },

  {
    field: 'category',
    label: t('reuse.category'),
    minWidth: '150',
    filters: filterTableCategory
  },
  {
    field: 'image',
    label: t('reuse.image'),
    minWidth: '150',
    align: 'center',
    formatter: (record: Recordable, column: TableColumn, cellValue: TableSlotDefault) =>
      setImageDisplayInDOm(record, column, cellValue)
  },
  {
    field: 'createDate',
    label: t('reuse.createDate') + '/' + t('reuse.edit'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'creator',
    label: t('reuse.creator') + '/' + t('reuse.edit'),
    minWidth: '150',
    headerFilter: 'Name'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterTableStatus
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
])

const { push } = useRouter()
const action = (row: any, type: string) => {
  push({
    name: `products-services.productLibrary.Products.${utility}`,
    params: { id: row.id, type: 'detail' }
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
      :columns="columns"
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
