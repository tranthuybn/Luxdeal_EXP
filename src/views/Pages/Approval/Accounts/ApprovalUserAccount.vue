<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { dateTimeFormat } from '@/utils/format'
import { ElTable, ElTableColumn, ElButton, ElPagination } from 'element-plus'
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router'
import { listApprovalUserAccount } from '@/api/Approval';
import { appModules } from '@/config/app'
const { utility } = appModules
const { t } = useI18n()

const { push } = useRouter()


const tableListOrder = ref([])

const detailedBrowsing = (scope: any) => {
  const data = scope.row

    push({
      name: `business.customer-management.customerAdd.${utility}`,
      params: {
        type: 'approval-cus',
        id: data.targetId,
        approvalId: data.id
      }
    })
  console.log(' data.id',  data.id);
  
}

const getListUserAccount = async () => {
  const res = await listApprovalUserAccount({ pageIndex: 1, pageSize: 20 })
  tableListOrder.value = res.data
}

onBeforeMount(() => {
  getListUserAccount()
})
</script>

<template>
  <div class="bg-white p-4 font-bold text-lg">
    <div class="pb-2">Duyệt tài khoản người dùng</div>
    <el-table :data="tableListOrder" border style="width: 100%">
      <el-table-column type="index" width="50" />
      <el-table-column prop="code" :label="t('reuse.customerCode')" width="150" />
      <el-table-column prop="name" :label="t('reuse.customerName')" width="600" />

      <el-table-column prop="approveItem" :label="t('reuse.accountType')" width="200" />
     
      <el-table-column prop="createdAt" :label="t('formDemo.createdAtEdit')" width="130">
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
      <el-table-column prop="statusName" :label="t('formDemo.status')" width="130" /> 
      <el-table-column fixed="right" :label="t('formDemo.manipulation')">
        <template #default="props">
          <el-button @click="() => detailedBrowsing(props)" class="w-[100%] p-2" type="primary">{{
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
