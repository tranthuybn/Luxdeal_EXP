<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { computed, ref } from 'vue'
import HeaderFilterRankingList from './HeaderFilterRankingList.vue'
import { ElCol, ElRow, ElTable, ElTableColumn, ElPagination } from 'element-plus'
const { t } = useI18n()

const props = defineProps({
  selectedRecord: {
    type: Array,
    default: () => [],
    required: true
  },
  totalRecord: {
    type: Number,
    default: 0,
    required: true
  }
})
const selectedNumber = computed(() =>
  Array.isArray(props.selectedRecord) ? props.selectedRecord.length : 0
)

interface User {
  code: string
  name: string
  address: string
  monthlyRevenue: string
  quarterlySales: string
  salesYear: string
  rankMonth: string
  quarterlyRanking: string
  rankingYear: string
}

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<User[]>([])

const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val
}

const tableData: User[] = [
  {
    code: 'KH534532',
    name: 'Bùi Lan Phương',
    address: 'Gold',
    monthlyRevenue: '20,000,000 đ',
    quarterlySales: '20,000,000 đ',
    salesYear: '20,000,000 đ',
    rankMonth: 'Gold',
    quarterlyRanking: 'Gold',
    rankingYear: 'Gold'
  },
  {
    code: 'KH534532',
    name: 'Phương ly',
    address: 'Gold',
    monthlyRevenue: '20,000,000 đ',
    quarterlySales: '20,000,000 đ',
    salesYear: '20,000,000 đ',
    rankMonth: 'Gold',
    quarterlyRanking: 'Gold',
    rankingYear: 'Gold'
  },
  {
    code: 'KH534532',
    name: 'Ninh Dương Lan Ngọc',
    address: 'Gold',
    monthlyRevenue: '20,000,000 đ',
    quarterlySales: '20,000,000 đ',
    salesYear: '20,000,000 đ',
    rankMonth: 'Gold',
    quarterlyRanking: 'Gold',
    rankingYear: 'Gold'
  },
  {
    code: 'KH534532',
    name: 'Suni Hạ Linh',
    address: 'Gold',
    monthlyRevenue: '20,000,000 đ',
    quarterlySales: '20,000,000 đ',
    salesYear: '20,000,000 đ',
    rankMonth: 'Gold',
    quarterlyRanking: 'Gold',
    rankingYear: 'Gold'
  }
]
</script>

<template>
  <div class="bg-[#FFFFFF] dark:bg-transparent">
    <el-row class="mb-2 pl-4 pt-4">
      <el-col :xl="6" :lg="12" :xs="24">
        <div class="extension-function">
          <p style="width: 26%">
            <span>{{ t('reuse.choose') }}</span>
            <span>
              ({{ Array.isArray(selectedRecord) ? selectedRecord.length : 0 }}/{{ totalRecord }})
            </span>
          </p>
          <p
            ><span :class="selectedNumber > 0 ? '' : 'opacity-20'">{{
              t('reuse.exportExcel')
            }}</span
            ><span>
              <Icon
                icon="file-icons:microsoft-excel"
                :about="16"
                color="var(--el-color-primary)"
                class="ml-2px relative top-1px"
              />
            </span>
          </p>
          <p>
            <span :class="selectedNumber > 0 ? '' : 'opacity-20'">{{ t('reuse.duplicate') }}</span>
            <span>
              <Icon
                icon="ion:duplicate"
                :size="16"
                color="var(--el-color-primary)"
                class="ml-2px relative top-1px"
              />
            </span>
          </p>
          <p>
            <span :class="selectedNumber > 0 ? '' : 'opacity-20'">{{ t('reuse.delete') }}</span>
            <span>
              <Icon
                icon="fluent:delete-12-regular"
                :size="16"
                color="var(--el-color-primary)"
                class="ml-2px relative top-1px"
              />
            </span>
          </p>
        </div>
      </el-col>
      <div class="w-[70%]">
        <HeaderFilterRankingList />
      </div>
    </el-row>
    <el-table
      ref="multipleTableRef"
      :data="tableData"
      style="width: 100%; padding: 0 16px 16px 16px"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column property="code" :label="t('reuse.customerCode')" width="120" />
      <el-table-column property="name" :label="t('reuse.customerName')" width="480" />
      <el-table-column property="monthlyRevenue" :label="t('customerList.monthlyRevenue')" />
      <el-table-column property="quarterlySales" :label="t('customerList.quarterlySales')" />
      <el-table-column property="salesYear" :label="t('customerList.salesYear')" />
      <el-table-column property="rankMonth" :label="t('customerList.rankMonth')" />
      <el-table-column property="quarterlyRanking" :label="t('customerList.quarterlyRanking')" />
      <el-table-column property="rankingYear" :label="t('customerList.rankingYear')" />
    </el-table>
    <div class="example-pagination-block">
      <el-pagination layout="prev, pager, next" :total="1000" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@mixin d-flex {
  display: flex;
  align-items: center;
}
.extension-function {
  @include d-flex;
  justify-content: space-between;

  p {
    border-bottom: 2px solid var(--app-contnet-bg-color);
    @include d-flex;
    justify-content: flex-start;
    box-sizing: border-box;
    cursor: pointer;
    width: fit-content;
    span {
      width: fit-content;
      font-weight: 500;
    }
    &:hover {
      border-bottom: 2px solid var(--el-color-primary);
    }
  }
}
.example-pagination-block + .example-pagination-block {
  margin-top: 10px;
}
.example-pagination-block .example-demonstration {
  margin-bottom: 16px;
}
</style>
