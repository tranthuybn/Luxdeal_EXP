<script setup lang="ts">
import { h, reactive, ref } from 'vue'
import {
  ElCollapse,
  ElCollapseItem,
  ElButton,
  ElDivider,
  ElImage,
  ElTable,
  ElTableColumn,
  ElRadio,
  ElRadioGroup
} from 'element-plus'
import { Collapse } from '../../Components/Type'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { getDetailCustomerPoint, cancelPointTransaction } from '@/api/Business'
import router from '@/router'
import moment from 'moment'

const { t } = useI18n()

const escape = useIcon({ icon: 'quill:escape' })

const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })

const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: '1',
    title: t('reuse.detailCustomerPoints')
  },
  {
    icon: minusIcon,
    name: '2',
    title: t('reuse.historyPointTransaction')
  }
]

const collapseChangeEvent = (val) => {
  if (val) {
    collapse.forEach((el) => {
      if (val.includes(el.name)) el.icon = minusIcon
      else if (el.icon == minusIcon) el.icon = plusIcon
    })
  } else
    collapse.forEach((el) => {
      el.icon = plusIcon
    })
}
const activeName = ref([collapse[0].name])
const cancel = () => {
  console.log('cancel')
}
const tableData = ref()
const form = reactive({
  customerCode: '',
  customerName: '',
  phoneNumber: '',
  email: '',
  image: '',
  status: 0
})
const id = Number(router.currentRoute.value.params.id)
const total = reactive({
  rechargePoint: 0,
  usedPoint: 0,
  totalPoint: 0
})
const callAPI = async () => {
  const res = await getDetailCustomerPoint({ Id: id })
  if (res) {
    form.customerCode = res.data[0]?.customerCode
    form.customerName = res.data[0]?.customerName
    form.phoneNumber = res.data[0]?.phoneNumber
    form.email = res.data[0]?.email
    form.image = res.data[0]?.customerImage
    form.status = res.data[0]?.status

    tableData.value = res.data[0]?.transaction.map((trans) => ({
      id: trans?.id,
      pointExchangeType: trans?.pointExchangeType,
      orderCode: trans?.orderCode,
      campaignCode: trans?.campaignCode,
      referralCode: trans?.referralCode,
      pointExchangeCode: trans?.pointExchangeCode,
      type: trans?.type,
      transactionPoint: trans?.transactionPoint,
      pointAfterTransaction: trans?.pointAfterTransaction,
      createdAt: trans?.createdAt,
      transactionStatus: trans?.transactionStatus
    }))

    total.rechargePoint = res.data[0]?.rechargePoint
    total.usedPoint = res.data[0]?.usedPoint
    total.totalPoint = res.data[0]?.totalPoint

    loading.value = false
  }
}
callAPI()

const formatter = (row, _column: any) => {
  switch (row.pointExchangeType) {
    case 1:
      return h('div', [
        `${t('reuse.buyPointExchange')}`,
        h('span', { class: 'text-blue-400' }, ` ${row.pointExchangeCode}`)
      ])
    case 2:
      return h('div', [
        `${t('reuse.buyVoucher')}`,
        h('span', { class: 'text-blue-400' }, ` ${row.campaignCode}`)
      ])
    case 3:
      return h('div', [
        `${t('reuse.referralCustomer')}`,
        h('span', { class: 'text-blue-400' }, ` ${row.referralCode}`)
      ])
    case 4:
      return h('div', [
        `${t('reuse.order')}`,
        h('span', { class: 'text-blue-400' }, ` ${row.orderCode}`)
      ])
    default:
      return ''
  }
}

const pointTransactionStatus = (status) => {
  switch (status) {
    case 1:
      return t('reuse.success')
    case 2:
      return t('reuse.cancelled')
    default:
      return ''
  }
}
const loading = ref(true)
const cancelTransaction = async (scope) => {
  await cancelPointTransaction({ Id: scope.row.id }).then(async () => {
    await callAPI().finally(() => (loading.value = false))
  })
}
</script>

<template>
  <div class="demo-collapse dark:bg-[#141414]">
    <el-collapse v-model="activeName" @change="collapseChangeEvent">
      <el-collapse-item :name="collapse[0].name">
        <template #title>
          <div class="flex w-[100%] justify-between">
            <div class="before">
              <el-button class="header-icon" :icon="collapse[0].icon" link />
              <span class="text-center text-xl">{{ collapse[0].title }}</span>
            </div>
            <div @click="cancel()" class="after">
              <span class="text-center text-xl">{{ t('reuse.exit') }}</span>
              <el-button class="header-icon" :icon="escape" link size="large" />
            </div>
          </div>
        </template>
        <div class="flex">
          <div class="info">
            <el-divider content-position="left"
              ><span class="font-700 text-lg">{{ t('reuse.customerInfo') }}</span></el-divider
            >
            <div class="formDetail"
              ><span class="formLabel">{{ t('reuse.customerCode') }}</span
              ><span class="font-500">{{ form.customerCode }}</span></div
            >
            <div class="formDetail"
              ><span class="formLabel">{{ t('reuse.customerName') }}</span
              ><span>{{ form.customerName }}</span></div
            >
            <div class="formDetail"
              ><span class="formLabel">{{ t('reuse.phoneNumber') }}</span
              ><span>{{ form.phoneNumber }}</span></div
            >
            <div class="formDetail"
              ><span class="formLabel">{{ t('reuse.email') }}</span
              ><span>{{ form.email }}</span></div
            >
            <el-divider content-position="left"
              ><span class="font-700 text-lg">{{ t('reuse.pointStatus') }}</span></el-divider
            >
            <div class="formDetail"
              ><span class="formLabel">{{ t('reuse.status') }}</span
              ><span
                ><el-radio-group v-model="form.status" class="ml-4" disabled>
                  <el-radio :label="2" size="large">{{ t('reuse.lockPoint') }}</el-radio>
                </el-radio-group></span
              >
            </div>
            <div v-if="form.status == 1" class="bg-blue-700 formDetail text-white">{{
              t('reuse.usingPoint')
            }}</div>
          </div>
          <div class="image">
            <el-divider content-position="left"
              ><span class="font-700 text-lg"
                >{{ t('reuse.image')
                }}<span class="text-green-400">({{ t('reuse.avatarCustomer') }})</span></span
              ></el-divider
            >
            <ElImage :src="form.image" fit="fill" class="h-4/5 w-1/5">
              <template #placeholder>
                <div class="image-slot">Loading<span class="dot">...</span></div>
              </template>
              <template #error>
                <div class="image-slot"> {{ t('reuse.notFoundImage') }} </div>
              </template>
            </ElImage>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item :name="collapse[1].name">
        <template #title>
          <div class="flex w-[100%] justify-between">
            <div class="before">
              <el-button class="header-icon" :icon="collapse[1].icon" link />
              <span class="text-center text-xl">{{ collapse[1].title }}</span>
            </div>
          </div>
        </template>
        <el-table :data="tableData" style="width: 100%" border :loading="loading">
          <template #append>
            <span class="pl-4/10 font-bold">{{ total.rechargePoint }}</span>
            <span class="pl-1/10 font-bold">{{ total.usedPoint }}</span>
            <span class="pl-1/10 font-bold">{{ total.totalPoint }}</span>
          </template>
          <el-table-column
            :label="`${t('reuse.methodPoint')}`"
            :formatter="formatter"
            :min-width="40"
          />
          <el-table-column :label="`${t('reuse.rechargePoint')}`" :min-width="10">
            <template #default="scope">
              <span v-if="scope.row.type == 1">{{ scope.row.transactionPoint }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="`${t('reuse.usedPoint')}`" :min-width="10">
            <template #default="scope">
              <span v-if="scope.row.type == 2">{{ scope.row.transactionPoint }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="`${t('reuse.totalPoint')}`" :min-width="10">
            <template #default="scope">
              <span>{{ scope.row.pointAfterTransaction }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="`${t('reuse.date')}`" :min-width="10">
            <template #default="scope">
              {{ moment(scope.row.createdAt).format('DD/MM/YYYY HH:mm') }}
            </template>
          </el-table-column>
          <el-table-column :label="`${t('reuse.status')}`" :min-width="10">
            <template #default="scope">
              {{ pointTransactionStatus(scope.row.transactionStatus) }}
            </template>
          </el-table-column>
          <el-table-column :label="`${t('reuse.operator')}`" :min-width="10">
            <template #default="scope">
              <el-button
                type="danger"
                :disabled="scope.row.transactionStatus == 2"
                @click="cancelTransaction(scope)"
                >{{ t('reuse.cancelPoint') }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<style scoped>
.info {
  width: 50%;
}
.image {
  width: 50%;
  padding-left: 1%;
}
.formDetail {
  display: flex;
  margin-left: 10%;
  align-items: center;
}
.formLabel {
  width: 15%;
}
</style>
