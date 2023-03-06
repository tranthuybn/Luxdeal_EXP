<script setup lang="ts">
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, watch, ref, unref, reactive, onBeforeMount } from 'vue'
import { TableData } from '@/api/table/types'
import {
  ElRow,
  ElCol,
  ElUpload,
  ElButton,
  ElDialog,
  UploadUserFile,
  UploadProps,
  ElMessage,
  ElMessageBox,
  ElNotification,
  ElImage,
  ElDivider,
  ElTable,
  ElTableColumn,
  ElSwitch,
  ElCheckbox,
  ElSelect,
  ElOption,
  ElRadio,
  ElInput
} from 'element-plus'
import { deleteCampaign, getAllCustomer, getProductsList } from '@/api/Business'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import type { UploadFile } from 'element-plus'
import { TableResponse } from '../../Components/Type'
import { useRouter } from 'vue-router'
import { API_URL } from '@/utils/API_URL'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
import { getSpaLibrary } from '@/api/LibraryAndSetting'
import CurrencyInputComponent from '@/components/CurrencyInputComponent.vue'
import { approvalProducts } from '@/api/Approval'
import { FORM_IMAGES } from '@/utils/format'
import { Approvement, CampaignTypeArr } from '@/utils/API.Variables'
import moment from 'moment'

const currentDate = ref(moment().format("DD/MM/YYYY"))
const { t } = useI18n()
const props = defineProps({
  // api lấy dữ liệu sản phẩm
  apiId: {
    type: Function as PropType<any>,
    default: () => Promise<IResponse<TableResponse<TableData>>>
  },
  // api xpas dữ liệu sản phẩm
  delApi: {
    type: Function as PropType<any>,
    default: () => Promise<IResponse<TableResponse<TableData>>>
  },
  //schema cho form
  schema: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
  },
  hasImage: {
    type: Boolean,
    default: true
  },
  multipleImages: {
    type: Boolean,
    default: true
  },
  // tiêu đề hiện trên đầu của bảng
  title: {
    type: String,
    default: ''
  },
  //tiêu đề khi hỏi xóa
  deleteTitle: {
    type: String,
    default: 'Warning'
  },
  //id của sản phẩm
  id: {
    type: Number,
    default: NaN
  },
  //type = 'add' || 'detail' || 'edit'
  //có sự kiện watch để bắt xem đang ở type nào
  type: {
    type: String,
    default: ''
  },
  //rules để validate
  rules: {
    type: Object,
    default: () => { }
  },
  //limitUpload ảnh
  limitUpload: {
    type: Number,
    default: 10
  },
  //truyền params cho api nếu cần
  params: {
    type: Object,
    default: () => { }
  },
  //dữ liệu đã được xử lí được gửi sau khi emit lên component cha
  formDataCustomize: {
    type: Object,
    default: () => { }
  },
  // remove the button at the end of the component
  removeButton: {
    type: Boolean,
    default: false
  },
  // add exit button to header
  backButton: {
    type: Boolean,
    default: false
  },
  showProduct: {
    type: Boolean,
    default: false
  },
  typeCombo: {
    type: Boolean,
    default: false
  },
  tabActive: {
    type: Number,
    default: NaN
  },
  campaignAndStrategyType: {
    type: Number,
    default: 0,
    description: 'Loại chiến dịch khuyến mãi',
    validator(val: number) { return CampaignTypeArr.includes(val) }

  }
})

// eslint-disable-next-line vue/no-setup-props-destructure
let schema = props.schema
const { register, methods, elFormRef } = useForm({
  schema
})
let fileList = ref<UploadUserFile[]>([])

const emit = defineEmits(['post-data', 'customize-form-data', 'edit-data'])
const formValue = ref()

const dataTable = reactive({
  customerData: [{ id: -1, code: '', name: null }],
  productData: [{ id: -1, code: '', name: null, isActive: true }],
  spaData: [{ id: -1, isActive: 1, code: '', name: null, service: [] }],
  spaVoucherData: [{ id: -1, code: '', name: null, service: [] }],
})

//get data from table
const getTableValue = async () => {
  if (!isNaN(props.id)) {
    const res = await props.apiId({ ...props.params, Id: props.id })
    if (res) {
      if (res.data?.list !== undefined) {
        formValue.value = res.data.list[0]
      } else {
        formValue.value = res.data
      }
      await setFormValue()
    } else {
      ElNotification({
        message: t('reuse.cantGetData'),
        type: 'warning'
      })
    }
  }
}

//formValue lay tu api
const customizeData = async () => {
  emit('customize-form-data', formValue.value)
}
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const imageUrl = ref()
const { setValues } = methods
//set data for form edit and detail
const setFormValue = async () => {
  //neu can xu li du lieu thi emit len component de tu xu li du lieu
  await customizeData()
  if (props.formDataCustomize !== undefined) {
    setValues(props.formDataCustomize)
    dataTable.customerData = props.formDataCustomize.customers ?? []
    dataTable.productData = props.formDataCustomize.products ?? []

    if (props.hasImage && !props.multipleImages) {
      imageUrl.value = props.formDataCustomize.imageurl
    }
    if (props.hasImage && props.multipleImages) {
      // Images tao tu formDataCustomize
      props.formDataCustomize?.Images?.map((image) =>
        fileList.value.push({ url: `${API_URL}${image.path}`, name: image.domainUrl })
      )
    }
  } else {
    setValues(formValue.value)
  }
}

watch(
  () => props.params,
  () => {
    if (props.params.CampaignType == '5') console.log('true')
  }
)
//Lấy dữ liệu từ bảng khi ấn nút detail, edit, approve
watch(
  () => props.type,
  () => {
    if (props.type === 'detail' || props.type === 'approval') {
      const { setProps } = methods
      setProps({
        disabled: true
      })
    }
    if (props.type === 'detail' || props.type === 'edit' || props.type === 'approval') {
      getTableValue()
    }
  },
  {
    deep: true,
    immediate: true
  }
)

watch(
  () => formValue.value,
  () => {
    if (formValue.value) {
      if (props.type === 'detail' || props.type === 'edit' || props.type === 'approval') {
        let newArr = ref(formValue.value[0].productProperties)
        let formService: any = ref([])
        newArr.value[0]?.spaServices.map((e) => {
          formService.value.push(e.name)
        })
        let formDataTable = formValue.value[0]?.productProperties.map((val) => ({
          code: val.code,
          id: val.id,
          isActive: val.isActive,
          service: formService.value
        }))
        dataTable.spaData = formDataTable
        // dataTable.productData = formDataTable
        spaMoney.value = formValue.value[0].comboValue
        imageUrl.value = formValue.value[0].images
      }
    }
  }
)
defineExpose({
  elFormRef,
  getFormData: methods.getFormData
})

const loading = ref(false)

//doc du lieu tu bang roi emit len goi API
// const { go } = useRouter()
const save = async (type) => {
  await unref(elFormRef)!.validate(async (isValid) => {
    //validate image
    let validateFile = false
    if (props.hasImage) {
      if (props.multipleImages) {
        validateFile = await beforeAvatarUpload(ListFileUpload.value, 'list')
      } else {
        validateFile = await beforeAvatarUpload(rawUploadFile.value, 'single')
      }
    } else {
      validateFile = true
    }
    if (isValid && validateFile) {
      loading.value = true
      const { getFormData } = methods
      let data = (await getFormData()) as TableData
      props.multipleImages
        ? (data.Images = ListFileUpload.value
          ? ListFileUpload.value.map((file) => (file.raw ? file.raw : null))
          : null)
        : (data.Image = rawUploadFile.value?.raw ? rawUploadFile.value?.raw : null)
      if (data.target == 3 || data.target == undefined) {
        data.customers = null
      } else {
        if (dataTable.customerData.length > 1) {
          if (
            dataTable.customerData[dataTable.customerData.length - 1].name == null ||
            dataTable.customerData[dataTable.customerData.length - 1].code == ''
          ) {
            dataTable.customerData.pop()
          }
          data.customers = dataTable.customerData
        } else {
          ElNotification({
            message: t('reuse.tableCustomerNotFillInformation'),
            type: 'info'
          })
          loading.value = false
          return
        }
      }
      if (props.showProduct) {
        if (dataTable.productData.length > 1) {
          if (
            dataTable.productData[dataTable.productData.length - 1].name == null ||
            dataTable.productData[dataTable.productData.length - 1].code == ''
          ) {
            dataTable.productData.pop()
          }
          data.products = dataTable.productData
        } else {
          ElNotification({
            message: t('reuse.tableProductNotFillInformation'),
            type: 'info'
          })
          loading.value = false
          return
        }

      }
      data.spa = spaMoney.value
      // dataTable.spaData.pop()
      data.tableProductOfCombo = dataTable.spaData
      //voucher product
      dataTable.spaVoucherData.pop()
      data.spaVoucher = dataTable.spaVoucherData
      //callback cho hàm emit
      if (type == 'add') {
        emit('post-data', data)
        loading.value = false
      }
      if (type == 'saveAndAdd') {

        emit('post-data', data)
        // unref(elFormRef)!.resetFields()
        loading.value = false
      }
      if (type == 'edit') {
        data.Id = props.id
        // fix cung theo api (nen theo 1 quy tac)
        data.NewPhotos = fileList.value
        data.DeleteFileIds = DeleteFileIds
        data.Imageurl = data.Image ? null : imageUrl.value
        data.Name = formValue.value.campaignTypeName
        emit('edit-data', data)
        loading.value = false
      }
    } else {
      ElMessage.error(t('reuse.notFillAllInformation'))
    }
  })
}
const addIcon = useIcon({ icon: 'uil:plus' })
const viewIcon = useIcon({ icon: 'uil:search' })
const deleteIcon = useIcon({ icon: 'uil:trash-alt' })

//if schema has image then split screen
let fullSpan = ref<number>()
let rawUploadFile = ref<UploadFile>()
props.hasImage ? (fullSpan.value = 16) : (fullSpan.value = 24)
//set Title
let title = ref(props.title)
if (props.title == 'undefined') {
  title.value = 'Category'
}

let DeleteFileIds: any = []
const handleRemove = (file: UploadFile) => {
  fileList.value = fileList.value?.filter((image) => image.url !== file.url)
  ListFileUpload.value = ListFileUpload.value?.filter((image) => image.url !== file.url)
  // remove image when edit data
  if (props.formDataCustomize.Images?.length > 0) {
    let imageRemove = props.formDataCustomize?.Images.find(
      (image) => `${API_URL}${image.path}` === file.url
    )
    if (imageRemove) {
      DeleteFileIds.push(imageRemove?.id)
    }
  }
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}
//validate Ảnh
const validImageType = ['jpeg', 'png']
const beforeAvatarUpload = async (rawFile, type: string) => {
  if (rawFile) {
    //nếu là 1 ảnh
    if (type === 'single') {
      if (rawFile.raw && rawFile.raw['type'].split('/')[0] !== 'image') {
        ElMessage.error(t('reuse.notImageFile'))
        return false
      } else if (rawFile.raw && !validImageType.includes(rawFile.raw['type'].split('/')[1])) {
        ElMessage.error(t('reuse.onlyAcceptValidImageType'))
        return false
      } else if (rawFile.raw?.size / 1024 / 1024 > 4) {
        ElMessage.error(t('reuse.imageOver4MB'))
        return false
      } else if (rawFile.name?.length > 100) {
        ElMessage.error(t('reuse.checkNameImageLength'))
        return false
      }
    }
    //nếu là 1 list ảnh
    if (type === 'list') {
      let inValid = true
      rawFile.map((file) => {
        if (file.raw && file.raw['type'].split('/')[0] !== 'image') {
          ElMessage.error(t('reuse.notImageFile'))
          inValid = false
        } else if (file.raw && !validImageType.includes(file.raw['type'].split('/')[1])) {
          ElMessage.error(t('reuse.onlyAcceptValidImageType'))
          inValid = false
          return false
        } else if (file.size / 1024 / 1024 > 4) {
          ElMessage.error(t('reuse.imageOver4MB'))
          inValid = false
        } else if (file.name?.length > 100) {
          ElMessage.error(t('reuse.checkNameImageLength'))
          inValid = false
          return false
        }
      })
      return inValid
    }
    return true
  } else {
    //báo lỗi nếu ko có ảnh
    if (type === 'list' && fileList.value?.length > 0) {
      return true
    }
    if (type === 'single' && (rawUploadFile.value != undefined || imageUrl.value != undefined)) {
      return true
    } else {
      ElMessage.warning(t('reuse.notHaveImage'))
      return false
    }
  }
}
//chuyển sang edit nếu ấn nút edit ở chỉnh sửa khi đang ở chế độ xem
const { push } = useRouter()
const router = useRouter()
const edit = () => {
  push({
    name: `${String(router.currentRoute.value.name)}`,
    params: { id: props.id, type: 'edit', tab: props.tabActive }
  })
}
//xóa dữ liệu sản phẩm
const delAction = () => {
  {
    ElMessageBox.confirm(`${t('reuse.deleteWarning')}`, props.deleteTitle, {
      confirmButtonText: t('button.cancel'),
      cancelButtonText: t('reuse.exit'),
      type: 'warning',
      title: t('reuse.cancelProgramming'),
      confirmButtonClass: 'el-button--danger'
    })
      .then(() => {
        deleteCampaign({ id: props.id })
          .then(() =>
            ElNotification({
              message: t('reuse.deleteSuccess'),
              type: 'success'
            })
          )
          .catch(() => {
            ElNotification({
              message: t('reuse.deleteFail'),
              type: 'warning'
            })
          })
      })
      .catch(() => {
        ElNotification({
          type: 'info',
          message: t('reuse.deleteCancel')
        })
      })
  }
}
const cancel = () => {
  push({
    name: 'business.promotion-strategy.flash-sale',
    params: { backRoute: 'business.promotion-strategy.flash-sale' }
  })
}
//xử lí ảnh
const ListFileUpload = ref()
const handleChange: UploadProps['onChange'] = async (uploadFile, uploadFiles) => {
  if (!props.multipleImages) {
    const validImage = await beforeAvatarUpload(uploadFile, 'single')
    if (validImage) {
      rawUploadFile.value = uploadFile
      imageUrl.value = URL.createObjectURL(uploadFile.raw!)
    } else {
    }
  } else {
    const validImage = await beforeAvatarUpload(uploadFiles, 'list')
    ListFileUpload.value = uploadFiles
    if (!validImage) {
      uploadFiles.map((file) => {
        file.raw ? handleRemove(file) : ''
      })
    }
  }
}
const previewImage = () => {
  dialogVisible.value = true
  dialogImageUrl.value = imageUrl.value
}
const removeImage = () => {
  rawUploadFile.value = undefined
  imageUrl.value = undefined
}

type ListImages = 'text' | 'picture' | 'picture-card'
const listType = ref<ListImages>('text')
!props.multipleImages ? (listType.value = 'text') : (listType.value = 'picture-card')

const forceRemove = ref(false)
watch(
  () => dataTable.customerData[dataTable.customerData?.length - 1],
  () => {
    if (
      dataTable.customerData?.length < 1 ||
      (dataTable.customerData[dataTable.customerData?.length - 1].code !== '' &&
        dataTable.customerData[dataTable.customerData?.length - 1].name !== null &&
        forceRemove.value == false)
    ) {
      addLastIndexCustomerTable()
    }
  },
  { deep: true }
)

watch(
  () => dataTable.spaVoucherData[dataTable.spaVoucherData?.length - 1],
  () => {
    if (
      dataTable.spaVoucherData?.length < 1 ||
      (dataTable.spaVoucherData[dataTable.spaVoucherData?.length - 1].code !== '' &&
        dataTable.spaVoucherData[dataTable.spaVoucherData?.length - 1].name !== null &&
        forceRemove.value == false)
    ) {
      addLastIndexSpaProductVoucher()
    }
  },
  { deep: true }
)
watch(
  () => dataTable.productData?.length,
  () => {
    if (dataTable.productData?.length == 0) {
      addLastIndexProductTable()
    }
  }
)

watch(
  () => dataTable.productData[dataTable.productData?.length - 1],
  () => {
    if (
      dataTable.productData?.length < 1 ||
      (dataTable.productData[dataTable.productData?.length - 1].code !== '' &&
        dataTable.productData[dataTable.productData?.length - 1].name !== '' &&
        forceRemove.value == false)
    ) {
      addLastIndexProductTable()
    }
  },
  { deep: true }
)

watch(
  () => dataTable.spaData[dataTable.spaData?.length - 1],
  () => {
    if (
      dataTable.spaData?.length < 1 ||
      (dataTable.spaData[dataTable.spaData?.length - 1].code !== '' &&
        dataTable.spaData[dataTable.spaData?.length - 1].name !== '' &&
        forceRemove.value == false)
    ) {
      addLastIndexProductOfComboTable()
    }
  },
  { deep: true }
)

const addLastIndexCustomerTable = () => {
  let idTable = Date.now()
  dataTable.customerData.push({ id: idTable, code: '', name: null })
}
const addLastIndexProductTable = () => {
  let idTable2 = Date.now()
  dataTable.productData.push({ id: idTable2, code: '', name: null, isActive: true })
}

const addLastIndexProductOfComboTable = () => {
  let idTable3 = Date.now()
  dataTable.spaData.push({ id: idTable3, isActive: 1, code: '', name: null, service: [] })
}

const addLastIndexSpaProductVoucher = () => {
  let idTable5 = Date.now()
  dataTable.spaVoucherData.push({ id: idTable5, code: '', name: null, service: [] })
}


//get list customer
const listCustomer = ref()
const pageIndexCustomer = ref(1)
const callAPICustomer = async () => {
  const res = await getAllCustomer({ PageIndex: pageIndexCustomer.value, PageSize: 20 })
  if (res.data && res.data?.length > 0) {
    listCustomer.value = res.data.map((customer) => ({
      value: customer.code,
      label: customer.phonenumber,
      name: customer.name,
      id: customer.id
    }))
  }
}

//get list product
const listProducts = ref()
const pageIndexProducts = ref(1)

const callAPIProduct = async () => {
  const res = await getProductsList({ PageIndex: pageIndexProducts.value, PageSize: 20 })
  if (res.data && res.data?.length > 0) {
    listProducts.value = res.data.map((product) => ({
      value: product.productCode,
      label: product.code,
      name: product.name,
      id: product.id,
      Id: product.id
    }))
  }
}

//process logic data when click select
const changeName = (data, scope) => {
  forceRemove.value = false
  scope.row.code = data
}
const changeProduct = (data, scope) => {
  forceRemove.value = false
  const selected = dataTable.productData.find((product) => product.code == data)
  if (selected !== undefined) {
    scope.row.code = ''
    scope.row.name = null
    ElNotification({
      message: t('reuse.productCodeExist'),
      type: 'warning'
    })
  } else {
    scope.row.code = data
  }
}
const changeCustomer = (data, scope) => {
  forceRemove.value = false
  const selected = dataTable.customerData.find((customer) => customer.code == data)
  if (selected !== undefined) {
    scope.row.code = ''
    scope.row.name = null
    ElNotification({
      message: t('reuse.customerCodeExist'),
      type: 'warning'
    })
  } else {
    scope.row.code = data
  }
}

const scrollCustomerTop = ref(false)
const scrollCustomerBottom = ref(false)

const ScrollCustomerTop = () => {
  scrollCustomerTop.value = true
}
const noMoreCustomerData = ref(false)

const ScrollCustomerBottom = () => {
  scrollCustomerBottom.value = true
  pageIndexCustomer.value++
  noMoreCustomerData.value
    ? ''
    : getAllCustomer({ PageIndex: pageIndexCustomer.value, PageSize: 20 })
      .then((res) => {
        res.data.length == 0
          ? (noMoreCustomerData.value = true)
          : res.data.map((customer) =>
            listCustomer.value.push({
              value: customer.code,
              label: customer.phonenumber,
              name: customer.name,
              id: customer.id
            })
          )
      })
      .catch(() => {
        noMoreCustomerData.value = true
      })
}

const scrollProductTop = ref(false)
const scrollProductBottom = ref(false)

const ScrollProductTop = () => {
  scrollProductTop.value = true
}
const noMoreProductData = ref(false)

const ScrollProductBottom = () => {
  scrollProductBottom.value = true
  pageIndexProducts.value++
  noMoreProductData.value
    ? ''
    : getProductsList({ PageIndex: pageIndexProducts.value, PageSize: 20 })
      .then((res) => {
        res.data.length == 0
          ? (noMoreProductData.value = true)
          : res.data.map((product) =>
            listProducts.value.push({
              value: product.productCode,
              label: product.code,
              name: product.name,
              id: product.id,
              Id: product.id
            })
          )
      })
      .catch(() => {
        noMoreProductData.value = true
      })
}
const removeCustomer = (scope) => {
  console.log(scope)
  forceRemove.value = true
  dataTable.customerData.splice(scope.$index, 1)
}
const removeProduct = (scope) => {
  forceRemove.value = true
  dataTable.productData.splice(scope.$index, 1)
}
const removeSpaProduct = (scope) => {
  forceRemove.value = true
  dataTable.spaData.splice(scope.$index, 1)
}
const removeSpaProductVoucher = (scope) => {
  forceRemove.value = true
  dataTable.spaVoucherData.splice(scope.$index, 1)
}
const assignTheValuesForRow = (_value, obj, scope) => {
  scope.row.name = obj.name
  scope.row.id = obj.id
}
const conditionVoucherVisible = ref(false)
const conditionComboVisible = ref(false)

const changeVoucherCondition = () => {
  conditionVoucherVisible.value = true
}
const changeComboCondition = () => {
  conditionComboVisible.value = true
}
const SpaSelectOptions = ref()
let callSpaApi = 0
const getSpaOptions = async () => {
  if (callSpaApi == 0) {
    await getSpaLibrary({ PageIndex: 1, PageSize: 100 }).then(
      (res) =>
      (SpaSelectOptions.value = res.data.map((spa) => ({
        name: spa.name,
        value: spa.id.toString(),
        code: spa.code,
        label: spa.name,
        cost: spa.cost,
        promotePrice: spa.promotePrice
      })))
    )
    callSpaApi++
    selectLoading.value = false
  }
}
const conditionVoucherTable = reactive([
  {
    id: 1,
    condition: t('reuse.freeRecievedVoucher'),
    explainCondition: t('reuse.explainFreeRecievedVoucher'),
    enterCondition: ''
  },
  {
    id: 2,
    condition: t('reuse.voucherAffiliate'),
    explainCondition: t('reuse.explainVoucherAffiliate'),
    enterCondition: ''
  },
  {
    id: 3,
    condition: t('reuse.exchangeByPoints'),
    explainCondition: t('reuse.explainExchangeByPoints'),
    enterCondition: 'points',
    point: 500
  },

  {
    id: 4,
    condition: t('reuse.buyByVirtualWallet'),
    explainCondition: t('reuse.explainBuyByVirtualWallet'),
    enterCondition: 'prices',
    price: 200
  }
])
const conditionComboTable = reactive([
  {
    id: 1,
    condition: t('reuse.freeReceiveCombo'),
    explainCondition: t('reuse.explainFreeRecievedCombo'),
    enterCondition: ''
  },
  {
    id: 2,
    condition: t('reuse.exchangeByPoints'),
    explainCondition: t('reuse.explainExchangeByPoints'),
    enterCondition: 'points',
    point: 500,
    formatter: (value) =>
      value
        .replace(/^\s+$/gm, '')
        .replace(/^[a-zA-Z]*$/gm, '')
        .replace(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/gi, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    parser: (value) => value.replace(/\$\s?|(,*)/g, '')
  },
  {
    id: 3,
    condition: t('reuse.buyByVirtualWallet'),
    explainCondition: t('reuse.explainBuyByVirtualWallet'),
    enterCondition: 'prices',
    price: 200,
    formatter: (value) =>
      value
        .replace(/^\s+$/gm, '')
        .replace(/^[a-zA-Z]*$/gm, '')
        .replace(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/gi, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    parser: (value) => value.replace(/\$\s?|(,*)/g, '')
  }
])
const singleTableRef = ref<InstanceType<typeof ElTable>>()
const handleCurrentChangeSelection = (val) => {
  radioSelected.value = val.id
  setValues({ condition: radioSelected.value })
}
const radioSelected = ref()
const selectLoading = ref(true)
const spaCost = ref()
const getSpaSelected = (spaServices) => {
  const spaObj = spaServices.map((service) =>
    SpaSelectOptions.value.find((spa) => spa.value == service)
  )
  spaCost.value = spaObj.reduce(function (accumulator, curValue) {
    return accumulator + curValue.cost
  }, 0)
}
onBeforeMount(() => {
  callAPICustomer(), getSpaOptions()
  callAPIProduct()
})

const approvisionnement = async (val: boolean) => {
  const payload = { ItemType: Approvement.Campaign, Id: props.id ?? null, IsApprove: val }
  await approvalProducts(FORM_IMAGES(payload))
    .then(() => {
      ElNotification({
        message: val ? 'Duyệt thành công' : 'Hủy duyệt thành công',
        type: 'success'
      })
      push({
        name: `approve.approve-promotion-strategy`
      })
    })
    .catch(() => {
      ElNotification({
        message: 'Duyệt thất bại',
        type: 'warning'
      })
      push({
        name: `approve.approve-promotion-strategy`
      })
    }
    )
}

const spaMoney = ref(0)
</script>
<template>
  <ContentWrap :title="props.title" :back-button="props.backButton">
    <ElRow :gutter="20" justify="space-between">
      <ElCol :span="fullSpan">
        <Form :rules="rules" @register="register">
          <template #tableCustomer>
            <el-table :data="dataTable.customerData" border header-row-class-name="dark:text-white text-black">
              <el-table-column prop="code" :label="t('reuse.customerCode')" width="180">
                <template #default="scope">
                  <MultipleOptionsBox
:fields="[
                    t('reuse.customerCode'),
                    t('reuse.phoneNumber'),
                    t('formDemo.customerName')
                  ]" filterable width="500px" :items="listCustomer" valueKey="value" labelKey="value"
                    :hiddenKey="['id']" :placeHolder="t('reuse.chooseCustomerCode')" :clearable="false"
                    :defaultValue="scope.row.code"
                    @update-value="(value, obj) => assignTheValuesForRow(value, obj, scope)"
                    @change="(option) => changeCustomer(option, scope)" @scroll-top="ScrollCustomerTop"
                    @scroll-bottom="ScrollCustomerBottom" />
                </template>
              </el-table-column>
              <el-table-column prop="name" :label="t('reuse.customerName')" width="780"><template #default="scope">{{
                scope.row.name }}</template></el-table-column>
              <el-table-column :label="t('reuse.operator')" fixed="right" width="86">
                <template #default="scope">
                  <el-button type="danger" v-if="scope.row.code" @click="removeCustomer(scope)">{{
                    t('reuse.delete')
                  }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <template #tableProduct>
            <el-table :data="dataTable.productData" border header-row-class-name="dark:text-white text-black">
              <el-table-column :label="t('formDemo.productManagementCode')" width="180"><template #default="scope">
                  <MultipleOptionsBox
:defaultValue="scope.row.code" :fields="[
                    t('reuse.productCode'),
                    t('reuse.managementCode'),
                    t('reuse.productInformation')
                  ]" filterable width="500px" :items="listProducts" valueKey="value" labelKey="value"
                    :hiddenKey="['id']" :placeHolder="t('reuse.chooseProductCode')" :clearable="false"
                    @update-value="(value, obj) => assignTheValuesForRow(value, obj, scope)"
                    @change="(option) => changeProduct(option, scope)" @scroll-top="ScrollProductTop"
                    @scroll-bottom="ScrollProductBottom" />
                </template>
              </el-table-column>
              <el-table-column prop="name" :label="t('formDemo.productInfomation')" width="600" />
              <el-table-column :label="t('formDemo.joinTheProgram')" width="185">
                <template #default="scope">
                  <el-switch
v-model="scope.row.isActive" active-text="ON" inline-prompt inactive-text="OFF"
                    size="large" />
                </template>
              </el-table-column>
              <el-table-column :label="t('reuse.operator')" fixed="right" width="86">
                <template #default="scope">
                  <el-button type="danger" v-if="scope.row.code" @click="removeProduct(scope)">{{
                    t('reuse.delete')
                  }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>


          <template #tableProductOfCombo>
            <el-table :data="dataTable.spaData" border header-row-class-name="dark:text-white text-black">
              <template #append>
                <div class="pl-750px w-320px">
                  <div class="w-320px">{{ t('reuse.totalRealSpaMoney') }}
                    <span style="float: right">{{ spaCost }}</span>
                  </div>
                  <div class="flex w-320px pb-4"><span>
                      <div>{{ t('reuse.enterComboSpaMoney') }}</div>
                      <div class="explainText" style="line-height: 10px">{{
                        t('reuse.explainEnterComboSpaMoney')
                      }}</div>
                    </span>
                    <!-- <span><el-input v-model="" /></span -->
                    <span>
                      <CurrencyInputComponent v-model="spaMoney" />
                    </span>
                  </div>
                </div>
              </template>
              <el-table-column prop="code" :label="t('formDemo.productManagementCode')" width="180"><template
                  #default="scope">
                  <MultipleOptionsBox
:fields="[
                    t('reuse.productCode'),
                    t('reuse.managementCode'),
                    t('reuse.productInformation')
                  ]" filterable width="500px" :items="listProducts" valueKey="Id" labelKey="value" :hiddenKey="['id']"
                    :placeHolder="t('reuse.chooseProductCode')" :clearable="false" :defaultValue="scope.row.code"
                    @update-value="(value, obj) => assignTheValuesForRow(value, obj, scope)"
                    @change="(option) => changeName(option, scope)" />
                </template>
              </el-table-column>
              <el-table-column prop="name" :label="t('formDemo.productInfomation')" width="480" />
              <el-table-column width="320">
                <template #header>{{ t('reuse.spaService') }}<span style="color: orange">({{
                  t('reuse.chooseAtleast2SpaService') }})</span>
                </template>
                <template #default="scope">
                  <el-select
:loading="selectLoading" multiple clearable v-model="scope.row.service" class="m-2"
                    placeholder="Select" size="large" @change="getSpaSelected">
                    <div class="flex gap-4">
                      <div class="flex-1 font-bold pl-5 h-[34px]">{{ t('reuse.serviceCode') }}</div>
                      <div class="flex-1 font-bold pr-5 h-[34px]">{{
                        t('reuse.informationServices')
                      }}</div>
                    </div>
                    <el-option v-for="item in SpaSelectOptions" :key="item.value" :label="item.label" :value="item.value">
                      <span style="float: left">{{ item.code }}</span>
                      <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">{{ item.name
                      }}</span>
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column :label="t('reuse.operator')" fixed="right">
                <template #default="scope">
                  <el-button type="danger" v-if="scope.row.code" @click="removeSpaProduct(scope)">{{
                    t('reuse.delete')
                  }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>


          <template #spaProduct>
            <el-table :data="dataTable.spaVoucherData" border>
              <el-table-column prop="code" :label="t('formDemo.productManagementCode')" width="180"><template
                  #default="scope">
                  <MultipleOptionsBox
:fields="[
                    t('reuse.productCode'),
                    t('reuse.managementCode'),
                    t('reuse.productInformation')
                  ]" filterable width="500px" :items="listProducts" valueKey="Id" labelKey="value" :hiddenKey="['id']"
                    :placeHolder="t('reuse.chooseProductCode')" :clearable="false" :defaultValue="scope.row.code"
                    @update-value="(value, obj) => assignTheValuesForRow(value, obj, scope)"
                    @change="(option) => changeName(option, scope)" />
                </template>
              </el-table-column>
              <el-table-column prop="name" :label="t('formDemo.productInfomation')" width="500" />
              <el-table-column width="200">
                <template #header>{{ t('reuse.spaService')
                }}<span style="color: orange">({{ t('reuse.chooseAtleast1SpaService') }})</span></template>
                <template #default="scope">
                  <el-select
:loading="selectLoading" multiple clearable v-model="scope.row.service" class="m-2"
                    placeholder="Select" size="large">
                    <div class="flex gap-4">
                      <div class="flex-1 font-bold pl-5 h-[34px]">{{ t('reuse.serviceCode') }}</div>
                      <div class="flex-1 font-bold pr-5 h-[34px]">{{
                        t('reuse.informationServices')
                      }}</div>
                    </div>
                    <el-option v-for="item in SpaSelectOptions" :key="item.value" :label="item.label" :value="item.value">
                      <span style="float: left">{{ item.code }}</span>
                      <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">{{ item.name
                      }}</span>
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column :label="t('reuse.operator')" fixed="right">
                <template #default="scope">
                  <el-button type="danger" v-if="scope.row.code" @click="removeSpaProductVoucher(scope)">{{
                    t('reuse.delete') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <template #voucherButton>
            <el-button @click="changeVoucherCondition" :icon="addIcon" style="width: 100%">{{
              t('formDemo.change')
            }}</el-button>
          </template>
          <template #comboButton>
            <el-button @click="changeComboCondition" :icon="addIcon" style="width: 100%">{{
              t('formDemo.change')
            }}</el-button>
          </template>
          <template #statusVoucher="form">
            <el-checkbox v-model="form['statusVoucher']" size="large"><template #default><span>{{
              t('formDemo.sendImmediatelyAfterBrowsing') }} </span><span style="color: orange">({{
    t('reuse.voucherStatusExplain') }})</span></template></el-checkbox>
          </template>
          <template #statusValue="form">
            <div class="status_wrap">
              <div v-if="form['statusValue'] == 0" class="status_wrap--new-account">{{
                t('formDemo.isNewAccount') }}
              </div>
              <div v-else class="backgroundAroundLetter status_wrap--pending" style="background: orange">{{
                t('reuse.pending')
              }}</div>
              <div class="status_wrap-date ">{{ currentDate }}</div>
            </div>
          </template>
        </Form>
      </ElCol>
      <ElCol :span="hasImage ? 8 : 0" v-if="hasImage" class="max-h-400px overflow-y-auto shadow-inner p-1">
        <ElDivider class="text-center font-bold">{{ t('reuse.addImage') }}</ElDivider>
        <el-upload
action="#" :disabled="props.type === 'detail' || props.type === 'approval'" :auto-upload="false"
          :show-file-list="multipleImages" v-model:file-list="fileList" :list-type="listType" :limit="limitUpload"
          :on-change="handleChange" :multiple="multipleImages"
          :class="multipleImages ? 'avatar-uploader' : 'one-avatar-uploader'">
          <div v-if="!multipleImages" class="one-avatar-uploader">
            <div
v-if="imageUrl" style="width: 148px; height: 148px; border-radius: 4px"
              class="flex justify-center relative mb-2">
              <ElImage fit="contain" :src="imageUrl" class="avatar" />
            </div>
            <ElButton v-else :icon="addIcon" style="border: dashed 1px #e5e7eb" class="avatar-uploader-icon" />
          </div>
          <div v-else>
            <ElButton :icon="addIcon" />
          </div>
          <template #file="{ file }">
            <div>
              <ElImage fit="contain" style="width: 148px; height: 148px" :src="file.url" alt="" />
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                  <ElButton :icon="viewIcon" />
                </span>
                <span
v-if="props.type !== 'detail' && props.type !== 'approval'" class="el-upload-list__item-delete"
                  @click="handleRemove(file)">
                  <ElButton :icon="deleteIcon" :disabled="props.type === 'detail' || props.type === 'approval'" />
                </span>
              </span>
            </div>
          </template>
        </el-upload>
        <div
class="w-250px flex justify-center" :class="multipleImages ? 'avatar-uploader' : 'one-avatar-uploader'"
          v-if="imageUrl">
          <ElButton :icon="viewIcon" @click="previewImage" />
          <ElButton
:icon="deleteIcon" :disabled="props.type === 'detail' || props.type === 'approval'"
            @click="removeImage" />
        </div>
        <el-dialog top="5vh" v-model="dialogVisible" width="130vh">
          <el-image class="h-full" :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </ElCol>
    </ElRow>
    <template #under v-if="!removeButton">
      <div v-if="props.type === 'add' || isNaN(props.id)">
        <ElButton type="primary" :loading="loading" @click="save('saveAndAdd')">
          {{ t('reuse.saveAndPending') }}
        </ElButton>
        <ElButton type="danger" :loading="loading" @click="cancel">
          {{ t('formDemo.cancelTheProgram') }}
        </ElButton>
      </div>
      <div v-else-if="props.type === 'detail'">
        <ElButton :loading="loading" @click="edit">
          {{ t('reuse.edit') }}
        </ElButton>
        <ElButton type="danger" :loading="loading" @click="delAction">
          {{ t('formDemo.cancelTheProgram') }}
        </ElButton>
      </div>
      <div v-else-if="props.type === 'approval'">
        <ElButton type="warning" :loading="loading" @click="approvisionnement(true)">
          {{ t('router.approve') }}
        </ElButton>
        <ElButton :loading="loading" @click="approvisionnement(false)">
          {{ t('router.notApproval') }}
        </ElButton>
      </div>
      <div v-else-if="props.type === 'edit'">
        <ElButton type="primary" :loading="loading" @click="save('edit')">
          {{ t('reuse.save') }}
        </ElButton>
        <ElButton :loading="loading" @click="cancel">
          {{ t('reuse.cancel') }}
        </ElButton>
        <ElButton type="danger" :loading="loading" @click="delAction">
          {{ t('formDemo.cancelTheProgram') }}
        </ElButton>
      </div>
    </template>
    <el-dialog v-model="conditionComboVisible" :title="t('reuse.settingVoucherCondition')" width="900px">
      <el-table
        ref="singleTableRef" :data="conditionComboTable" highlight-current-row style="width: 100%" :border="true"
        @current-change="handleCurrentChangeSelection">
        <el-table-column label="" width="70">
          <template #default="scope">
            <el-radio
       v-model="radioSelected" :label="scope.$index + 1"
              style="color: #fff; margin-right: -25px"><span></span></el-radio>
          </template>
        </el-table-column>
        <el-table-column :label="t('reuse.condition')" width="500">
          <template #default="scope">
            <div>{{ scope.row.condition }}</div>
            <div class="explainText">({{ scope.row.explainCondition }})</div>
          </template></el-table-column>
        <el-table-column :label="t('reuse.enterCondition')" width="300"><template #default="scope">
            <div v-if="scope.row.enterCondition !== ''" class="w-full">
              <div v-if="scope.row.enterCondition == 'points'"><el-input v-model="scope.row.point" type="number"><template
                    #suffix><span>{{ t('reuse.points') }}</span></template></el-input></div>
              <div v-if="scope.row.enterCondition == 'prices'">
                <CurrencyInputComponent v-model="scope.row.price" />
              </div>
            </div>
          </template></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog v-model="conditionVoucherVisible" :title="t('reuse.settingVoucherCondition')" width="900px">
      <el-table
        ref="singleTableRef" :data="conditionVoucherTable" highlight-current-row style="width: 100%"
        :border="true" @current-change="handleCurrentChangeSelection">
        <el-table-column label="" width="70">
          <template #default="scope">
            <el-radio
v-model="radioSelected" :label="scope.$index + 1"
              style="color: #fff; margin-right: -25px"><span></span></el-radio>
          </template>
        </el-table-column>
        <el-table-column :label="t('reuse.condition')" width="500">
          <template #default="scope">
            <div>{{ scope.row.condition }}</div>
            <div class="explainText">({{ scope.row.explainCondition }})</div>
          </template></el-table-column>
        <el-table-column :label="t('reuse.enterCondition')"><template #default="scope">
            <div v-if="scope.row.enterCondition !== ''" class="w-full">
              <div v-if="scope.row.enterCondition == 'points'"><el-input v-model="scope.row.point" type="number"><template
                    #suffix><span>{{ t('reuse.points') }}</span></template></el-input></div>
              <div v-if="scope.row.enterCondition == 'prices'">
                <CurrencyInputComponent v-model="scope.row.price" />
              </div>
            </div>
          </template></el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="conditionVoucherVisible = false">
            {{ t('reuse.save') }}
          </el-button>
          <el-button @click="conditionVoucherVisible = false">{{ t('reuse.exit') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </ContentWrap>
</template>
<style scoped>
.status_wrap {
  display: flex;
  align-items: left;
  flex-direction: column;
}

.status_wrap .status_wrap--new-account {
  color: #2C6DDA;
  background: rgba(44, 109, 218, 0.05);
  width: 88px;
  height: 18px;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
}

.status_wrap .status_wrap-date {
  color: #65676B;
  font-weight: 400;
  font-size: 10px;
  font-style: italic;
}

.explainText {
  color: orange;
  font-size: 14px;
  font-style: italic;
}

.avatar-uploader .avatar {
  padding-bottom: 1rem;
  width: 250px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  width: 148px;
  height: 148px;
}

.one-avatar-uploader {
  display: flex;
  justify-content: center;
  margin: 0 auto;
}

::v-deep(.el-form-item--default .el-form-item__content) {
  line-height: 24px;
}

:deep(.el-dialog__body) {
  max-height: 85vh;
  overflow: auto;
  display: flex;
  justify-content: center;
}

.widthOption {
  min-width: 500px;
}

.fix-padding {
  padding: 0;
}

::v-deep(.cell) {
  word-break: break-word;
}

.backgroundAroundLetter {
  color: white;
  padding-right: 5rem;
  padding-left: 1rem;
}
</style>
