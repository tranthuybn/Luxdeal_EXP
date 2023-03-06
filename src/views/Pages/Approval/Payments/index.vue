<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElTable, ElTableColumn, ElButton, ElPagination } from 'element-plus'
import { getOrderPayments } from '@/api/Approval'
import { appModules } from '@/config/app'
const { utility } = appModules
const { t } = useI18n()

const changeMoney = new Intl.NumberFormat('vi', {
  style: 'currency',
  currency: 'vnd',
  minimumFractionDigits: 0
})

const route = useRoute()
const { push } = useRouter()
let nameRoute = route.name?.toString()
const type = nameRoute?.slice(25, nameRoute.length)

console.log('type: ', type)
const tableDNTT = ref([])
const tablePTC = ref([])

const getListOrder = async () => {
  try {
    if (type == 'proposal') {
      const res = await getOrderPayments({ IsPayment: false, pageIndex: 1, pageSize: 20 })
      tableDNTT.value = res.data
    } else {
      const res = await getOrderPayments({ IsPayment: true, pageIndex: 1, pageSize: 20 })
      tablePTC.value = res.data
    }
  } catch (e) {
    console.error(e)
  }
}

const detailedBrowsing = (scope: any) => {
  if (type != 'proposal') {
    push({
      name: `accountant.receipts-expenditures.receipts-expenditures-list.${utility}`,
      params: { type: 'detail', id: scope.row.targetId }
    })
  } else {
    push({
      name: `accountant.payment-proposal.payment-proposal-list.${utility}`,
      params: { type: 'approval-payments', id: scope.row.targetId, approvalId: scope.row.id }
    })
  }
}

onBeforeMount(() => {
  getListOrder()
})
</script>

<template>
  <div class="bg-white p-4 font-bold text-lg">
    <div class="pb-2">{{ type == 'proposal' ? 'Đề nghị thanh toán' : 'Phiếu thu chi' }}</div>
    <el-table v-if="type == 'proposal'" :data="tableDNTT" border style="width: 100%">
      <el-table-column type="index" width="50" />
      <el-table-column prop="code" :label="t('reuse.proposalCode')" width="150" />
      <el-table-column prop="description" :label="t('formDemo.reasonsSpendMoney')" />
      <el-table-column prop="totalMoney" :label="t('reuse.amountOfMoney')">
        <template #default="props">
          <div class="text-right">{{ changeMoney.format(props.row.totalMoney) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="name" :label="t('reuse.subject')" />
      <el-table-column prop="customerName" :label="t('formDemo.createdAtEdit')" width="180" />
      <el-table-column prop="createdBy" :label="t('formDemo.createdByEdit')" width="180" />
      <el-table-column prop="approveAction" :label="t('formDemo.browsingConditions')" width="180" />
      <el-table-column prop="status" :label="t('formDemo.status')" width="180">
        <template #default="props">
          {{ props.row.status == 0 ? 'Chờ duyệt' : 'Đang hoạt động' }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" :label="t('formDemo.manipulation')" width="150">
        <template #default="props">
          <el-button @click="() => detailedBrowsing(props)" type="primary"
            ><span class="text-sm">{{ t('formDemo.BrowseDetails') }} ></span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table v-else :data="tablePTC" border style="width: 100%">
      <el-table-column type="index" width="50" />
      <el-table-column prop="code" :label="t('formDemo.formCode')" width="150" />
      <el-table-column prop="description" :label="t('formDemo.reasonRevenueExpenditure')" />
      <el-table-column prop="totalMoney" :label="t('reuse.amountOfMoney')">
        <template #default="props">
          <div class="text-right">{{ changeMoney.format(props.row.totalMoney) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="name" :label="t('reuse.subject')" />
      <el-table-column prop="customerName" :label="t('formDemo.createdAtEdit')" width="180" />
      <el-table-column prop="createdBy" :label="t('formDemo.createdByEdit')" width="180" />
      <el-table-column prop="approveAction" :label="t('formDemo.browsingConditions')" width="180" />
      <el-table-column prop="status" :label="t('formDemo.status')" width="180">
        <template #default="props">
          {{ props.row.status == 0 ? 'Chờ duyệt' : 'Đang hoạt động' }}
        </template>
      </el-table-column>
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
