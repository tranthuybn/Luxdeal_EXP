<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElTable, ElTableColumn, ElButton, ElPagination } from 'element-plus'
import { getOrderApproval } from '@/api/Approval'
import { API_ORDER } from '@/utils/API.Variables'
import { dateTimeFormat } from '@/utils/format'

const { t } = useI18n()

const route = useRoute()
const { push } = useRouter()
const utility = 'Utility'
let nameRoute = route.name?.toString()
const type = nameRoute?.slice(24, nameRoute.length)

const tableListOrder = ref([])

const getListOrder = async () => {
  try {
    if (type == 'orders-cancel') {
      const res = await getOrderApproval({ ApproveActionType: 0, pageIndex: 1, pageSize: 20 })
      tableListOrder.value = res.data
    } else if (type == 'orders-new') {
      const res = await getOrderApproval({ ApproveActionType: 1, pageIndex: 1, pageSize: 20 })
      tableListOrder.value = res.data
    } else if (type == 'orders-edit') {
      const res = await getOrderApproval({ ApproveActionType: 2, pageIndex: 1, pageSize: 20 })
      tableListOrder.value = res.data
    }
  } catch (e) {
    console.error(e)
  }
}

const detailedBrowsing = (scope: any) => {
  const data = scope.row
  const typeServiceOrder = API_ORDER.find((e) => e.key == data.serviceType)
  push({
    name: `business.order-management.order-list.${utility}`,
    params: {
      type: 'approval-order',
      tab: typeServiceOrder?.label,
      id: data.targetId,
      approvalId: data.id
    }
  })
}

onBeforeMount(() => {
  getListOrder()
})
</script>

<template>
  <div class="bg-white p-4 font-bold text-lg">
    <div class="pb-2">{{
      type == 'orders-new'
        ? t('formDemo.BrowseNewlyCreatedOrders')
        : type == 'orders-edit'
        ? t('formDemo.BrowseEditOrders')
        : t('formDemo.BrowseCanceledOrders')
    }}</div>
    <el-table :data="tableListOrder" border style="width: 100%">
      <el-table-column type="index" width="50" />
      <el-table-column prop="code" :label="t('formDemo.orderCode')" width="150" />
      <el-table-column prop="serviceType" :label="t('formDemo.orderType')">
        <template #default="props">
          {{
            props.row.serviceType == 1
              ? 'Đơn hàng bán'
              : props.row.serviceType == 3
              ? 'Đơn cho thuê'
              : props.row.serviceType == 2
              ? 'Đơn ký gửi'
              : props.row.serviceType == 4
              ? 'Đơn cầm đồ'
              : 'Đơn spa'
          }}
        </template>
      </el-table-column>
      <el-table-column prop="customerName" :label="t('formDemo.customer')" />
      <el-table-column prop="createdAt" :label="t('formDemo.createdAtEdit')" width="180">
        <template #default="props">
          {{ dateTimeFormat(props.row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="createdBy" :label="t('formDemo.createdByEdit')" width="180" />
      <el-table-column
        prop="orderActionName"
        :label="t('formDemo.browsingConditions')"
        width="180"
      />
      <el-table-column prop="status" :label="t('formDemo.status')" width="180" />
      <el-table-column fixed="right" :label="t('formDemo.manipulation')" width="120">
        <template #default="props">
          <el-button @click="() => detailedBrowsing(props)" class="w-[100%]" type="primary">{{
            t('formDemo.BrowseDetails')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination :page-size="20" :pager-count="11" layout="prev, pager, next" :total="1000" />
  </div>
</template>

<style scoped>
::v-deep(.cell) {
  word-break: break-word;
}
::v-deep(.el-table td.el-table__cell div) {
  font-weight: 400;
  color: black;
}
</style>
