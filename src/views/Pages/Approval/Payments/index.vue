<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElTable, ElTableColumn, ElButton, ElPagination } from 'element-plus'
import { getOrderPayments } from '@/api/Approval'

const { t } = useI18n()

const route = useRoute()
const { push } = useRouter()
const utility = 'Utility'
let nameRoute = route.name?.toString()
const type = nameRoute?.slice(24, nameRoute.length)

const tableListOrder = ref([])

const getListOrder = async () => {
  try {
    const res = await getOrderPayments({ pageIndex: 1, pageSize: 20 })
    tableListOrder.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const detailedBrowsing = (_scope: any) => {
  push({
    name: `business.order-management.order-list.${utility}`,
    params: { type: 'detail', tab: 'orderSell', id: 147 }
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
      <el-table-column
        prop="PaymentRequestCode"
        :label="t('formDemo.PaymentRequestCode')"
        width="100"
      />
      <el-table-column prop="TypeOfferPayment" :label="t('formDemo.TypeOfferPayment')" />
      <el-table-column prop="customer" :label="t('formDemo.customer')" />
      <el-table-column prop="createdAt" :label="t('formDemo.createdAtEdit')" width="180" />
      <el-table-column prop="createdBy" :label="t('formDemo.createdByEdit')" width="180" />
      <el-table-column
        prop="browsingConditions"
        :label="t('formDemo.browsingConditions')"
        width="180"
      />
      <el-table-column prop="status" :label="t('formDemo.status')" width="180" />
      <el-table-column fixed="right" :label="t('formDemo.manipulation')" width="150">
        <template #default="props">
          <el-button @click="() => detailedBrowsing(props)" type="primary"
            ><span class="text-sm">{{ t('formDemo.BrowseDetails') }} ></span>
          </el-button>
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
