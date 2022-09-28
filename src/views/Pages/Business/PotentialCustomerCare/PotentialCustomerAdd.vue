<script setup lang="ts">
import CollapseBase from '@/views/Pages/Components/CollapseBase.vue'
import { getBranchList } from '@/api/HumanResourceManagement'
import { addNewPotentialCustomer } from '@/api/Business'
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
import { columnProfileCustomer } from './PotentialCustomerManagement'
import { useValidator } from '@/hooks/web/useValidator'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/hooks/web/useI18n'
import moment from 'moment'

import { ElCollapse, ElCollapseItem, ElButton, ElTable, ElTableColumn, ElInput } from 'element-plus'

const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const { required, ValidService } = useValidator()
const { t } = useI18n()
const rules = reactive({
  customerInfo: [required()],
  customerName: [required()],
  phoneNumber: [required(), ValidService.checkPhone],
  email: [required(), ValidService.checkEmail],
  link: [required()]
})
interface tableDataType {
  id: any
  sale: Number
  saleName: String
  lastContent: String
  oderSalesAssign: String
  manipulation: string
  edited: Boolean
}
// interface {
//   sale: string
//   saleName: string
//   lastContent: string
//   oderSalesAssign: string
//   manipulation: string
//   family: [
//     {
//       date: string
//       customerCareContent: string
//       manipulation: string
//     }
//   ]
// }
const parentBorder = ref(false)
const tableData = ref<tableDataType[]>([])

const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'information',
    title: t('reuse.customerInfo'),
    columns: columnProfileCustomer,
    api: getBranchList,
    buttonAdd: '',
    hasImage: false,
    rules: rules,
    typeForm: 'form'
  }
]
//lay du lieu tu router
const router = useRouter()
const id = String(router.currentRoute.value.params.id)
const postData = (data) => {
  console.log(data)
  const payload = {
    name: data.customerName,
    userName: 'string',
    code: 'string',
    phonenumber: data.phoneNumber,
    email: data.email,
    link: data.link,
    historyTransaction: data.transactionHistory,
    isOnline: true,
    accessChannel: 0,
    source: data.newCustomerSource,
    note: data.Note,
    service: 1,
    serviceDetail: data.serviceDetails,
    orderId: 0,
    statusId: 1,
    total: 0,
    potentialCustomerHistorys: [
      {
        staffId: 0,
        content: 'string',
        percentageOfSales: 0
      }
    ]
  }
  addNewPotentialCustomer(payload)
}

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
const activeName = ref('1')

const handleEdit = (row) => {
  row.edited = !row.edited
}

const handleDelete = (row) => {
  console.log(row)
}
// const { register } = useForm()
const onAddItem = (props) => {
  const i = props.$index
  tableData[i].family.push({
    name: 'Jerry',
    state: 'California',
    city: 'San Francisco',
    address: '3650 21st St, San Francisco',
    zip: 'CA 94114'
  })
}
const addNewSale = () => {
  tableData.value.push({
    id: moment().toString(),
    sale: tableData.value.length + 1,
    saleName: '',
    lastContent: '',
    oderSalesAssign: '',
    manipulation: '',
    edited: true
  })
  // currentobj.id = moment().toString()
  // currentobj.sale = currentobj.sale + 1
  // tableData.value.push(currentobj)
  // tableData.value[tableData.value.length - 1].edited = true
}
// watch([x, () => y.value], ([newX, newY]) => {
//   console.log(`x is ${newX} and y is ${newY}`)
// })
</script>
<template>
  <CollapseBase :collapse="collapse" :id="id" :default="'information'" @post-data="postData" />
  <div class="demo-collapse dark:bg-[#141414]">
    <el-collapse v-model="activeName" @change="collapseChangeEvent">
      <el-collapse-item name="1">
        <template #title>
          <el-button class="header-icon" :icon="collapse[0].icon" link />
          <span class="text-center text-xl">{{ collapse[0].title }}</span>
        </template>
        <div>
          <div>
            <el-table :data="tableData" :border="parentBorder">
              <el-table-column type="expand">
                <template #default="props">
                  <div m="4">
                    <h3 style="text-align: center" class="font-medium text-lg">{{
                      t('reuse.saleHistoryCustomerCare')
                    }}</h3>

                    <el-table class="flex justify-center" :data="props.row.family" border>
                      <el-table-column
                        :label="`${t('reuse.customerCareContent')}`"
                        prop="customerCareContent"
                        width="720"
                      />
                      <el-table-column :label="`${t('reuse.date')}`" prop="date" width="170" />
                      <el-table-column
                        :label="`${t('formDemo.manipulation')}`"
                        prop="manipulation"
                        width="150"
                      >
                        <div class="flex justify-center">
                          <el-button size="default" @click="handleEdit(props.row)">{{
                            t('formDemo.edit')
                          }}</el-button>
                          <el-button
                            size="default"
                            type="danger"
                            @click="handleDelete(props.$index)"
                            >{{ t('reuse.delete') }}</el-button
                          >
                        </div>
                      </el-table-column>
                    </el-table>
                    <div class="flex w-[100%] justify-center">
                      <div class="w-[1040px]"
                        ><el-button class="mt-4" style="width: 14%" @click="onAddItem(props)"
                          >+ {{ t('reuse.addActions') }}</el-button
                        ></div
                      >
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                :label="`${t('reuse.sale')}`"
                prop="sale"
                class="text-black font-bold"
              >
                <template #default="data">
                  <ElInput v-model="data.row.sale" v-if="data.row.edited" />
                  <div v-else>{{ data.row.sale }}</div>
                </template>
              </el-table-column>
              <el-table-column :label="`${t('reuse.lastContent')}`" prop="lastContent">
                <template #default="scope">
                  <el-input v-model="scope.row.lastContent" v-if="scope.row.edited" />
                  <div v-else>{{ scope.row.lastContent }}</div>
                </template>
              </el-table-column>
              <el-table-column :label="`${t('reuse.saleName')}`" prop="saleName">
                <template #default="data">
                  <ElInput v-model="data.row.saleName" v-if="data.row.edited" />
                  <div v-else>{{ data.row.saleName }}</div>
                </template>
              </el-table-column>
              <el-table-column :label="`${t('reuse.orderSalesAssign')}`" prop="oderSalesAssign">
                <template #default="data">
                  <ElInput v-model="data.row.oderSalesAssign" v-if="data.row.edited" />
                  <div v-else>{{ data.row.oderSalesAssign }}</div>
                </template>
              </el-table-column>
              <el-table-column :label="`${t('formDemo.manipulation')}`" prop="manipulation">
                <template #default="scope">
                  <el-button
                    v-if="scope.row.edited"
                    type="primary"
                    size="default"
                    @click.prevent="handleEdit(scope.row)"
                  >
                    {{ t('reuse.save') }}
                  </el-button>
                  <el-button
                    v-else
                    type="primary"
                    size="default"
                    @click.prevent="handleEdit(scope.row)"
                  >
                    {{ t('formDemo.edit') }}
                  </el-button>
                  <el-button type="danger" size="default" @click.prevent="handleDelete(12)">
                    {{ t('reuse.delete') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button class="mt-4" style="width: 7%" @click="addNewSale"
              >+ {{ t('reuse.addSale') }}</el-button
            >
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped>
.header-icon {
  margin: 10px;
}
.text-center {
  font-size: 20px;
}
</style>
