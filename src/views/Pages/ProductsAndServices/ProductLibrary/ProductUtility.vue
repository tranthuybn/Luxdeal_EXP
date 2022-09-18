<script setup lang="ts">
import { getTypePersonnelList } from '@/api/HumanResourceManagement'
import {
  getFeaturesDepositFee,
  getFeaturesPawnFee,
  getFeaturesPrices,
  getFeaturesRentalPrice,
  getSpaLPrice,
  getInventoryTrading,
  getPriceByQuantity,
  getImportAndExportHistory
} from '@/api/LibraryAndSetting'
import {
  ElCollapse,
  ElCollapseItem,
  ElButton,
  ElTable,
  ElTableColumn,
  ElTreeSelect,
  ElInput,
  ElSelectV2,
  ElSwitch
} from 'element-plus'
import TableOperatorTreeSelect from './TableOperatorTreeSelect.vue'
import { useIcon } from '@/hooks/web/useIcon'
import {
  columnProfileProduct,
  featuresPrice,
  featuresRentalPrice,
  featuresDepositFee,
  featuresPawnFee,
  spaPrice,
  inventoryTrading,
  columnManagementSeo,
  columnsPriceByQuantity,
  columnsImportAndExportHistory
} from './ProductLibraryManagement'
import { Collapse } from '../../Components/Type'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter } from 'vue-router'
import { reactive } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
const { t } = useI18n()
import { ref } from 'vue'
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })

const treeSelectData = ref([
  {
    value: '1',
    label: 'Level one 1',
    children: [
      {
        value: '1-1',
        label: 'Level two 1-1',
        children: [
          {
            value: '1-1-1',
            label: 'Level three 1-1-1'
          }
        ]
      }
    ]
  },
  {
    value: '2',
    label: 'Level one 2',
    children: [
      {
        value: '2-1',
        label: 'Level two 2-1',
        children: [
          {
            value: '2-1-1',
            label: 'Level three 2-1-1'
          }
        ]
      },
      {
        value: '2-2',
        label: 'Level two 2-2',
        children: [
          {
            value: '2-2-1',
            label: 'Level three 2-2-1'
          }
        ]
      }
    ]
  }
])
const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'information',
    title: 'Thông tin sản phẩm',
    columns: columnProfileProduct,
    api: undefined,
    buttonAdd: '',
    typeForm: 'form',
    typeButton: 'form01',
    expand: false,
    apiTableChild: undefined,
    columnsTableChild: undefined,
    pagination: false,
    removeHeaderFilter: true,
    removeDrawer: true,
    selection: false,
    customOperator: 3,
    value: 1
  },
  {
    icon: plusIcon,
    name: 'priceCharacteristics',
    title: 'Bảng đặc tính và giá bán',
    columns: featuresPrice,
    api: getFeaturesPrices,
    buttonAdd: 'Thêm đặc tính và giá bán',
    titleButtonChildren: 'Thêm giá',
    typeForm: 'table',
    typeButton: 'table',
    expand: true,
    apiTableChild: getPriceByQuantity,
    columnsTableChild: columnsPriceByQuantity,
    pagination: false,
    removeHeaderFilter: true,
    removeDrawer: true,
    selection: false,
    customOperator: 2,
    titleChilden: 'reuse.rentalPriceTableByQuantity',
    value: 2
  },
  {
    icon: plusIcon,
    name: 'rentalPriceCharacteristics ',
    title: 'Bảng đặc tính và giá cho thuê',
    columns: featuresRentalPrice,
    api: getFeaturesRentalPrice,
    buttonAdd: 'Thêm đặc tính và giá cho thuê',
    titleButtonChildren: 'Thêm giá',
    typeForm: 'table',
    typeButton: 'table',
    expand: true,
    apiTableChild: getPriceByQuantity,
    columnsTableChild: columnsPriceByQuantity,
    pagination: false,
    removeHeaderFilter: true,
    removeDrawer: true,
    selection: false,
    customOperator: 2,
    titleChilden: 'reuse.rentalPriceTableByQuantity',
    value: 3
  },
  {
    icon: plusIcon,
    name: 'depositFee',
    title: 'Bảng đặc tính và phí kí gửi',
    columns: featuresDepositFee,
    api: getFeaturesDepositFee,
    buttonAdd: 'Thêm đặc tính và phí kí gửi',
    typeForm: 'table',
    typeButton: 'table',
    expand: false,
    apiTableChild: undefined,
    columnsTableChild: undefined,
    pagination: false,
    removeHeaderFilter: true,
    removeDrawer: true,
    selection: false,
    customOperator: 2,
    value: 4
  },
  {
    icon: plusIcon,
    name: 'pawnFee',
    title: 'Bảng đặc tính và phí cầm đồ',
    columns: featuresPawnFee,
    api: getFeaturesPawnFee,
    buttonAdd: 'Thêm đặc tính và phí cầm đồ',
    typeForm: 'table',
    typeButton: 'table',
    expand: false,
    apiTableChild: undefined,
    columnsTableChild: undefined,
    pagination: false,
    removeHeaderFilter: true,
    removeDrawer: true,
    selection: false,
    customOperator: 2,
    value: 5
  },
  {
    icon: plusIcon,
    name: 'SpaPrice',
    title: 'Bảng giá dịch vụ spa',
    columns: spaPrice,
    api: getSpaLPrice,
    buttonAdd: 'Thêm dịch vụ và phí spa',
    typeForm: 'table',
    typeButton: 'table',
    expand: false,
    apiTableChild: undefined,
    columnsTableChild: undefined,
    pagination: false,
    removeHeaderFilter: true,
    removeDrawer: true,
    selection: false,
    customOperator: 2,
    value: 6
  },
  {
    icon: plusIcon,
    name: 'inventoryTrading',
    title: 'Tổng hợp tồn kho & kinh doanh',
    columns: inventoryTrading,
    api: getInventoryTrading,
    buttonAdd: 'Thêm đặc tính',
    typeForm: 'table',
    typeButton: 'table',
    expand: true,
    apiTableChild: getImportAndExportHistory,
    columnsTableChild: columnsImportAndExportHistory,
    titleChilden: 'reuse.importAndExportHistoryByProductLine',
    pagination: false,
    removeHeaderFilter: true,
    removeDrawer: true,
    selection: false,
    titleButtonChildren: 'false',
    customOperatorChildren: false,
    customOperator: 2,
    value: 7
  },
  {
    icon: plusIcon,
    name: 'managementSeo',
    title: 'Quản lý SEO',
    columns: columnManagementSeo,
    api: getTypePersonnelList,
    buttonAdd: '',
    typeForm: 'form',
    typeButton: 'form02',
    expand: false,
    apiTableChild: undefined,
    columnsTableChild: undefined,
    pagination: false,
    removeHeaderFilter: true,
    removeDrawer: true,
    selection: false,
    customOperator: 3,
    hasImage: false,
    value: 8
  }
]
const initials = ['Chiếc', 'Cái']
const options = Array.from({ length: 1000 }).map((_, idx) => ({
  value: `Option ${idx + 1}`,
  label: `${initials[idx % 10]}${idx}`
}))
const collapseChangeEvent = (val) => {
  if (val) {
    collapse.forEach((el) => {
      if (val.includes(el.name)) el.icon = minusIcon
      else if (el.icon == minusIcon) el.icon = plusIcon
    })
  } else {
    collapse.forEach((el) => {
      el.icon = plusIcon
    })
  }
}
const activeName = ref(collapse[0].name)
const handleEditRow = (data) => {
  data.edited = true
  console.log(data.edited)
}
const handleSaveRow = (data) => {
  data.edited = false
  console.log(data.edited)
}
const localeChange = (show: boolean) => {
  console.log(show)
}
const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)
const dataTable = [{}]

const { required } = useValidator()
const rules = reactive({
  category: [required()],
  brand: [required()],
  Radio03: [required()]
})
// get api
</script>
<!-- <template> <CollapseBase :collapse="collapse" :id="id" :default="'information'" /></template> -->
<template>
  <div>
    <el-collapse
      v-model="activeName"
      @change="collapseChangeEvent"
      :class="[
        'bg-[var(--el-color-white)] dark:(bg-[var(--el-color-black)] border-[var(--el-border-color)] border-1px)'
      ]"
    >
      <el-collapse-item :name="collapse[0].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[0].icon" link />
          <span class="text-center">{{ collapse[0].title }}</span>
        </template>
        <TableOperatorTreeSelect
          class="infinite-list"
          style="overflow: auto"
          :rules="rules"
          :type="type"
          :id="id"
          :schema="collapse[0].columns"
          :typeButton="collapse[0].typeButton"
          :class="[
            'bg-[var(--el-color-white)] dark:(bg-[var(--el-color-black)] border-[var(--el-border-color)] border-1px)'
          ]"
        />
      </el-collapse-item>
      <el-collapse-item :name="collapse[1].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[1].icon" link />
          <span class="text-center">{{ collapse[1].title }}</span>
        </template>
        <ElTable class="ml-5" :data="dataTable" :border="true" stripe>
          <ElTableColumn
            header-align="center"
            min-width="250"
            prop="managementCode"
            :label="t('reuse.managementCode')"
          />
          <ElTableColumn
            header-align="center"
            min-width="200"
            prop="featureGroup"
            :label="t('reuse.featureGroup')"
          >
            <template #default="scope">
              <ElTreeSelect
                v-model="scope.row.index"
                :data="treeSelectData"
                multiple
                check-strictly
                :render-after-expand="false"
                v-if="scope.row.edited"
              />
              <span v-else>{{ scope.row.featureGroup }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="130"
            prop="quantityTo"
            :label="t('reuse.quantityTo')"
          >
            <template #default="scope">
              <ElInput
                v-model="scope.row.index"
                v-if="scope.row.edited"
                placeholder="Please input"
              />
              <span v-else>{{ scope.row.quantityTo }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="130"
            prop="productCategoryUnit"
            :label="t('router.productCategoryUnit')"
          >
            <template #default="scope">
              <ElSelectV2
                v-model="scope.row.index"
                v-if="scope.row.edited"
                :options="options"
                :placeholder="scope.row.date"
              />
              <span v-else>{{ scope.row.productCategoryUnit }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="right"
            min-width="130"
            prop="unitPrices"
            :label="t('reuse.unitPrices')"
          >
            <template #default="scope">
              <ElInput
                v-model="scope.row.index"
                v-if="scope.row.edited"
                placeholder="Please input"
              />
              <span v-else>{{ scope.row.unitPrices }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="right"
            min-width="130"
            prop="promotionPrice"
            :label="t('reuse.promotionPrice')"
          >
            <template #default="scope">
              <ElInput
                v-model="scope.row.index"
                v-if="scope.row.edited"
                placeholder="Please input"
              />
              <span v-else>{{ scope.row.promotionPrice }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="130"
            prop="createDate"
            :label="t('reuse.dateEditCreate')"
          />
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="130"
            prop="status"
            :label="t('reuse.status')"
          />
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="120"
            :label="t('reuse.depositManagement')"
          >
            <template #default="scope">
              <ElSwitch v-model="scope.row.switch" @change="localeChange" />
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="160"
            fixed="right"
            :label="t('reuse.operator')"
          >
            <template #default="scope">
              <el-button v-if="scope.row.edited" type="primary" @click="handleSaveRow(scope.row)">{{
                t('reuse.save')
              }}</el-button>
              <el-button v-else type="default" @click="handleEditRow(scope.row)">{{
                t('reuse.fix')
              }}</el-button>
              <el-button type="danger" @click="handleEditRow(scope.row)">{{
                t('reuse.delete')
              }}</el-button>
            </template>
          </ElTableColumn>
        </ElTable>
        <el-button class="ml-5 mt-5" :icon="plusIcon">{{ collapse[1].buttonAdd }}</el-button>
      </el-collapse-item>
      <el-collapse-item :name="collapse[2].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[2].icon" link />
          <span class="text-center">{{ collapse[2].title }}</span>
        </template>
        <ElTable class="ml-5" :data="dataTable" :border="true" stripe>
          <ElTableColumn
            header-align="center"
            min-width="250"
            prop="managementCode"
            :label="t('reuse.managementCode')"
          />
          <ElTableColumn
            header-align="center"
            min-width="200"
            prop="featureGroup"
            :label="t('reuse.featureGroup')"
          >
            <template #default="scope">
              <ElTreeSelect
                v-model="scope.row.index"
                :data="treeSelectData"
                multiple
                check-strictly
                :render-after-expand="false"
                v-if="scope.row.edited"
              />
              <span v-else>{{ scope.row.featureGroup }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="130"
            prop="quantityTo"
            :label="t('reuse.quantityTo')"
          >
            <template #default="scope">
              <ElInput
                v-model="scope.row.index"
                v-if="scope.row.edited"
                placeholder="Please input"
              />
              <span v-else>{{ scope.row.quantityTo }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="130"
            prop="productCategoryUnit"
            :label="t('router.productCategoryUnit')"
          >
            <template #default="scope">
              <ElSelectV2
                v-model="scope.row.index"
                v-if="scope.row.edited"
                :options="options"
                :placeholder="scope.row.date"
              />
              <span v-else>{{ scope.row.productCategoryUnit }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="right"
            min-width="130"
            prop="dayRentalUnitPrice"
            :label="t('reuse.dayRentalUnitPrice')"
          >
            <template #default="scope">
              <ElInput
                v-model="scope.row.index"
                v-if="scope.row.edited"
                placeholder="Please input"
              />
              <span v-else>{{ scope.row.dayRentalUnitPrice }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="right"
            min-width="130"
            prop="weeklyRent"
            :label="t('reuse.weeklyRent')"
          >
            <template #default="scope">
              <ElInput
                v-model="scope.row.index"
                v-if="scope.row.edited"
                placeholder="Please input"
              />
              <span v-else>{{ scope.row.weeklyRent }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="right"
            min-width="130"
            prop="monthlyRent"
            :label="t('reuse.monthlyRent')"
          >
            <template #default="scope">
              <ElInput
                v-model="scope.row.index"
                v-if="scope.row.edited"
                placeholder="Please input"
              />
              <span v-else>{{ scope.row.monthlyRent }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="right"
            min-width="130"
            prop="rentDeposit"
            :label="t('reuse.rentDeposit')"
          >
            <template #default="scope">
              <ElInput
                v-model="scope.row.index"
                v-if="scope.row.edited"
                placeholder="Please input"
              />
              <span v-else>{{ scope.row.rentDeposit }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="130"
            prop="createDate"
            :label="t('reuse.dateEditCreate')"
          />
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="130"
            prop="status"
            :label="t('reuse.status')"
          />
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="130"
            :label="t('reuse.depositManagement')"
          >
            <template #default="scope">
              <ElSwitch v-model="scope.row.switch" @change="localeChange" />
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="160"
            fixed="right"
            :label="t('reuse.operator')"
          >
            <template #default="scope">
              <el-button v-if="scope.row.edited" type="primary" @click="handleSaveRow(scope.row)">{{
                t('reuse.save')
              }}</el-button>
              <el-button v-else type="default" @click="handleEditRow(scope.row)">{{
                t('reuse.fix')
              }}</el-button>
              <el-button type="danger" @click="handleEditRow(scope.row)">{{
                t('reuse.delete')
              }}</el-button>
            </template>
          </ElTableColumn>
        </ElTable>
        <el-button class="ml-5 mt-5" :icon="plusIcon">{{ collapse[2].buttonAdd }}</el-button>
      </el-collapse-item>
      <el-collapse-item :name="collapse[3].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[3].icon" link />
          <span class="text-center">{{ collapse[3].title }}</span>
        </template>
        <ElTable class="ml-5" :data="dataTable" :border="true" stripe>
          <ElTableColumn
            header-align="center"
            min-width="250"
            prop="managementCode"
            :label="t('reuse.managementCode')"
          />
          <ElTableColumn
            header-align="center"
            min-width="200"
            prop="featureGroup"
            :label="t('reuse.featureGroup')"
          >
            <template #default="scope">
              <ElTreeSelect
                v-model="scope.row.index"
                :data="treeSelectData"
                multiple
                check-strictly
                :render-after-expand="false"
                v-if="scope.row.edited"
              />
              <span v-else>{{ scope.row.featureGroup }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="130"
            prop="quantityTo"
            :label="t('reuse.quantityTo')"
          >
            <template #default="scope">
              <ElInput
                v-model="scope.row.index"
                v-if="scope.row.edited"
                placeholder="Please input"
              />
              <span v-else>{{ scope.row.quantityTo }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="130"
            prop="productCategoryUnit"
            :label="t('router.productCategoryUnit')"
          >
            <template #default="scope">
              <ElSelectV2
                v-model="scope.row.index"
                v-if="scope.row.edited"
                :options="options"
                :placeholder="scope.row.date"
              />
              <span v-else>{{ scope.row.productCategoryUnit }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="130"
            prop="depositFee"
            :label="t('reuse.depositFee')"
          >
            <template #default="scope">
              <ElInput
                v-model="scope.row.index"
                v-if="scope.row.edited"
                placeholder="Please input"
              />
              <span v-else>{{ scope.row.depositFee }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="130"
            prop="status"
            :label="t('reuse.status')"
          />
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="120"
            :label="t('reuse.depositManagement')"
          >
            <template #default="scope">
              <ElSwitch v-model="scope.row.switch" @change="localeChange" />
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="160"
            fixed="right"
            :label="t('reuse.operator')"
          >
            <template #default="scope">
              <el-button v-if="scope.row.edited" type="primary" @click="handleSaveRow(scope.row)">{{
                t('reuse.save')
              }}</el-button>
              <el-button v-else type="default" @click="handleEditRow(scope.row)">{{
                t('reuse.fix')
              }}</el-button>
              <el-button type="danger" @click="handleEditRow(scope.row)">{{
                t('reuse.delete')
              }}</el-button>
            </template>
          </ElTableColumn>
        </ElTable>
        <el-button class="ml-5 mt-5" :icon="plusIcon">{{ collapse[3].buttonAdd }}</el-button>
      </el-collapse-item>
      <el-collapse-item :name="collapse[4].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[4].icon" link />
          <span class="text-center">{{ collapse[4].title }}</span>
        </template>
        <ElTable class="ml-5" :data="dataTable" :border="true" stripe>
          <ElTableColumn
            header-align="center"
            min-width="250"
            prop="managementCode"
            :label="t('reuse.managementCode')"
          />
          <ElTableColumn
            header-align="center"
            min-width="200"
            prop="featureGroup"
            :label="t('reuse.featureGroup')"
          >
            <template #default="scope">
              <ElTreeSelect
                v-model="scope.row.index"
                :data="treeSelectData"
                multiple
                check-strictly
                :render-after-expand="false"
                v-if="scope.row.edited"
              />
              <span v-else>{{ scope.row.featureGroup }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="130"
            prop="quantityTo"
            :label="t('reuse.quantityTo')"
          >
            <template #default="scope">
              <ElInput
                v-model="scope.row.index"
                v-if="scope.row.edited"
                placeholder="Please input"
              />
              <span v-else>{{ scope.row.quantityTo }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="130"
            prop="productCategoryUnit"
            :label="t('router.productCategoryUnit')"
          >
            <template #default="scope">
              <ElSelectV2
                v-model="scope.row.index"
                v-if="scope.row.edited"
                :options="options"
                :placeholder="scope.row.date"
              />
              <span v-else>{{ scope.row.productCategoryUnit }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="right"
            min-width="130"
            prop="interest"
            :label="t('reuse.interest')"
          >
            <template #default="scope">
              <ElInput
                v-model="scope.row.index"
                v-if="scope.row.edited"
                placeholder="Please input"
              />
              <span v-else>{{ scope.row.interest }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="right"
            min-width="130"
            prop="InsuranceMoney"
            :label="t('reuse.InsuranceMoney')"
          >
            <template #default="scope">
              <ElInput
                v-model="scope.row.index"
                v-if="scope.row.edited"
                placeholder="Please input"
              />
              <span v-else>{{ scope.row.InsuranceMoney }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="right"
            min-width="130"
            prop="intoMoney"
            :label="t('reuse.intoMoney')"
          />
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="130"
            prop="status"
            :label="t('reuse.status')"
          />
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="120"
            :label="t('reuse.depositManagement')"
          >
            <template #default="scope">
              <ElSwitch v-model="scope.row.switch" @change="localeChange" />
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="160"
            fixed="right"
            :label="t('reuse.operator')"
          >
            <template #default="scope">
              <el-button v-if="scope.row.edited" type="primary" @click="handleSaveRow(scope.row)">{{
                t('reuse.save')
              }}</el-button>
              <el-button v-else type="default" @click="handleEditRow(scope.row)">{{
                t('reuse.fix')
              }}</el-button>
              <el-button type="danger" @click="handleEditRow(scope.row)">{{
                t('reuse.delete')
              }}</el-button>
            </template>
          </ElTableColumn>
        </ElTable>
        <el-button class="ml-5 mt-5" :icon="plusIcon">{{ collapse[4].buttonAdd }}</el-button>
      </el-collapse-item>
      <el-collapse-item :name="collapse[5].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[5].icon" link />
          <span class="text-center">{{ collapse[5].title }}</span>
        </template>
        <ElTable class="ml-5" :data="dataTable" :border="true" stripe>
          <ElTableColumn
            header-align="center"
            min-width="250"
            prop="managementCode"
            :label="t('reuse.managementCode')"
          />
          <ElTableColumn
            header-align="center"
            min-width="200"
            prop="serviceOrGroupService"
            :label="t('reuse.serviceOrGroupService')"
          >
            <template #default="scope">
              <ElTreeSelect
                v-model="scope.row.index"
                :data="treeSelectData"
                multiple
                check-strictly
                :render-after-expand="false"
                v-if="scope.row.edited"
              />
              <span v-else>{{ scope.row.serviceOrGroupService }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="130"
            prop="spaTime"
            :label="t('reuse.spaTime')"
          />
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="130"
            prop="numberUses"
            :label="t('reuse.numberUses')"
          />
          <ElTableColumn
            header-align="center"
            align="right"
            min-width="130"
            prop="spaPrice"
            :label="t('reuse.spaPrice')"
          >
            <template #default="scope">
              <ElInput
                v-model="scope.row.index"
                v-if="scope.row.edited"
                placeholder="Please input"
              />
              <span v-else>{{ scope.row.spaPrice }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="130"
            prop="status"
            :label="t('reuse.status')"
          />
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="120"
            :label="t('reuse.depositManagement')"
          >
            <template #default="scope">
              <ElSwitch v-model="scope.row.switch" @change="localeChange" />
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="160"
            fixed="right"
            :label="t('reuse.operator')"
          >
            <template #default="scope">
              <el-button v-if="scope.row.edited" type="primary" @click="handleSaveRow(scope.row)">{{
                t('reuse.save')
              }}</el-button>
              <el-button v-else type="default" @click="handleEditRow(scope.row)">{{
                t('reuse.fix')
              }}</el-button>
              <el-button type="danger" @click="handleEditRow(scope.row)">{{
                t('reuse.delete')
              }}</el-button>
            </template>
          </ElTableColumn>
        </ElTable>
        <el-button class="ml-5 mt-5" :icon="plusIcon">{{ collapse[5].buttonAdd }}</el-button>
      </el-collapse-item>
      <el-collapse-item :name="collapse[6].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[6].icon" link />
          <span class="text-center">{{ collapse[6].title }}</span>
        </template>
        <ElTable class="ml-5" :data="dataTable" :border="true" stripe>
          <ElTableColumn
            header-align="center"
            min-width="250"
            prop="managementCode"
            :label="t('reuse.managementCode')"
          />
          <ElTableColumn
            header-align="center"
            min-width="200"
            prop="featureGroup"
            :label="t('reuse.featureGroup')"
          >
            <template #default="scope">
              <ElTreeSelect
                v-model="scope.row.index"
                :data="treeSelectData"
                multiple
                check-strictly
                :render-after-expand="false"
                v-if="scope.row.edited"
              />
              <span v-else>{{ scope.row.featureGroup }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn header-align="center" :label="t('reuse.businessSynthesis')">
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="100"
              prop="dram"
              :label="t('reuse.quantitySold')"
            />
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="100"
              prop="dram"
              :label="t('reuse.numberOfTimesRented')"
            />
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="100"
              prop="dram"
              :label="t('reuse.numberOfTimesDeposited')"
            />
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="100"
              prop="numberOfTimesPawn"
              :label="t('reuse.numberOfTimesPawn')"
            />
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="100"
              prop="numberOfTimesSpa"
              :label="t('reuse.numberOfTimesSpa')"
            />
          </ElTableColumn>
          <ElTableColumn header-align="center" :label="t('reuse.inventoryConsolidation')">
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="100"
              prop="internalInventory"
              :label="t('reuse.internalInventory')"
            />
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="100"
              prop="consignmentInventory"
              :label="t('reuse.consignmentInventory')"
            />
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="100"
              prop="pawnInventory"
              :label="t('reuse.pawnInventory')"
            />
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="100"
              prop="spaInventory"
              :label="t('reuse.spaInventory')"
            />
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="100"
              prop="currentlyLeased"
              :label="t('reuse.currentlyLeased')"
            />
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="100"
              prop="total"
              :label="t('reuse.total')"
            />
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="150"
            prop="dram"
            :label="t('reuse.dram')"
          />
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="160"
            fixed="right"
            :label="t('reuse.operator')"
          >
            <template #default="scope">
              <el-button v-if="scope.row.edited" type="primary" @click="handleSaveRow(scope.row)">{{
                t('reuse.save')
              }}</el-button>
              <el-button v-else type="default" @click="handleEditRow(scope.row)">{{
                t('reuse.fix')
              }}</el-button>
              <el-button type="danger" @click="handleEditRow(scope.row)">{{
                t('reuse.delete')
              }}</el-button>
            </template>
          </ElTableColumn>
        </ElTable>
        <el-button class="ml-5 mt-5" :icon="plusIcon">{{ collapse[6].buttonAdd }}</el-button>
      </el-collapse-item>
      <el-collapse-item :name="collapse[7].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[7].icon" link />
          <span class="text-center">{{ collapse[7].title }}</span>
        </template>
        <TableOperatorTreeSelect
          class="infinite-list"
          :hasImage="collapse[7].hasImage"
          style="overflow: auto"
          :schema="collapse[7].columns"
          :typeButton="collapse[7].typeButton"
          :class="[
            'bg-[var(--el-color-white)] dark:(bg-[var(--el-color-black)] border-[var(--el-border-color)] border-1px)'
          ]"
        />
        <ElButton class="ml-5" type="primary">
          {{ t('reuse.save') }}
        </ElButton>
        <ElButton type="primary">
          {{ t('reuse.addNew') }}
        </ElButton>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<style scoped>
.text-center {
  font-size: 20px;
}
</style>
