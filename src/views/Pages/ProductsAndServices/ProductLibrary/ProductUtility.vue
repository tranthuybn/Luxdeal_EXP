<script setup lang="ts">
import { getTypePersonnelList } from '@/api/HumanResourceManagement'
import { getSpaLibrary } from '@/api/LibraryAndSetting'
import {
  getInventoryTrading,
  postProductLibrary,
  getBusinessProductLibrary,
  updateProductLibrary,
  updateProductSeo,
  getProductProperty,
  getCategories,
  postProductProperty,
  deleteProductProperty,
  getPriceProductProperty,
  changePriceProductProperty,
  updateProductProperty
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
  ElOption,
  ElTree,
  ElMessageBox
} from 'element-plus'
import TableOperatorTreeSelect from './TableOperatorTreeSelect.vue'
import { useIcon } from '@/hooks/web/useIcon'
import {
  columnProfileProduct,
  featuresRentalPrice,
  columnManagementSeo
} from './ProductLibraryManagement'
import { TableOperator } from '../../Components/TableBase'
import { Collapse } from '../../Components/Type'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter } from 'vue-router'
import { reactive, unref, watch } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { FORM_IMAGES } from '@/utils/format'
import { ref } from 'vue'
import { PRODUCTS_AND_SERVICES } from '@/utils/API.Variables'
import { productStatusTransferToText, dateTimeFormat } from '@/utils/format'

const { t } = useI18n()
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })

let colorData = reactive([])
let sizeData = reactive([])
let materialData = reactive([])
// call api for color, size, material
// get called when open the second collase
const getAttributeData = async () => {
  await getCategories({ TypeName: PRODUCTS_AND_SERVICES[1].key, pageSize: 100, pageIndex: 1 }).then(
    (res) =>
      (colorData = res.data.map((color) => ({ label: color.name, value: color.id, parentid: 1 })))
  )
  await getCategories({ TypeName: PRODUCTS_AND_SERVICES[2].key, pageSize: 100, pageIndex: 1 }).then(
    (res) =>
      (sizeData = res.data.map((size) => ({ label: size.name, value: size.id, parentid: 2 })))
  )
  await getCategories({ TypeName: PRODUCTS_AND_SERVICES[3].key, pageSize: 100, pageIndex: 1 }).then(
    (res) =>
      (materialData = res.data.map((material) => ({
        label: material.name,
        value: material.id,
        parentid: 3
      })))
  )
  treeSelectData.value[0].children = colorData
  treeSelectData.value[1].children = sizeData
  treeSelectData.value[2].children = materialData
}
const unitData = ref()
const ruleTreeFormRef = ref<FormInstance>()
const validateTree = (_rule: any, value: any, callback: any) => {
  if (value.length < 3) {
    callback(new Error(t('reuse.notFillAllInformation')))
  } else {
    callback()
  }
}
const treeRef = ref<InstanceType<typeof ElTree>>()
const treeSelectData = ref([
  {
    value: 1,
    label: t('reuse.color'),
    parentid: 0,
    children: []
  },
  {
    value: 2,
    label: t('reuse.size'),
    parentid: 0,
    children: []
  },
  {
    value: 3,
    label: t('reuse.material'),
    parentid: 0,
    children: []
  }
])
// làm lại lấy seo tag
const collapse: Array<Collapse> = reactive([
  {
    icon: minusIcon,
    name: 'information',
    title: t('reuse.productInformation'),
    columns: columnProfileProduct
  },
  {
    icon: plusIcon,
    name: 'priceCharacteristics',
    title: t('reuse.productAttributeTable'),
    api: getProductProperty,
    tableList: [],
    loading: true
  },
  {
    icon: plusIcon,
    name: 'rentalPriceCharacteristics ',
    columns: featuresRentalPrice,
    api: getPriceProductProperty,
    tableList: [],
    loading: true
  },
  {
    icon: plusIcon,
    name: 'depositFee',
    api: getPriceProductProperty,
    tableList: [],
    loading: true
  },
  {
    icon: plusIcon,
    name: 'pawnFee',
    api: getPriceProductProperty,
    tableList: [],
    loading: true
  },
  {
    icon: plusIcon,
    name: 'SpaPrice',
    api: getPriceProductProperty,
    tableList: [],
    loading: true
  },
  {
    icon: plusIcon,
    name: 'inventoryTrading',
    api: getInventoryTrading,
    tableList: [],
    loading: true
  },
  {
    icon: plusIcon,
    name: 'managementSeo',
    title: t('reuse.seoManagement'),
    columns: columnManagementSeo,
    api: getTypePersonnelList,
    hasImage: false
  },
  {
    icon: plusIcon,
    name: 'sellFee',
    api: getPriceProductProperty,
    tableList: [],
    loading: true
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
const addLastRowAttribute = () => {
  const findId = isNaN(id) ? newId.value : id
  collapse[1].tableList.push({
    productCode: productData.productCode,
    productId: findId,
    code: 'string', //api chua tra
    categories: [
      {
        id: null,
        key: 'Color',
        value: ''
      },
      {
        id: null,
        key: 'Material',
        value: ''
      },
      {
        id: null,
        key: 'Size',
        value: ''
      },
      {
        id: 116,
        key: 'State',
        value: 'Small(15.5 - 30.5)'
      }
    ],
    bussinessSetups: [
      {
        id: 1,
        serviceType: 1,
        key: 'Ban',
        value: false,
        hasPrice: false
      },
      {
        id: 2,
        serviceType: 2,
        key: 'KyGui',
        value: false,
        hasPrice: false
      },
      {
        id: 3,
        serviceType: 3,
        key: 'ChoThue',
        value: false,
        hasPrice: false
      },
      {
        id: 4,
        serviceType: 4,
        key: 'TheChap',
        value: false,
        hasPrice: false
      },
      {
        id: 5,
        serviceType: 5,
        key: 'Spa',
        value: false,
        hasPrice: false
      }
    ],
    edited: true, //edit data (turn to treeSelect, input ...)
    newValue: true //check is newValue so dont have to call api
  })
}
// save and add cant open this Collapse
// (newID) ? disabledTabOpen.value = false : ''
const openLastCollapse = ref(false)
const OpenCollapse = () => {
  if (disabledTabOpen.value == true) {
    ElNotification({
      message: t('reuse.cannotOpenBecauseNotCreateProduct'),
      type: 'error'
    })
  }
  openLastCollapse.value = true
}
const activeName = ref(collapse[0].name)
const handleDeleteRow = async (scope) => {
  scope.row.newValue
    ? collapse[1].tableList.pop()
    : ElMessageBox.confirm(`${t('reuse.deleteWarning')}`, t('reuse.removeProductProperty'), {
        confirmButtonText: t('reuse.delete'),
        cancelButtonText: t('reuse.exit'),
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      })
        .then(async () => {
          await deleteProductProperty({ id: scope.row.id })
            .then(
              () =>
                ElNotification({
                  message: t('reuse.deleteSuccess'),
                  type: 'success'
                }),
              collapse[1].tableList.splice(scope.$index, 1)
            )
            .catch(() =>
              ElNotification({
                message: t('reuse.deleteFail'),
                type: 'error'
              })
            )
        })
        .catch((error) => {
          if (error == 'cancel') {
            ElNotification({
              type: 'info',
              message: t('reuse.deleteCancel')
            })
          } else {
            ElNotification({
              message: t('reuse.deleteFail'),
              type: 'error'
            })
          }
        })
}
const handleEditRow = (data) => {
  data.edited = true
  data.categoriesValue = []
  if (!data.newValue) {
    data.categoriesValue.push(data.categories[0].id, data.categories[2].id, data.categories[1].id)
  }
}

//cannot turn on switch when has no price
const warningForSwitch = (rowDisabled: boolean) => {
  if (rowDisabled) {
    ElNotification({
      message: t('reuse.clickEditForEditing'),
      type: 'info'
    })
  }
}
const changeDataSwitch = (scope, dataSwitch) => {
  scope.row.bussinessSetups![scope.cellIndex - 2]!.hasPrice
    ? (scope.row.bussinessSetups![scope.cellIndex - 2]!.value = dataSwitch)
    : ElNotification({
        message: t('reuse.addPricesBeforeTurningOnSetting'),
        type: 'warning'
      })
}
const emptyUpdateProductPropertyObj = {} as ProductProperty
const customUpdateData = reactive(emptyUpdateProductPropertyObj)
const customUpdate = async (data) => {
  customUpdateData.id = data.id ? data.id : newProductPropertyId.value
  customUpdateData.code = data.code
  customUpdateData.categories = []
  customUpdateData.categories[0] = {
    id: 1
    //"key": "Gender",
    //"value": "Túi + Ví"
  }
  customUpdateData.categories[1] = { ...data.categories[0] }
  customUpdateData.categories[2] = { ...data.categories[2] }
  customUpdateData.categories[3] = { ...data.categories[1] }
  customUpdateData.categories[4] = {
    id: 116 //"key": "State",
    //"value": "New"
  }
  customUpdateData.bussinessSetups = data.bussinessSetups
  return customUpdateData
}

const newProductPropertyId = ref<number>()
//check validate then newValue
const handleSaveRow = (data, formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      data.edited = false
      if (data?.newValue == true) {
        await postProductProperty(JSON.stringify(data))
          .then((res) => {
            ;(data.newValue = false),
              (newProductPropertyId.value = res.data),
              ElNotification({
                message: t('reuse.addSuccess'),
                type: 'success'
              })
          })
          //chua co xoa row cuoi khi post Fail
          .catch(() => {
            collapse[1].tableList.pop()
            ElNotification({
              message: t('reuse.addFail'),
              type: 'error'
            })
          })
      } else {
        data = await customUpdate(data)
        await updateProductProperty(JSON.stringify(data))
          .then(() => {
            ElNotification({
              message: t('reuse.updateSuccess'),
              type: 'success'
            })
          })
          .catch(() => {
            ElNotification({
              message: t('reuse.updateFail'),
              type: 'error'
            })
          })
      }
    } else {
      ElNotification({
        message: t('reuse.fillAllAttribute'),
        type: 'warning'
      })
      return false
    }
  })
}
// only check 1 child node from 1 parent node
const customCheck = (nodeObj, _selected, _subtree, row) => {
  const tree = treeRef.value!.getCheckedNodes(false, false)
  let sameParent = false
  switch (nodeObj.parentid) {
    case 0:
      sameParent = true
      break
    case 1:
      const nodeBefore = tree.find((node) => {
        return node.parentid == 1 && node.value != nodeObj.value
      })
      treeRef.value!.setChecked(nodeBefore?.value, false, false)
      treeRef.value!.setChecked(nodeObj.value, true, true)
      break
    case 2:
      const nodeBefore2 = tree.find((node) => {
        return node.parentid == 2 && node.value != nodeObj.value
      })
      treeRef.value!.setChecked(nodeBefore2?.value, false, false)
      treeRef.value!.setChecked(nodeObj.value, true, true)
      break
    case 3:
      const nodeBefore3 = tree.find((node) => {
        return node.parentid == 3 && node.value != nodeObj.value
      })
      treeRef.value!.setChecked(nodeBefore3?.value, false, false)
      treeRef.value!.setChecked(nodeObj.value, true, true)
      break
  }
  if (sameParent) {
    ElNotification({
      message: t('reuse.cantChooseMultipleValueForOneAttribute'),
      type: 'warning'
    })
    treeRef.value!.setChecked(nodeObj.value, false, false)
  }
  const colorNode = tree.find((node) => node.parentid == 1)
  colorNode
    ? ((row.categories[0].id = colorNode.value), (row.categories[0].value = colorNode.label))
    : ''
  const sizeNode = tree.find((node) => node.parentid == 2)
  sizeNode
    ? ((row.categories[2].id = sizeNode.value), (row.categories[2].value = sizeNode.label))
    : ''
  const materialNode = tree.find((node) => node.parentid == 3)
  materialNode
    ? ((row.categories[1].id = materialNode.value), (row.categories[1].value = materialNode.label))
    : ''
  row.categoriesValue = tree.map((node) => node.value)
  row.categoriesLabel = tree.map((node) => node.label)
}
//get data from router
const router = useRouter()
let id = Number(router.currentRoute.value.params.id)
const type = String(router.currentRoute.value.params.type)

const { required, notSpecialCharacters, ValidService, notSpace } = useValidator()
const rules = reactive({
  ProductTypeId: [required()],
  BrandId: [required()],
  UnitId: [required()],
  OriginId: [required()],
  ProductCode: [
    { validator: notSpace },
    { validator: notSpecialCharacters },
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
  Description: [{ validator: ValidService.checkDescriptionLength.validator }],
  HireInventoryStatus: [required()],
  SellInventoryStatus: [required()]
})
const ruleSEO = reactive({
  SeoTitle: [
    required(),
    { validator: notSpecialCharacters },
    { validator: ValidService.checkNameLength.validator }
  ],
  SeoUrl: [required()],
  SeoTags: [{ required: true, trigger: 'blur', message: t('common.required') }],
  SeoDescription: [required(), { validator: ValidService.checkDescriptionLength.validator }]
})
let callTableApiTime = 0
const callTableApi = async (collapseItem) => {
  if (collapseItem.api !== undefined) {
    if (callTableApiTime == 0) {
      const findId = isNaN(id) ? newId.value : id
      const res = await collapseItem.api({ ProductId: findId })
      collapseItem.tableList = res.data
      await getAttributeData()
      callTableApiTime++
    }
  }
  collapseItem.loading = false
}
const getUnitValue = async (UnitId) => {
  let unitSelect = { name: '' }
  const res = await getCategories({
    TypeName: PRODUCTS_AND_SERVICES[6].key,
    pageSize: 100,
    pageIndex: 1
  })
  if (res) {
    unitSelect = res.data.find((unit) => unit.id == UnitId)
    unitData.value = unitSelect?.name
  }
}
// bảo backend trả id để xóa luôn ko cần reload trang
const postData = async (data) => {
  const UnitId = data.UnitId
  await postProductLibrary(FORM_IMAGES(data))
    .then((res) => {
      newId.value = res.data
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      })
      disabledTabOpen.value = false
    })
    .catch(() =>
      ElNotification({
        message: t('reuse.addFail'),
        type: 'error'
      })
    )
    //maybe use async await
    .finally(() => {
      getUnitValue(UnitId)
    })
}
// init reactive type
// could do better somehow... [key: string]: any
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
type ProductProperty = {
  [key: string]: any
}
const emptyProductPropertyObj = {} as ProductProperty

type seoData = {
  SeoTitle: string
  SeoUrl: string
  SeoTags: Array<string>
  SeoDescription: string
}
const emptySeoObj = {} as seoData
let productData = reactive(emptyProductPropertyObj)

const SEOdata = reactive(emptySeoObj)
const customSeoData = (formData) => {
  formData.seoTitle ? (SEOdata.SeoTitle = formData.seoTitle) : (SEOdata.SeoTitle = '')
  formData.seoUrl ? (SEOdata.SeoUrl = formData.seoUrl) : (SEOdata.SeoUrl = '')
  SEOdata.SeoTags = []
  if (formData.seoTags) {
    SEOdata.SeoTags = formData.seoTags.map((tag) => tag.key)
  }
  formData.seoDescription
    ? (SEOdata.SeoDescription = formData.seoDescription)
    : (SEOdata.SeoDescription = '')
}
//manipulate data so can sent to form(Table Operator)
const customizeData = async (formData) => {
  productData = formData
  setFormData.BrandId = formData.categories[0].id
  setFormData.ProductTypeId = formData.categories[1].value
  setFormData.UnitId = formData.categories[2].id
  setFormData.OriginId = formData.categories[3].id
  setFormData.ProductCode = formData.productCode
  setFormData.ShortDescription = formData.shortDescription
  setFormData.Name = formData.name
  setFormData.Description = formData.description
  unitData.value = formData.categories[2].value
  customSeoData(formData)
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
  data.SeoTags = data.SeoTags.toString()
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
  collapse[8].tableList.splice(scope.$index, 1)
}
//table dialog
const sellTableVisible = ref(false)
const rentTableVisible = ref(false)
const depositTableVisible = ref(false)
const pawnTableVisible = ref(false)
const spaTableVisible = ref(false)
const warehouseTableVisible = ref(false)
let callApiWarehouseTable = 0

let spaDialogTitle = ref('')
const openSpaTable = async (scope) => {
  spaDialogTitle.value = `${scope.row.categories[0].value},${scope.row.categories[1].value},${scope.row.categories[2].value}`
  const findPropertyId = isNaN(scope.row.id) ? newProductPropertyId.value : scope.row.id
  if (findPropertyId == undefined) {
    ElNotification({
      message: 'Chưa lưu',
      type: 'warning'
    })
  } else {
    spaTableVisible.value = true
    await getSpaLibrary({ PageIndex: 1, PageSize: 100 }).then(
      (res) =>
        (SpaSelectOptions.value = res.data.map((spa) => ({
          label: spa.name,
          value: spa.id,
          key: spa.id,
          time: spa.time
        })))
    )
    const res = collapse[5].api
      ? await collapse[5].api({ ProductPropertyId: findPropertyId, ServiceType: 5 })
      : ''
    if (res.data.length == 0) {
      collapse[5].tableList = []
      collapse[5].tableList.push({
        quantity: 1,
        prices: [{ price: undefined, SpaServicesSelected: [], spaTotalTime: 0 }]
      })
    } else {
      collapse[5].tableList = []
      collapse[5].tableList = res.data[0].prices
      collapse[5].tableList.map((row) => {
        ;((row.SpaServicesSelected = []),
        (row.spaTotalTime = row.spaTime),
        (row.updateDate = res.data[0].updateDate)),
          (row.SpaServicesSelected = row.spaServices.map((spa) => spa.id)),
          (row.spaServices = [])
      })
      console.log('collapse[5].tableList', collapse[5].tableList)
      console.log('SpaSelectOptions', SpaSelectOptions.value)
    }
    collapse[5].tableList.productPropertyId = findPropertyId
    collapse[5].tableList.serviceType = 5
    collapse[5].tableList.currentRow = scope.$index
  }
  collapse[5].loading = false
  forceRemove.value == false
}
let warehouseDialogTitle = ref('')
const openWarehouseTable = async (dialogTitle) => {
  warehouseDialogTitle.value = dialogTitle
  warehouseTableVisible.value = true
  if (callApiWarehouseTable == 0) {
    const res = collapse[6].api ? await collapse[6].api({ pageSize: 10, pageIndex: 1 }) : ''
    collapse[6].tableList = res.data
    collapse[6].loading = false
    callApiWarehouseTable++
  }
}
let pawnDialogTitle = ref('')
const openPawnTable = async (scope) => {
  pawnDialogTitle.value = `${scope.row.categories[0].value},${scope.row.categories[1].value},${scope.row.categories[2].value}`
  const findPropertyId = isNaN(scope.row.id) ? newProductPropertyId.value : scope.row.id
  if (findPropertyId == undefined) {
    ElNotification({
      message: 'Chưa lưu',
      type: 'warning'
    })
  } else {
    pawnTableVisible.value = true
    const res = collapse[4].api
      ? await collapse[4].api({ ProductPropertyId: findPropertyId, ServiceType: 4 })
      : ''
    if (res.data.length == 0) {
      collapse[4].tableList = []
      collapse[4].tableList.push({
        quantity: 1,
        prices: [
          { priceType: 4, price: undefined },
          { priceType: 5, price: undefined }
        ]
      })
    } else {
      collapse[4].tableList = []
      collapse[4].tableList = res.data
    }
    collapse[4].tableList.productPropertyId = findPropertyId
    collapse[4].tableList.serviceType = 4
    collapse[4].tableList.currentRow = scope.$index
  }
  collapse[4].loading = false
  forceRemove.value == false
}
let depositDialogTitle = ref('')
const openDepositTable = async (scope) => {
  depositDialogTitle.value = `${scope.row.categories[0].value},${scope.row.categories[1].value},${scope.row.categories[2].value}`
  const findPropertyId = isNaN(scope.row.id) ? newProductPropertyId.value : scope.row.id
  if (findPropertyId == undefined) {
    ElNotification({
      message: 'Chưa lưu',
      type: 'warning'
    })
  } else {
    depositTableVisible.value = true
    const res = collapse[3].api
      ? await collapse[3].api({ ProductPropertyId: findPropertyId, ServiceType: 3 })
      : ''
    if (res.data.length == 0) {
      collapse[3].tableList = []
      collapse[3].tableList.push({
        quantity: 1,
        prices: [{ price: undefined }, { price: undefined }]
      })
    } else {
      collapse[3].tableList = []
      collapse[3].tableList = res.data
    }
    collapse[3].tableList.productPropertyId = findPropertyId
    collapse[3].tableList.serviceType = 3
    collapse[3].tableList.currentRow = scope.$index
  }
  collapse[3].loading = false
  forceRemove.value == false
}
let rentDialogTitle = ref('')
const openRentTable = async (scope) => {
  rentDialogTitle.value = `${scope.row.categories[0].value},${scope.row.categories[1].value},${scope.row.categories[2].value}`
  const findPropertyId = isNaN(scope.row.id) ? newProductPropertyId.value : scope.row.id
  if (findPropertyId == undefined) {
    ElNotification({
      message: 'Chưa lưu',
      type: 'warning'
    })
  } else {
    rentTableVisible.value = true
    const res = collapse[2].api
      ? await collapse[2].api({ ProductPropertyId: findPropertyId, ServiceType: 2 })
      : ''
    if (res.data.length == 0) {
      collapse[2].tableList = []
      collapse[2].tableList.push({
        quantity: undefined,
        prices: [
          { price: undefined },
          { price: undefined },
          { price: undefined },
          { price: undefined }
        ]
      })
    } else {
      collapse[2].tableList = []
      collapse[2].tableList = res.data
    }
    collapse[2].tableList.productPropertyId = findPropertyId
    collapse[2].tableList.serviceType = 2
    collapse[2].tableList.currentRow = scope.$index
  }
  collapse[2].loading = false
  forceRemove.value == false
}
let sellDialogTitle = ref('')
const openSellTable = async (scope) => {
  sellDialogTitle.value = `${scope.row.categories[0].value},${scope.row.categories[1].value},${scope.row.categories[2].value}`
  const findPropertyId = isNaN(scope.row.id) ? newProductPropertyId.value : scope.row.id
  if (findPropertyId == undefined) {
    ElNotification({
      message: 'Chưa lưu',
      type: 'warning'
    })
  } else {
    sellTableVisible.value = true
    const res = collapse[8].api
      ? await collapse[8].api({ ProductPropertyId: findPropertyId, ServiceType: 1 })
      : ''
    if (res.data.length == 0) {
      collapse[8].tableList = []
      collapse[8].tableList.push({
        quantity: undefined,
        prices: [
          { price: undefined, priceType: 1 },
          { price: undefined, priceType: 2 }
        ]
      })
    } else {
      collapse[8].tableList = []
      collapse[8].tableList = res.data
    }
    collapse[8].tableList.productPropertyId = findPropertyId
    collapse[8].tableList.serviceType = 1
    collapse[8].tableList.currentRow = scope.$index
  }
  collapse[8].loading = false
  forceRemove.value == false
}
const rentForm = ref<FormInstance>()
const depositForm = ref<FormInstance>()
const sellForm = ref<FormInstance>()
const pawnForm = ref<FormInstance>()
const spaForm = ref<FormInstance>()
const forceRemove = ref(false)

let SpaSelectOptions = ref()
const updateTimeSpa = (value, scope) => {
  scope.row.spaTotalTime = 0
  let time = 0
  scope.row.SpaServicesSelected.map(
    (spa) => (time += SpaSelectOptions.value.find((option) => option.value == spa)?.time)
  )
  scope.row.spaTotalTime = time
  console.log('value spa', value, scope, SpaSelectOptions.value, time)
}
//add row to the end of table if fill all table
watch(
  () => collapse[8].tableList[collapse[8].tableList.length - 1],
  () => {
    if (
      collapse[8].tableList.length < 1 ||
      (collapse[8].tableList[collapse[8].tableList.length - 1].quantity !== undefined &&
        collapse[8].tableList[collapse[8].tableList.length - 1].prices[0].price !== undefined &&
        collapse[8].tableList[collapse[8].tableList.length - 1].prices[1].price !== undefined &&
        forceRemove.value == false)
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
      collapse[5].tableList.length < 1 ||
      (collapse[5].tableList[collapse[5].tableList.length - 1].price !== undefined &&
        collapse[5].tableList[collapse[5].tableList.length - 1].SpaServicesSelected.length > 0 &&
        forceRemove.value == false)
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
      collapse[2].tableList.length < 1 ||
      (collapse[2].tableList[collapse[2].tableList.length - 1].quantity !== undefined &&
        collapse[2].tableList[collapse[2].tableList.length - 1].prices[1].price !== undefined &&
        collapse[2].tableList[collapse[2].tableList.length - 1].prices[2].price !== undefined &&
        collapse[2].tableList[collapse[2].tableList.length - 1].prices[3].price !== undefined &&
        collapse[2].tableList[collapse[2].tableList.length - 1].prices[0].price !== undefined &&
        forceRemove.value == false)
    ) {
      addLastIndexRentTable()
    }
  },
  { deep: true }
)
const addLastIndexSellTable = () => {
  collapse[8].tableList.push({
    quantity: undefined,
    prices: [{ price: undefined }, { price: undefined }]
  })
}
const addLastIndexRentTable = () => {
  collapse[2].tableList.push({
    quantity: undefined,
    prices: [{ price: undefined }, { price: undefined }, { price: undefined }, { price: undefined }]
  })
}
const addLastIndexSpaTable = () => {
  collapse[5].tableList.push({ price: undefined, SpaServicesSelected: [], spaTotalTime: 0 })
}
const customPostSpaPrice = (data) => {
  console.log('runhere')
  const customPostPriceData = reactive(emptyUpdateProductPropertyObj)
  customPostPriceData.productPropertyPrices = [{}]
  customPostPriceData.productPropertyPrices[0].quantity = 1
  customPostPriceData.productPropertyPrices[0].prices = data
  customPostPriceData.productPropertyId = data.productPropertyId
  customPostPriceData.serviceType = 5
  console.log('runhere', data, customPostPriceData)
  customPostPriceData.productPropertyPrices[0].prices.map((spa) => {
    spa.spaServices = []
    spa.spaTime = spa.spaTotalTime
    spa.SpaServicesSelected.forEach((ele) => {
      spa.spaServices.push({ id: ele })
    })
  })
  console.log('data5', data, customPostPriceData)
  return customPostPriceData
}
const saveDataSpaTable = async () => {
  removeLastRowSpa()
  await unref(spaForm)!.validate((valid) => {
    if (valid) {
      const data = customPostSpaPrice(collapse[5].tableList)
      changePriceProductProperty(JSON.stringify(data))
        .then(() => {
          ElNotification({
            message: t('reuse.saveSuccess'),
            type: 'success'
          }),
            (collapse[1].tableList[collapse[5].tableList.currentRow].bussinessSetups[4].hasPrice =
              true)
        })
        .catch(() => {
          ElNotification({
            message: t('reuse.saveFail'),
            type: 'warning'
          })
        })
        .finally(() => (spaTableVisible.value = false))
    } else {
      forceRemove.value = false
    }
  })
}
const saveDataRentTable = async () => {
  removeLastRowRent()
  await unref(rentForm)!.validate((valid) => {
    if (valid) {
      rentTableVisible.value = false
      const data = customPostPrice(collapse[2].tableList)
      changePriceProductProperty(JSON.stringify(data))
        .then(() => {
          ElNotification({
            message: t('reuse.saveSuccess'),
            type: 'success'
          }),
            (collapse[1].tableList[collapse[2].tableList.currentRow].bussinessSetups[1].hasPrice =
              true)
        })
        .catch(() => {
          ElNotification({
            message: t('reuse.saveFail'),
            type: 'warning'
          })
        })
    } else {
      forceRemove.value = false
    }
  })
}
const saveDataWarehouseTable = async () => {
  warehouseTableVisible.value = false
}
const saveDataPawnTable = async () => {
  await unref(pawnForm)!.validate((valid) => {
    if (valid) {
      pawnTableVisible.value = false
      const data = customPostPrice(collapse[4].tableList)
      changePriceProductProperty(JSON.stringify(data))
        .then(() => {
          ElNotification({
            message: t('reuse.addSuccess'),
            type: 'success'
          }),
            (collapse[1].tableList[collapse[4].tableList.currentRow].bussinessSetups[3].hasPrice =
              true)
        })
        .catch(() => {
          ElNotification({
            message: t('reuse.addFail'),
            type: 'warning'
          })
        })
    } else {
      ElNotification({
        message: t('reuse.saveFail'),
        type: 'warning'
      })
    }
  })
}
const saveDataDepositTable = async () => {
  await unref(depositForm)!.validate((valid) => {
    if (valid) {
      depositTableVisible.value = false
      const data = customPostPrice(collapse[3].tableList)
      changePriceProductProperty(JSON.stringify(data))
        .then(() => {
          ElNotification({
            message: t('reuse.addSuccess'),
            type: 'success'
          }),
            (collapse[1].tableList[collapse[3].tableList.currentRow].bussinessSetups[2].hasPrice =
              true)
        })
        .catch(() => {
          ElNotification({
            message: t('reuse.addFail'),
            type: 'warning'
          })
        })
    } else {
      ElNotification({
        message: t('reuse.addFail'),
        type: 'warning'
      })
    }
  })
}
const customPostPrice = (data) => {
  const customPostPriceData = reactive(emptyUpdateProductPropertyObj)
  customPostPriceData.productPropertyId = data.productPropertyId
  customPostPriceData.serviceType = data.serviceType
  customPostPriceData.productPropertyPrices = data
  return customPostPriceData
}
const saveDataSellTable = async () => {
  removeLastRowSell()
  await unref(sellForm)!.validate((valid) => {
    if (valid) {
      sellTableVisible.value = false
      const data = customPostPrice(collapse[8].tableList)
      changePriceProductProperty(JSON.stringify(data))
        .then(() => {
          ElNotification({
            message: t('reuse.addSuccess'),
            type: 'success'
          }),
            (collapse[1].tableList[collapse[8].tableList.currentRow].bussinessSetups[0].hasPrice =
              true)
        })
        .catch(() => {
          ElNotification({
            message: t('reuse.addFail'),
            type: 'warning'
          })
        })
    } else {
      forceRemove.value = false
    }
  })
}
const removeLastRowSell = () => {
  if (
    //check if all field of last row are empty
    collapse[8].tableList[collapse[8].tableList.length - 1]?.quantity == undefined &&
    collapse[8].tableList[collapse[8].tableList.length - 1]?.prices[0].price == undefined &&
    collapse[8].tableList[collapse[8].tableList.length - 1]?.prices[1].price == undefined
  ) {
    //force remove so watch cannot add new row at the last index
    forceRemove.value = true
    collapse[8].tableList.splice(-1)
  }
}
const removeLastRowRent = () => {
  if (
    collapse[2].tableList[collapse[2].tableList.length - 1].quantity == undefined &&
    collapse[2].tableList[collapse[2].tableList.length - 1].prices[1].price == undefined &&
    collapse[2].tableList[collapse[2].tableList.length - 1].prices[2].price == undefined &&
    collapse[2].tableList[collapse[2].tableList.length - 1].prices[3].price == undefined &&
    collapse[2].tableList[collapse[2].tableList.length - 1].prices[0].price == undefined
  ) {
    forceRemove.value = true
    collapse[2].tableList.splice(-1)
  }
}
const removeLastRowSpa = () => {
  if (
    collapse[5].tableList[collapse[5].tableList.length - 1].price == undefined &&
    collapse[5].tableList[collapse[5].tableList.length - 1].SpaServicesSelected.length == 0
  ) {
    forceRemove.value = true
    collapse[5].tableList.splice(-1)
  }
}
const SpaTableDialogClose = () => {
  forceRemove.value = false
}
const RentTableDialogClose = () => {
  forceRemove.value = false
}
const SellTableDialogClose = () => {
  forceRemove.value = false
}

//handle opentab
const disabledTabOpen = ref(false)
const newId = ref<number>()
//type == '' && isNaN(id) =true  when refreshing page
if ((type == '' && isNaN(id)) || type == 'add') {
  disabledTabOpen.value = true
}
watch(
  () => newId,
  () => {
    disabledTabOpen.value = false
  }
)
</script>
<template>
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
      <el-form :model="collapse[8].tableList" ref="sellForm">
        <ElTable :data="collapse[8].tableList" :border="true" v-loading="collapse[8].loading">
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="130"
            :label="t('reuse.quantityTo')"
          >
            <template #default="scope">
              <el-form-item
                :prop="`${scope.$index}.quantity`"
                :rules="[required(), { type: 'number', message: t('reuse.validateEnterNumber') }]"
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
            <template #default>
              <!--get this data from product Api-->
              <div>{{ unitData }}</div>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="right"
            min-width="130"
            :label="t('reuse.unitPrices')"
          >
            <template #default="scope">
              <el-form-item
                :prop="`${scope.$index}.prices[0].price`"
                :rules="[required(), { type: 'number', message: t('reuse.validateEnterNumber') }]"
              >
                <el-input v-model.number="scope.row.prices[0].price" type="text" autocomplete="off"
                  ><template #append>đ</template></el-input
                >
              </el-form-item>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="right"
            min-width="130"
            :label="t('formDemo.promotionalPrice')"
          >
            <template #default="scope">
              <el-form-item
                :prop="`${scope.$index}.prices[1].price`"
                :rules="[required(), { type: 'number', message: t('reuse.validateEnterNumber') }]"
              >
                <el-input v-model.number="scope.row.prices[1].price" type="text" autocomplete="off"
                  ><template #append>đ</template></el-input
                >
              </el-form-item>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="130"
            :label="t('reuse.modifyDate')"
            ><template #default="scope">{{
              dateTimeFormat(scope.row.updateDate)
            }}</template></ElTableColumn
          >
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="100"
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
    <el-collapse-item :name="collapse[1].name" @click="OpenCollapse" :disabled="disabledTabOpen">
      <template #title>
        <el-button class="header-icon" :icon="collapse[1].icon" link :disabled="disabledTabOpen" />
        <span class="text-center">{{ collapse[1].title }}</span>
      </template>
      <el-form ref="ruleTreeFormRef" :model="collapse[1].tableList">
        <ElTable
          :data="collapse[1].tableList"
          :border="true"
          v-loading="collapse[1].loading"
          show-summary
        >
          <ElTableColumn
            header-align="center"
            min-width="100"
            prop="productCode"
            :label="t('reuse.managementCode')"
          />
          <ElTableColumn header-align="center" min-width="250" :label="t('reuse.featureGroup')">
            <template #default="scope">
              <el-form-item
                v-if="scope.row.edited"
                :prop="`${scope.$index}.categoriesValue`"
                :rules="[{ validator: validateTree, trigger: 'blur' }]"
              >
                <ElTreeSelect
                  v-model="scope.row.categoriesValue"
                  :data="treeSelectData"
                  multiple
                  accordion
                  check-strictly
                  :render-after-expand="false"
                  @check-change="
                    (nodeObj, selected, subtree) =>
                      customCheck(nodeObj, selected, subtree, scope.row)
                  "
                  ref="treeRef"
                  show-checkbox
                  node-key="value"
                />
              </el-form-item>
              <span v-else>{{
                scope.row.categoriesLabel
                  ? scope.row.categoriesLabel.toString()
                  : `${scope.row.categories[0].value},${scope.row.categories[1].value},${scope.row.categories[2].value}`
              }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="200"
            :label="t('reuse.settingSale')"
          >
            <template #default="scope">
              <div class="flex gap-4">
                <el-button
                  :icon="plusIcon"
                  link
                  :type="scope.row.bussinessSetups[0].hasPrice ? 'primary' : 'warning'"
                  @click="openSellTable(scope)"
                  >{{ t('reuse.addPrice') }}</el-button
                >
                <ElSwitch
                  :model-value="scope.row.bussinessSetups[0]?.value"
                  :disabled="!scope.row.edited"
                  size="large"
                  inline-prompt
                  active-text="On"
                  inactive-text="Off"
                  @click="warningForSwitch(!scope.row.edited)"
                  @change="(data) => changeDataSwitch(scope, data)"
                />
              </div>
            </template>
          </ElTableColumn>

          <ElTableColumn
            header-align="center"
            align="center"
            min-width="200"
            :label="t('reuse.settingRent')"
          >
            <template #default="scope">
              <div class="flex justify-between">
                <el-button
                  :icon="plusIcon"
                  link
                  :type="scope.row.bussinessSetups[1].hasPrice ? 'primary' : 'warning'"
                  @click="openRentTable(scope)"
                  >{{ t('reuse.addPrice') }}</el-button
                >
                <ElSwitch
                  :model-value="scope.row.bussinessSetups[1]?.value"
                  :disabled="!scope.row.edited"
                  size="large"
                  inline-prompt
                  active-text="On"
                  inactive-text="Off"
                  @click="warningForSwitch(!scope.row.edited)"
                  @change="(data) => changeDataSwitch(scope, data)"
                />
              </div>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="200"
            :label="t('reuse.settingDeposit')"
          >
            <template #default="scope">
              <div class="flex justify-between">
                <el-button
                  :icon="plusIcon"
                  link
                  :type="scope.row.bussinessSetups[2].hasPrice ? 'primary' : 'warning'"
                  @click="openDepositTable(scope)"
                  >{{ t('reuse.addPrice') }}</el-button
                >
                <ElSwitch
                  :model-value="scope.row.bussinessSetups[2]?.value"
                  :disabled="!scope.row.edited"
                  size="large"
                  inline-prompt
                  active-text="On"
                  inactive-text="Off"
                  @click="warningForSwitch(!scope.row.edited)"
                  @change="(data) => changeDataSwitch(scope, data)"
                />
              </div>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="200"
            :label="t('reuse.settingPawn')"
          >
            <template #default="scope">
              <div class="flex justify-between">
                <el-button
                  :icon="plusIcon"
                  link
                  :type="scope.row.bussinessSetups[3].hasPrice ? 'primary' : 'warning'"
                  @click="openPawnTable(scope)"
                  >{{ t('reuse.addPrice') }}</el-button
                >
                <ElSwitch
                  :model-value="scope.row.bussinessSetups[3]?.value"
                  :disabled="!scope.row.edited"
                  size="large"
                  inline-prompt
                  active-text="On"
                  inactive-text="Off"
                  @click="warningForSwitch(!scope.row.edited)"
                  @change="(data) => changeDataSwitch(scope, data)"
                />
              </div>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="200"
            :label="t('reuse.settingSpa')"
          >
            <template #default="scope">
              <div class="flex justify-between">
                <el-button
                  :icon="plusIcon"
                  link
                  :type="scope.row.bussinessSetups[4].hasPrice ? 'primary' : 'warning'"
                  @click="openSpaTable(scope)"
                  >{{ t('reuse.addPrice') }}</el-button
                >
                <ElSwitch
                  :model-value="scope.row.bussinessSetups[4]?.value"
                  :disabled="!scope.row.edited"
                  size="large"
                  inline-prompt
                  active-text="On"
                  inactive-text="Off"
                  @click="warningForSwitch(!scope.row.edited)"
                  @change="(data) => changeDataSwitch(scope, data)"
                />
              </div>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="200"
            :label="t('reuse.inventory')"
          >
            <template #default="scope">
              <div class="flex justify-between">
                <div>{{ scope.row.tonKho }}</div>
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
          <ElTableColumn header-align="center" align="center" width="150" :label="t('reuse.update')"
            ><template #default="scope">{{
              dateTimeFormat(scope.row.updatedAt)
            }}</template></ElTableColumn
          >
          <ElTableColumn header-align="center" align="center" width="150" :label="t('reuse.status')"
            ><template #default="scope">{{
              productStatusTransferToText(scope.row.isActive)
            }}</template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="200"
            fixed="right"
            :label="t('reuse.operator')"
          >
            <template #default="scope">
              <el-button
                v-if="scope.row.edited"
                type="primary"
                @click="handleSaveRow(scope.row, ruleTreeFormRef)"
                >{{ t('reuse.save') }}</el-button
              >
              <el-button v-else type="default" @click="handleEditRow(scope.row)">{{
                t('reuse.edit')
              }}</el-button>
              <el-button type="danger" @click="handleDeleteRow(scope)">{{
                t('reuse.delete')
              }}</el-button>
            </template>
          </ElTableColumn>
        </ElTable>
      </el-form>
      <el-button class="ml-5 mt-5" :icon="plusIcon" @click="addLastRowAttribute">{{
        t('reuse.addAttributeAndPrice')
      }}</el-button>
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
            prop="quantity"
            :label="t('reuse.quantityTo')"
          >
            <template #default="scope">
              <el-form-item
                :prop="`${scope.$index}.quantity`"
                :rules="[required(), { type: 'number', message: t('reuse.validateEnterNumber') }]"
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
            <template #default>
              <!--get this data from product Api-->
              <div>{{ unitData }}</div>
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
                :prop="`${scope.$index}.prices[1].price`"
                :rules="[required(), { type: 'number', message: t('reuse.validateEnterNumber') }]"
              >
                <el-input v-model.number="scope.row.prices[1].price" type="text" autocomplete="off"
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
                :prop="`${scope.$index}.prices[2].price`"
                :rules="[required(), { type: 'number', message: t('reuse.validateEnterNumber') }]"
              >
                <el-input v-model.number="scope.row.prices[2].price" type="text" autocomplete="off"
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
                :prop="`${scope.$index}.prices[3].price`"
                :rules="[required(), { type: 'number', message: t('reuse.validateEnterNumber') }]"
              >
                <el-input v-model.number="scope.row.prices[3].price" type="text" autocomplete="off"
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
                :prop="`${scope.$index}.prices[0].price`"
                :rules="[required(), { type: 'number', message: t('reuse.validateEnterNumber') }]"
              >
                <el-input v-model.number="scope.row.prices[0].price" type="text" autocomplete="off"
                  ><template #append>đ</template></el-input
                >
              </el-form-item>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="130"
            :label="t('reuse.modifyDate')"
            ><template #default="scope">{{
              dateTimeFormat(scope.row.updateDate)
            }}</template></ElTableColumn
          >
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="100"
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
            <template #default> 1 </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="130"
            prop="unit"
            :label="t('reuse.unit')"
          >
            <template #default>
              <div>{{ unitData }}</div>
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
                :prop="`${scope.$index}.prices[0].price`"
                :rules="[required(), { type: 'number', message: t('reuse.validateEnterNumber') }]"
              >
                <el-input v-model.number="scope.row.prices[0].price" type="text" autocomplete="off"
                  ><template #append>%</template></el-input
                >
              </el-form-item>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="right"
            min-width="130"
            :label="t('reuse.depositFeeByMoney')"
          >
            <template #default="scope">
              <el-form-item
                :prop="`${scope.$index}.prices[1].price`"
                :rules="[required(), { type: 'number', message: t('reuse.validateEnterNumber') }]"
              >
                <el-input v-model.number="scope.row.prices[1].price" type="text" autocomplete="off"
                  ><template #append>%</template></el-input
                >
              </el-form-item>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="130"
            :label="t('reuse.modifyDate')"
            ><template #default="scope">{{
              dateTimeFormat(scope.row.updateDate)
            }}</template></ElTableColumn
          >
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="50"
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
            <template #default> 1 </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="130"
            prop="unit"
            :label="t('reuse.unit')"
          >
            <template #default>
              <div>{{ unitData }}</div>
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
                :prop="`${scope.$index}.prices[0].price`"
                :rules="[required(), { type: 'number', message: t('reuse.validateEnterNumber') }]"
              >
                <el-input v-model.number="scope.row.prices[0].price" type="text" autocomplete="off"
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
                :prop="`${scope.$index}.prices[1].price`"
                :rules="[required(), { type: 'number', message: t('reuse.validateEnterNumber') }]"
              >
                <el-input v-model.number="scope.row.prices[1].price" type="text" autocomplete="off"
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
                  :value="scope.row.prices[0].price + scope.row.prices[1].price"
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
            :label="t('reuse.modifyDate')"
            ><template #default="scope">{{
              dateTimeFormat(scope.row.updateDate)
            }}</template></ElTableColumn
          >
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="50"
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
      @close="SpaTableDialogClose"
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
                :prop="`${scope.$index}.SpaServicesSelected`"
                :rules="[{ required: true, trigger: 'blur' }]"
              >
                <el-select
                  v-model="scope.row.SpaServicesSelected"
                  multiple
                  placeholder="Select"
                  style="width: 240px"
                  @change="(data) => updateTimeSpa(data, scope)"
                >
                  <el-option
                    v-for="item in SpaSelectOptions"
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
            :label="t('reuse.standardTime')"
          >
            <template #default="scope">
              <div>{{ scope.row.spaTotalTime }} {{ t('reuse.minute') }}</div>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="130"
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
            <template #default>
              <div>{{ unitData }}</div>
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
                :prop="`${scope.$index}.price`"
                :rules="[required(), { type: 'number', message: t('reuse.validateEnterNumber') }]"
              >
                <el-input v-model.number="scope.row.price" type="text" autocomplete="off"
                  ><template #append>đ</template></el-input
                >
              </el-form-item>
            </template>
          </ElTableColumn>
          <ElTableColumn
            header-align="center"
            align="center"
            min-width="130"
            :label="t('reuse.modifyDate')"
            ><template #default="scope">{{
              dateTimeFormat(scope.row.updateDate)
            }}</template></ElTableColumn
          >
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
        <ElTableColumn header-align="center" align="right" min-width="130" prop="spa" label="Spa" />
        <ElTableColumn
          header-align="center"
          align="right"
          min-width="130"
          prop="totalInventory"
          :label="t('reuse.totalInventory')"
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
    <el-collapse-item :name="collapse[7].name" @click="OpenCollapse" :disabled="disabledTabOpen">
      <template #title>
        <el-button class="header-icon" :icon="collapse[7].icon" link :disabled="disabledTabOpen" />
        <span class="text-center">{{ collapse[7].title }}</span>
      </template>
      <TableOperator
        v-if="openLastCollapse"
        :type="type"
        :id="id"
        :rules="ruleSEO"
        @edit-data="editDataSeo"
        :formDataCustomize="SEOdata"
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
