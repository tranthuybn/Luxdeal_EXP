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
  getImportAndExportHistory,
  postProductLibrary,
  getBusinessProductLibrary,
  updateProductLibrary,
  updateProductSeo
} from '@/api/LibraryAndSetting'
import {
  ElCollapse,
  ElCollapseItem,
  ElButton,
  ElTable,
  ElTableColumn,
  ElTreeSelect,
  ElInput,
  ElSwitch,
  ElNotification,
  ElDialog,
  ElForm,
  ElFormItem,
  FormInstance,
  ElSelect,
  ElOption
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
import { reactive, unref, watch } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { FORM_IMAGES } from '@/utils/format'
import { ref } from 'vue'
import { TableOperator } from '../../Components/TableBase'

const { t } = useI18n()
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
const collapse: Array<Collapse> = reactive([
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
    title: t('reuse.productAttributeTable'),
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
    value: 2,
    tableList: [],
    loading: true
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
    value: 3,
    tableList: [],
    loading: true
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
    value: 4,
    tableList: [],
    loading: true
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
    value: 5,
    tableList: [],
    loading: true
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
    value: 6,
    tableList: [],
    loading: true
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
    value: 7,
    tableList: [],
    loading: true
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
])
let nameCollapse = ''
const collapseChangeEvent = async (val) => {
  if (val && val.length > 0) {
    const collapseItem = collapse.find(
      (element) => ((nameCollapse = val.slice(-1)), element.name == nameCollapse)
    )
    if (collapseItem !== undefined) {
      await callTableApi(collapseItem)
    }
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
}
const handleSaveRow = (data) => {
  data.edited = false
}
const localeChange = (show: boolean) => {
  console.log(show)
}
const router = useRouter()
const id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)

const { required, notSpecialCharacters, ValidService, notSpace } = useValidator()
const rules = reactive({
  ProductTypeId: [required()],
  BrandId: [required()],
  UnitId: [required()],
  OriginId: [required()],
  ProductCode: [
    { validator: notSpace },
    { validator: ValidService.checkNameLength.validator },
    required()
  ],
  Name: [
    { validator: notSpecialCharacters },
    { validator: ValidService.checkNameLength.validator },
    required()
  ],
  ShortDescription: [
    { validator: notSpecialCharacters },
    { validator: ValidService.checkNameLength.validator },
    required()
  ],
  HireInventoryStatus: [required()],
  SellInventoryStatus: [required()],
  ProductStatus: [required()]
})
const callTableApi = async (collapseItem) => {
  if (collapseItem.api !== undefined) {
    const res = await collapseItem.api({ pageSize: 10, pageIndex: 1 })
    collapseItem.tableList = res.data.list
  }
  collapseItem.loading = false
}

const postData = async (data) => {
  await postProductLibrary(FORM_IMAGES(data))
    .then(() =>
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      })
    )
    .catch((error) =>
      ElNotification({
        message: error,
        type: 'warning'
      })
    )
}
type CustomFormData = {
  ProductTypeId: string
  BrandId: string
  UnitId: string
  OriginId: string
  ProductCode: string
  Name: string
  ShortDescription?: string
  VerificationInfo: string
  Description: string
  HireInventoryStatus?: number
  SellInventoryStatus?: number
  ProductStatus?: number
}
const emptyFormObj = {} as CustomFormData
const setFormData = reactive(emptyFormObj)
const customizeData = async (formData) => {
  setFormData.BrandId = formData.categories[0].id
  setFormData.ProductTypeId = formData.categories[1].value
  setFormData.UnitId = formData.categories[2].id
  setFormData.OriginId = formData.categories[3].id
  setFormData.ProductCode = formData.productCode
  setFormData.ShortDescription = formData.shortDescription
  setFormData.Name = formData.name
  setFormData.Description = formData.description
}
const editData = async (data) => {
  await updateProductLibrary(FORM_IMAGES(data))
    .then(() =>
      ElNotification({
        message: t('reuse.updateSuccess'),
        type: 'success'
      })
    )
    .catch(() =>
      ElNotification({
        message: t('reuse.updateFail'),
        type: 'warning'
      })
    )
}
const editDataSeo = async (data) => {
  await updateProductSeo(FORM_IMAGES(data))
    .then(() =>
      ElNotification({
        message: t('reuse.updateSuccess'),
        type: 'success'
      })
    )
    .catch(() =>
      ElNotification({
        message: t('reuse.updateFail'),
        type: 'warning'
      })
    )
}
const handleDeleteRowSpa = (scope) => {
  collapse[5].tableList.splice(scope.$index, 1)
}
const handleDeleteRowRent = (scope) => {
  collapse[2].tableList.splice(scope.$index, 1)
}
const handleDeleteRowSell = (scope) => {
  collapse[1].tableList.splice(scope.$index, 1)
}
//table dialog
const sellTableVisible = ref(false)
const rentTableVisible = ref(false)
const depositTableVisible = ref(false)
const pawnTableVisible = ref(false)
const spaTableVisible = ref(false)
const warehouseTableVisible = ref(false)
let callApiRentTable = 0
let callApiSellTable = 0
let callApiDepositTable = 0
let callApiPawnTable = 0
let callApiSpaTable = 0
let callApiWarehouseTable = 0

let spaDialogTitle = ref('')
const openSpaTable = async (dialogTitle) => {
  spaDialogTitle.value = dialogTitle
  spaTableVisible.value = true
  if (callApiSpaTable == 0) {
    const res = await getFeaturesRentalPrice({ pageSize: 10, pageIndex: 1 })
    collapse[5].tableList = res.data.list
    collapse[5].loading = false
    callApiSpaTable++
  }
}
let warehouseDialogTitle = ref('')
const openWarehouseTable = async (dialogTitle) => {
  warehouseDialogTitle.value = dialogTitle
  warehouseTableVisible.value = true
  if (callApiWarehouseTable == 0) {
    const res = await getFeaturesRentalPrice({ pageSize: 10, pageIndex: 1 })
    collapse[6].tableList = res.data.list
    collapse[6].loading = false
    callApiWarehouseTable++
  }
}
let pawnDialogTitle = ref('')
const openPawnTable = async (dialogTitle) => {
  pawnDialogTitle.value = dialogTitle
  pawnTableVisible.value = true
  if (callApiPawnTable == 0) {
    const res = await getFeaturesDepositFee({ pageSize: 10, pageIndex: 1 })
    collapse[4].tableList = res.data.list
    collapse[4].loading = false
    callApiPawnTable++
  }
}
let depositDialogTitle = ref('')
const openDepositTable = async (dialogTitle) => {
  depositDialogTitle.value = dialogTitle
  depositTableVisible.value = true
  if (callApiDepositTable == 0) {
    const res = await getFeaturesDepositFee({ pageSize: 10, pageIndex: 1 })
    collapse[3].tableList = res.data.list
    collapse[3].loading = false
    callApiDepositTable++
  }
}
let rentDialogTitle = ref('')
const openRentTable = async (dialogTitle) => {
  rentDialogTitle.value = dialogTitle
  rentTableVisible.value = true
  if (callApiRentTable == 0) {
    const res = await getFeaturesRentalPrice({ pageSize: 10, pageIndex: 1 })
    collapse[2].tableList = res.data.list
    collapse[2].loading = false
    callApiRentTable++
  }
}
let sellDialogTitle = ref('')
const openSellTable = async (dialogTitle) => {
  sellDialogTitle.value = dialogTitle
  console.log(sellDialogTitle)
  sellTableVisible.value = true
  if (callApiSellTable == 0) {
    const res = await getFeaturesPrices({ pageSize: 10, pageIndex: 1 })
    collapse[1].tableList = res.data.list
    collapse[1].loading = false
    callApiSellTable++
  }
}
const rentForm = ref<FormInstance>()
const depositForm = ref<FormInstance>()
const sellForm = ref<FormInstance>()
const pawnForm = ref<FormInstance>()
const spaForm = ref<FormInstance>()
const forceRemove = ref(false)

const options = [
  {
    value: 'Option1',
    label: 'Option1'
  },
  {
    value: 'Option2',
    label: 'Option2'
  },
  {
    value: 'Option3',
    label: 'Option3'
  },
  {
    value: 'Option4',
    label: 'Option4'
  },
  {
    value: 'Option5',
    label: 'Option5'
  }
]
//add row to the end of table if fill all table
watch(
  () => collapse[1].tableList[collapse[1].tableList.length - 1],
  () => {
    if (
      collapse[1].tableList[collapse[1].tableList.length - 1].quantityTo !== undefined &&
      collapse[1].tableList[collapse[1].tableList.length - 1].unitPrices !== undefined &&
      collapse[1].tableList[collapse[1].tableList.length - 1].promotionPrice !== undefined &&
      forceRemove.value == false
    ) {
      addLastIndexSellTable()
    }
  },
  { deep: true }
)
watch(
  () => collapse[5].tableList[collapse[5].tableList.length - 1],
  () => {
    if (
      collapse[5].tableList[collapse[5].tableList.length - 1].service !== undefined &&
      collapse[5].tableList[collapse[5].tableList.length - 1].service.length > 0 &&
      collapse[5].tableList[collapse[5].tableList.length - 1].spaPrices !== undefined &&
      forceRemove.value == false
    ) {
      addLastIndexSpaTable()
    }
  },
  { deep: true }
)
watch(
  () => collapse[2].tableList[collapse[2].tableList.length - 1],
  () => {
    if (
      collapse[2].tableList[collapse[2].tableList.length - 1].quantityTo !== undefined &&
      collapse[2].tableList[collapse[2].tableList.length - 1].dayRentalUnitPrice !== undefined &&
      collapse[2].tableList[collapse[2].tableList.length - 1].weeklyRent !== undefined &&
      collapse[2].tableList[collapse[2].tableList.length - 1].rentDeposit !== undefined &&
      collapse[2].tableList[collapse[2].tableList.length - 1].monthlyRent !== undefined &&
      forceRemove.value == false
    ) {
      addLastIndexRentTable()
    }
  },
  { deep: true }
)
const addLastIndexSellTable = () => {
  collapse[1].tableList.push({})
}
const addLastIndexRentTable = () => {
  collapse[2].tableList.push({})
}
const addLastIndexSpaTable = () => {
  collapse[5].tableList.push({})
}
const saveDataSpaTable = async () => {
  removeLastRowSpa()
  await unref(spaForm)!.validate((valid) => {
    if (valid) {
      spaTableVisible.value = false
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      })
    } else {
      ElNotification({
        message: t('reuse.addFail'),
        type: 'warning'
      })
    }
  })
}
const saveDataRentTable = async () => {
  removeLastRowRent()
  await unref(rentForm)!.validate((valid) => {
    if (valid) {
      rentTableVisible.value = false
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      })
    } else {
      ElNotification({
        message: t('reuse.addFail'),
        type: 'warning'
      })
    }
  })
}
const saveDataWarehouseTable = async () => {
  warehouseTableVisible.value = false
}
const saveDataPawnTable = async () => {
  await unref(pawnForm)!.validate((valid) => {
    if (valid) {
      depositTableVisible.value = false
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      })
    } else {
      ElNotification({
        message: t('reuse.addFail'),
        type: 'warning'
      })
    }
  })
}
const saveDataDepositTable = async () => {
  await unref(depositForm)!.validate((valid) => {
    if (valid) {
      depositTableVisible.value = false
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      })
    } else {
      ElNotification({
        message: t('reuse.addFail'),
        type: 'warning'
      })
    }
  })
}
const saveDataSellTable = async () => {
  removeLastRowSell()
  await unref(sellForm)!.validate((valid) => {
    if (valid) {
      sellTableVisible.value = false
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      })
    } else {
      ElNotification({
        message: t('reuse.addFail'),
        type: 'warning'
      })
    }
  })
}
const removeLastRowSell = () => {
  if (
    collapse[1].tableList[collapse[1].tableList.length - 1].quantityTo == undefined &&
    collapse[1].tableList[collapse[1].tableList.length - 1].unitPrices == undefined &&
    collapse[1].tableList[collapse[1].tableList.length - 1].promotionPrice == undefined
  ) {
    forceRemove.value = true

    collapse[1].tableList.splice(-1)
  }
}
const removeLastRowRent = () => {
  if (
    collapse[2].tableList[collapse[2].tableList.length - 1].quantityTo == undefined &&
    collapse[2].tableList[collapse[2].tableList.length - 1].dayRentalUnitPrice == undefined &&
    collapse[2].tableList[collapse[2].tableList.length - 1].weeklyRent == undefined &&
    collapse[2].tableList[collapse[2].tableList.length - 1].rentDeposit == undefined &&
    collapse[2].tableList[collapse[2].tableList.length - 1].monthlyRent == undefined
  ) {
    forceRemove.value = true
    collapse[2].tableList.splice(-1)
  }
}
const removeLastRowSpa = () => {
  if (
    collapse[5].tableList[collapse[5].tableList.length - 1].service == undefined &&
    collapse[5].tableList[collapse[5].tableList.length - 1].spaPrices == undefined
  ) {
    forceRemove.value = true
    collapse[5].tableList.splice(-1)
  }
}
const RentTableDialogClose = () => {
  forceRemove.value = false
}
const SellTableDialogClose = () => {
  forceRemove.value = false
}
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
          :apiId="getBusinessProductLibrary"
          :schema="collapse[0].columns"
          :typeButton="collapse[0].typeButton"
          @post-data="postData"
          @customize-form-data="customizeData"
          @edit-data="editData"
          :formDataCustomize="setFormData"
          :class="[
            'bg-[var(--el-color-white)] dark:(bg-[var(--el-color-black)] border-[var(--el-border-color)] border-1px)'
          ]"
        />
      </el-collapse-item>
      <el-dialog
        v-model="sellTableVisible"
        :title="`${t('reuse.settingSalePrice')}/ ${sellDialogTitle}`"
        width="70%"
        @close="SellTableDialogClose"
      >
        <el-form :model="collapse[1].tableList" ref="sellForm">
          <ElTable :data="collapse[1].tableList" :border="true" v-loading="collapse[1].loading">
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="130"
              :label="t('reuse.quantityTo')"
            >
              <template #default="scope">
                <el-form-item
                  :prop="`${scope.$index}.quantityTo`"
                  :rules="[
                    { required: true, message: 'age is required' },
                    { type: 'number', message: 'age must be a number' }
                  ]"
                >
                  <el-input v-model.number="scope.row.quantityTo" type="text" autocomplete="off" />
                </el-form-item>
              </template>
            </ElTableColumn>
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="130"
              prop="unit"
              :label="t('reuse.unit')"
            >
              <template #default="scope">
                <div>{{ scope.row.unit }}Chiếc</div>
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
                <el-form-item
                  :prop="`${scope.$index}.unitPrices`"
                  :rules="[
                    { required: true, message: 'age is required' },
                    { type: 'number', message: 'age must be a number' }
                  ]"
                >
                  <el-input v-model.number="scope.row.unitPrices" type="text" autocomplete="off"
                    ><template #append>đ</template></el-input
                  >
                </el-form-item>
              </template>
            </ElTableColumn>
            <ElTableColumn
              header-align="center"
              align="right"
              min-width="130"
              :label="t('formDemo.promotionPrice')"
            >
              <template #default="scope">
                <el-form-item
                  :prop="`${scope.$index}.promotionPrice`"
                  :rules="[
                    { required: true, message: 'age is required' },
                    { type: 'number', message: 'age must be a number' }
                  ]"
                >
                  <el-input v-model.number="scope.row.promotionPrice" type="text" autocomplete="off"
                    ><template #append>đ</template></el-input
                  >
                </el-form-item>
              </template>
            </ElTableColumn>
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="130"
              prop="createDate"
              :label="t('reuse.modifyDate')"
            />
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="160"
              fixed="right"
              :label="t('reuse.operator')"
            >
              <template #default="scope">
                <el-button type="danger" @click="handleDeleteRowSell(scope)">{{
                  t('reuse.delete')
                }}</el-button>
              </template>
            </ElTableColumn>
          </ElTable>
        </el-form>
        <div class="mt-4 flex flex-row-reverse gap-4">
          <el-button size="large" class="w-150px" @click="sellTableVisible = false">{{
            t('reuse.exit')
          }}</el-button>
          <el-button type="primary" size="large" class="w-150px" @click="saveDataSellTable">{{
            t('reuse.save')
          }}</el-button>
        </div>
      </el-dialog>
      <el-collapse-item :name="collapse[1].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[1].icon" link />
          <span class="text-center">{{ collapse[1].title }}</span>
        </template>
        <ElTable
          :data="collapse[1].tableList"
          :border="true"
          v-loading="collapse[1].loading"
          show-summary
        >
          <ElTableColumn
            header-align="center"
            min-width="100"
            prop="managementCode"
            :label="t('reuse.managementCode')"
          />
          <ElTableColumn
            header-align="center"
            min-width="250"
            prop="featureGroup"
            :label="t('reuse.featureGroup')"
          >
            <template #default="scope">
              <ElTreeSelect
                v-model="scope.row.featureGroupTree"
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
            min-width="200"
            prop="settingSale"
            :label="t('reuse.settingSale')"
          >
            <template #default="scope">
              <div class="flex gap-4">
                <el-button
                  :icon="plusIcon"
                  link
                  type="primary"
                  @click="openSellTable(scope.row.featureGroup)"
                  >{{ t('reuse.addPrice') }}</el-button
                >
                <ElSwitch v-model="scope.row.settingSale" @change="localeChange" />
              </div>
            </template>
          </ElTableColumn>

          <ElTableColumn
            header-align="center"
            align="center"
            min-width="200"
            prop="settingRent"
            :label="t('reuse.settingRent')"
          >
            <template #default="scope">
              <div class="flex justify-between">
                <el-button
                  :icon="plusIcon"
                  link
                  type="primary"
                  @click="openRentTable(scope.row.featureGroup)"
                  >{{ t('reuse.addPrice') }}</el-button
                >
                <ElSwitch v-model="scope.row.settingRent" @change="localeChange" />
              </div>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="200"
            prop="settingDeposit"
            :label="t('reuse.settingDeposit')"
          >
            <template #default="scope">
              <div class="flex justify-between">
                <el-button
                  :icon="plusIcon"
                  link
                  type="primary"
                  @click="openDepositTable(scope.row.featureGroup)"
                  >{{ t('reuse.addPrice') }}</el-button
                >
                <ElSwitch v-model="scope.row.settingDeposit" @change="localeChange" />
              </div>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="200"
            prop="settingPawn"
            :label="t('reuse.settingPawn')"
          >
            <template #default="scope">
              <div class="flex justify-between">
                <el-button
                  :icon="plusIcon"
                  link
                  type="primary"
                  @click="openPawnTable(scope.row.featureGroup)"
                  >{{ t('reuse.addPrice') }}</el-button
                >
                <ElSwitch v-model="scope.row.settingPawn" @change="localeChange" />
              </div>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="200"
            prop="settingSpa"
            :label="t('reuse.settingSpa')"
          >
            <template #default="scope">
              <div class="flex justify-between">
                <el-button
                  :icon="plusIcon"
                  link
                  type="primary"
                  @click="openSpaTable(scope.row.featureGroup)"
                  >{{ t('reuse.addPrice') }}</el-button
                >
                <ElSwitch v-model="scope.row.settingSpa" @change="localeChange" />
              </div>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="200"
            prop="inventory"
            :label="t('reuse.inventory')"
          >
            <template #default="scope">
              <div class="flex justify-between">
                <div>{{ scope.row.inventory }}</div>
                <el-button
                  :icon="plusIcon"
                  link
                  type="primary"
                  @click="openWarehouseTable(scope.row.featureGroup)"
                  >{{ t('reuse.detail') }}</el-button
                >
              </div>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            width="150"
            prop="update"
            :label="t('reuse.update')"
          />
          <ElTableColumn
            header-align="center"
            align="center"
            width="150"
            prop="status"
            :label="t('reuse.status')"
          />
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="200"
            fixed="right"
            :label="t('reuse.operator')"
          >
            <template #default="scope">
              <el-button v-if="scope.row.edited" type="primary" @click="handleSaveRow(scope.row)">{{
                t('reuse.save')
              }}</el-button>
              <el-button v-else type="default" @click="handleEditRow(scope.row)">{{
                t('reuse.edit')
              }}</el-button>
              <el-button type="danger" @click="handleEditRow(scope.row)">{{
                t('reuse.delete')
              }}</el-button>
            </template>
          </ElTableColumn>
        </ElTable>
        <el-button class="ml-5 mt-5" :icon="plusIcon">{{ collapse[1].buttonAdd }}</el-button>
      </el-collapse-item>
      <el-dialog
        v-model="rentTableVisible"
        :title="`${t('reuse.settingRentPrice')}/ ${rentDialogTitle}`"
        width="70%"
        @close="RentTableDialogClose"
      >
        <el-form :model="collapse[2].tableList" ref="rentForm">
          <ElTable :data="collapse[2].tableList" :border="true" v-loading="collapse[2].loading">
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="130"
              prop="quantityTo"
              :label="t('reuse.quantityTo')"
            >
              <template #default="scope">
                <el-form-item
                  :prop="`${scope.$index}.quantityTo`"
                  :rules="[
                    { required: true, message: 'age is required' },
                    { type: 'number', message: 'age must be a number' }
                  ]"
                >
                  <el-input v-model.number="scope.row.quantityTo" type="text" autocomplete="off" />
                </el-form-item>
              </template>
            </ElTableColumn>
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="130"
              prop="unit"
              :label="t('reuse.unit')"
            >
              <template #default="scope">
                <div>{{ scope.row.unit }}Chiếc</div>
              </template>
            </ElTableColumn>
            <ElTableColumn
              header-align="center"
              align="right"
              min-width="130"
              :label="t('reuse.dayRentalUnitPrice')"
            >
              <template #default="scope">
                <el-form-item
                  :prop="`${scope.$index}.dayRentalUnitPrice`"
                  :rules="[
                    { required: true, message: 'age is required' },
                    { type: 'number', message: 'age must be a number' }
                  ]"
                >
                  <el-input
                    v-model.number="scope.row.dayRentalUnitPrice"
                    type="text"
                    autocomplete="off"
                    ><template #append>đ</template></el-input
                  >
                </el-form-item>
              </template>
            </ElTableColumn>
            <ElTableColumn
              header-align="center"
              align="right"
              min-width="130"
              :label="t('reuse.weeklyRent')"
            >
              <template #default="scope">
                <el-form-item
                  :prop="`${scope.$index}.weeklyRent`"
                  :rules="[
                    { required: true, message: 'age is required' },
                    { type: 'number', message: 'age must be a number' }
                  ]"
                >
                  <el-input v-model.number="scope.row.weeklyRent" type="text" autocomplete="off"
                    ><template #append>đ</template></el-input
                  >
                </el-form-item>
              </template>
            </ElTableColumn>
            <ElTableColumn
              header-align="center"
              align="right"
              min-width="130"
              :label="t('reuse.monthlyRent')"
            >
              <template #default="scope">
                <el-form-item
                  :prop="`${scope.$index}.monthlyRent`"
                  :rules="[
                    { required: true, message: 'age is required' },
                    { type: 'number', message: 'age must be a number' }
                  ]"
                >
                  <el-input v-model.number="scope.row.monthlyRent" type="text" autocomplete="off"
                    ><template #append>đ</template></el-input
                  >
                </el-form-item>
              </template>
            </ElTableColumn>
            <ElTableColumn
              header-align="center"
              align="right"
              min-width="130"
              :label="t('reuse.rentDeposit')"
            >
              <template #default="scope">
                <el-form-item
                  :prop="`${scope.$index}.rentDeposit`"
                  :rules="[
                    { required: true, message: 'age is required' },
                    { type: 'number', message: 'age must be a number' }
                  ]"
                >
                  <el-input v-model.number="scope.row.rentDeposit" type="text" autocomplete="off"
                    ><template #append>đ</template></el-input
                  >
                </el-form-item>
              </template>
            </ElTableColumn>
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="130"
              prop="createDate"
              :label="t('reuse.modifyDate')"
            />
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="160"
              fixed="right"
              :label="t('reuse.operator')"
            >
              <template #default="scope">
                <el-button type="danger" @click="handleDeleteRowRent(scope)">{{
                  t('reuse.delete')
                }}</el-button>
              </template>
            </ElTableColumn>
          </ElTable>
        </el-form>
        <div class="mt-4 flex flex-row-reverse gap-4">
          <el-button size="large" class="w-150px" @click="rentTableVisible = false">{{
            t('reuse.exit')
          }}</el-button>
          <el-button type="primary" size="large" class="w-150px" @click="saveDataRentTable">{{
            t('reuse.save')
          }}</el-button>
        </div>
      </el-dialog>
      <el-dialog
        v-model="depositTableVisible"
        :title="`${t('reuse.settingDepositPrice')}/ ${depositDialogTitle}`"
        width="70%"
      >
        <el-form :model="collapse[3].tableList" ref="depositForm">
          <ElTable :data="collapse[3].tableList" :border="true" v-loading="collapse[3].loading">
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="130"
              :label="t('reuse.quantityTo')"
            >
              <template #default="scope">
                <el-form-item
                  :prop="`${scope.$index}.quantityTo`"
                  :rules="[
                    { required: true, message: 'age is required' },
                    { type: 'number', message: 'age must be a number' }
                  ]"
                >
                  <el-input v-model.number="scope.row.quantityTo" type="text" autocomplete="off" />
                </el-form-item>
              </template>
            </ElTableColumn>
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="130"
              prop="unit"
              :label="t('reuse.unit')"
            >
              <template #default="scope">
                <div>{{ scope.row.unit }}Chiếc</div>
              </template>
            </ElTableColumn>
            <ElTableColumn
              header-align="center"
              align="right"
              min-width="130"
              :label="t('reuse.depositFee')"
            >
              <template #default="scope">
                <el-form-item
                  :prop="`${scope.$index}.depositFee`"
                  :rules="[
                    { required: true, message: 'age is required' },
                    { type: 'number', message: 'age must be a number' }
                  ]"
                >
                  <el-input v-model.number="scope.row.depositFee" type="text" autocomplete="off"
                    ><template #append>%</template></el-input
                  >
                </el-form-item>
              </template>
            </ElTableColumn>
            <ElTableColumn
              header-align="center"
              align="right"
              min-width="130"
              :label="t('reuse.depositFee')"
            >
              <template #default="scope">
                <el-form-item
                  :prop="`${scope.$index}.depositFee`"
                  :rules="[
                    { required: true, message: 'age is required' },
                    { type: 'number', message: 'age must be a number' }
                  ]"
                >
                  <el-input v-model.number="scope.row.depositFee" type="text" autocomplete="off"
                    ><template #append>%</template></el-input
                  >
                </el-form-item>
              </template>
            </ElTableColumn>
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="130"
              prop="createDate"
              :label="t('reuse.modifyDate')"
            />
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="100"
              fixed="right"
              :label="t('reuse.operator')"
            />
          </ElTable>
        </el-form>
        <div class="mt-4 flex flex-row-reverse gap-4">
          <el-button size="large" class="w-150px" @click="depositTableVisible = false">{{
            t('reuse.exit')
          }}</el-button>
          <el-button type="primary" size="large" class="w-150px" @click="saveDataDepositTable">{{
            t('reuse.save')
          }}</el-button>
        </div>
      </el-dialog>
      <el-dialog
        v-model="pawnTableVisible"
        :title="`${t('reuse.settingPawnPrice')}/ ${pawnDialogTitle}`"
        width="70%"
      >
        <el-form :model="collapse[4].tableList" ref="pawnForm">
          <ElTable :data="collapse[4].tableList" :border="true" v-loading="collapse[4].loading">
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="130"
              :label="t('reuse.quantity')"
            >
              <template #default="scope">
                <el-form-item
                  :prop="`${scope.$index}.quantity`"
                  :rules="[
                    { required: true, message: 'age is required' },
                    { type: 'number', message: 'age must be a number' }
                  ]"
                >
                  <el-input v-model.number="scope.row.quantity" type="text" autocomplete="off" />
                </el-form-item>
              </template>
            </ElTableColumn>
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="130"
              prop="unit"
              :label="t('reuse.unit')"
            >
              <template #default="scope">
                <div>{{ scope.row.unit }}Chiếc</div>
              </template>
            </ElTableColumn>
            <ElTableColumn
              header-align="center"
              align="right"
              min-width="130"
              :label="t('reuse.interestMoneyFor1trPerDay')"
            >
              <template #default="scope">
                <el-form-item
                  :prop="`${scope.$index}.interestMoneyFor1trPerDay`"
                  :rules="[
                    { required: true, message: 'age is required' },
                    { type: 'number', message: 'age must be a number' }
                  ]"
                >
                  <el-input
                    v-model.number="scope.row.interestMoneyFor1trPerDay"
                    type="text"
                    autocomplete="off"
                    ><template #append>đ</template></el-input
                  >
                </el-form-item>
              </template>
            </ElTableColumn>
            <ElTableColumn
              header-align="center"
              align="right"
              min-width="130"
              :label="t('reuse.insuranceMoneyFor1trPerDay')"
            >
              <template #default="scope">
                <el-form-item
                  :prop="`${scope.$index}.depositFee`"
                  :rules="[
                    { required: true, message: 'age is required' },
                    { type: 'number', message: 'age must be a number' }
                  ]"
                >
                  <el-input v-model.number="scope.row.depositFee" type="text" autocomplete="off"
                    ><template #append>đ</template></el-input
                  >
                </el-form-item>
              </template>
            </ElTableColumn>
            <ElTableColumn
              header-align="center"
              align="right"
              min-width="130"
              :label="t('reuse.moneyFee')"
            >
              <template #default="scope">
                <el-form-item>
                  <el-input
                    :value="scope.row.interestMoneyFor1trPerDay * scope.row.depositFee"
                    type="text"
                    autocomplete="off"
                    ><template #append>đ</template></el-input
                  >
                </el-form-item>
              </template>
            </ElTableColumn>
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="130"
              prop="createDate"
              :label="t('reuse.modifyDate')"
            />
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="100"
              fixed="right"
              :label="t('reuse.operator')"
            />
          </ElTable>
        </el-form>
        <div class="mt-4 flex flex-row-reverse gap-4">
          <el-button size="large" class="w-150px" @click="pawnTableVisible = false">{{
            t('reuse.exit')
          }}</el-button>
          <el-button type="primary" size="large" class="w-150px" @click="saveDataPawnTable">{{
            t('reuse.save')
          }}</el-button>
        </div>
      </el-dialog>
      <el-dialog
        v-model="spaTableVisible"
        :title="`${t('reuse.settingSpaPrice')}/ ${spaDialogTitle}`"
        width="70%"
        @close="RentTableDialogClose"
      >
        <el-form :model="collapse[5].tableList" ref="spaForm">
          <ElTable :data="collapse[5].tableList" :border="true" v-loading="collapse[5].loading">
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="130"
              prop="service"
              :label="t('reuse.chooseService')"
            >
              <template #default="scope">
                <el-form-item
                  :prop="`${scope.$index}.service`"
                  :rules="[{ required: true, message: 'age is required', trigger: 'blur' }]"
                >
                  <el-select
                    v-model="scope.row.service"
                    multiple
                    placeholder="Select"
                    style="width: 240px"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </template>
            </ElTableColumn>
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="130"
              prop="standardTime"
              :label="t('reuse.standardTime')"
            >
              <template #default="scope">
                <div>{{ scope.row.standardTime }}{{ t('reuse.minute') }}</div>
              </template>
            </ElTableColumn>
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="130"
              prop="quantityTo"
              :label="t('reuse.quantityTo')"
            >
              <template #default>
                <div>1</div>
              </template>
            </ElTableColumn>
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="130"
              prop="unit"
              :label="t('reuse.unit')"
            >
              <template #default="scope">
                <div>{{ scope.row.unit }}Chiếc</div>
              </template>
            </ElTableColumn>
            <ElTableColumn
              header-align="center"
              align="right"
              min-width="130"
              :label="t('reuse.spaPrices')"
            >
              <template #default="scope">
                <el-form-item
                  :prop="`${scope.$index}.spaPrices`"
                  :rules="[
                    { required: true, message: 'age is required' },
                    { type: 'number', message: 'age must be a number' }
                  ]"
                >
                  <el-input v-model.number="scope.row.spaPrices" type="text" autocomplete="off"
                    ><template #append>đ</template></el-input
                  >
                </el-form-item>
              </template>
            </ElTableColumn>
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="130"
              prop="createDate"
              :label="t('reuse.modifyDate')"
            />
            <ElTableColumn
              header-align="center"
              align="center"
              min-width="160"
              fixed="right"
              :label="t('reuse.operator')"
            >
              <template #default="scope">
                <el-button type="danger" @click="handleDeleteRowSpa(scope)">{{
                  t('reuse.delete')
                }}</el-button>
              </template>
            </ElTableColumn>
          </ElTable>
        </el-form>
        <div class="mt-4 flex flex-row-reverse gap-4">
          <el-button size="large" class="w-150px" @click="spaTableVisible = false">{{
            t('reuse.exit')
          }}</el-button>
          <el-button type="primary" size="large" class="w-150px" @click="saveDataSpaTable">{{
            t('reuse.save')
          }}</el-button>
        </div>
      </el-dialog>
      <el-dialog
        v-model="warehouseTableVisible"
        :title="`${t('reuse.inventoryTracking')}/ ${warehouseDialogTitle}`"
        width="70%"
        @close="RentTableDialogClose"
      >
        <ElTable
          :data="collapse[6].tableList"
          :border="true"
          v-loading="collapse[6].loading"
          show-summary
        >
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="130"
            prop="date"
            :label="t('reuse.date')"
          />
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="130"
            prop="orderCode"
            :label="t('reuse.orderCode')"
          />
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="130"
            prop="importExportBillCode"
            :label="t('reuse.importExportBillCode')"
          />
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="130"
            prop="warehouseInformation"
            :label="t('reuse.warehouseInformation')"
          />
          <ElTableColumn
            header-align="center"
            align="right"
            min-width="130"
            prop="internal"
            :label="t('reuse.internal')"
          />
          <ElTableColumn
            header-align="center"
            align="right"
            min-width="130"
            prop="deposit"
            :label="t('reuse.deposit')"
          />
          <ElTableColumn
            header-align="center"
            align="right"
            min-width="130"
            prop="pawn"
            :label="t('reuse.pawn')"
          />
          <ElTableColumn
            header-align="center"
            align="right"
            min-width="130"
            prop="spa"
            :label="t('reuse.spa')"
          />
          <ElTableColumn
            header-align="center"
            align="right"
            min-width="130"
            prop="totalInvetory"
            :label="t('reuse.totalInvetory')"
          />
        </ElTable>
        <div class="mt-4 flex flex-row-reverse gap-4">
          <el-button size="large" class="w-150px" @click="warehouseTableVisible = false">{{
            t('reuse.exit')
          }}</el-button>
          <el-button type="primary" size="large" class="w-150px" @click="saveDataWarehouseTable">{{
            t('reuse.save')
          }}</el-button>
        </div>
      </el-dialog>
      <el-collapse-item :name="collapse[7].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[7].icon" link />
          <span class="text-center">{{ collapse[7].title }}</span>
        </template>
        <TableOperator
          :type="type"
          :id="id"
          @edit-data="editDataSeo"
          class="infinite-list"
          :hasImage="collapse[7].hasImage"
          style="overflow: auto"
          :schema="collapse[7].columns"
          :typeButton="collapse[7].typeButton"
          :class="[
            'bg-[var(--el-color-white)] dark:(bg-[var(--el-color-black)] border-[var(--el-border-color)] border-1px)'
          ]"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<style scoped>
.text-center {
  font-size: 20px;
}
.el-table .cell {
  word-break: break-word;
}
:deep(.el-collapse-item__wrap) {
  margin: 2rem;
}
:deep(.el-dialog) {
  height: 70vh;
  overflow: auto;
}
</style>
