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
  ElOption
} from 'element-plus'
import { getAllCustomer } from '@/api/Business'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import type { UploadFile } from 'element-plus'
import { TableResponse } from '../../Components/Type'
import { useRouter } from 'vue-router'
import { API_URL } from '@/utils/API_URL'
import MultipleOptionsBox from '@/components/MultipleOptionsBox.vue'
import { getSpaLibrary } from '@/api/LibraryAndSetting'

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
    default: () => {}
  },
  //limitUpload ảnh
  limitUpload: {
    type: Number,
    default: 10
  },
  //truyền params cho api nếu cần
  params: {
    type: Object,
    default: () => {}
  },
  //dữ liệu đã được xử lí được gửi sau khi emit lên component cha
  formDataCustomize: {
    type: Object,
    default: () => {}
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
  }
})
const emit = defineEmits(['post-data', 'customize-form-data', 'edit-data'])
const formValue = ref()
const dataTable = reactive({ customerData: [{ id: -1, code: '', name: '' }] })
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
// eslint-disable-next-line vue/no-setup-props-destructure
const schema = props.schema
const { register, methods, elFormRef } = useForm({
  schema
})
let fileList = ref<UploadUserFile[]>([])

//formValue lay tu api
const customizeData = async () => {
  emit('customize-form-data', formValue.value)
}
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
const imageUrl = ref()
//set data for form edit and detail
const setFormValue = async () => {
  //neu can xu li du lieu thi emit len component de tu xu li du lieu
  await customizeData()
  const { setValues } = methods
  if (props.formDataCustomize !== undefined) {
    setValues(props.formDataCustomize)
    dataTable.customerData = props.formDataCustomize.customers
    console.log('fakeTableCustomerData', dataTable.customerData)
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
//Lấy dữ liệu từ bảng khi ấn nút detail hoặc edit
watch(
  () => props.type,
  () => {
    if (props.type === 'detail') {
      const { setProps } = methods
      setProps({
        disabled: true
      })
    }
    if (props.type === 'detail' || props.type === 'edit') {
      getTableValue()
    }
  },
  {
    deep: true,
    immediate: true
  }
)
defineExpose({
  elFormRef,
  getFormData: methods.getFormData
})

const loading = ref(false)

//doc du lieu tu bang roi emit len goi API
const { go } = useRouter()
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
      //callback cho hàm emit
      if (type == 'add') {
        emit('post-data', data, go(-1))
        loading.value = false
      }
      if (type == 'saveAndAdd') {
        emit('post-data', data)
        unref(elFormRef)!.resetFields()
        loading.value = false
      }
      if (type == 'edit') {
        data.Id = props.id
        // fix cung theo api (nen theo 1 quy tac)
        data.NewPhotos = fileList.value
        data.DeleteFileIds = DeleteFileIds
        data.Imageurl = data.Image ? null : imageUrl.value
        emit('edit-data', data, go(-1))
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
  if (props.formDataCustomize.Images.length > 0) {
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
    if (type === 'list' && fileList.value.length > 0) {
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
    params: { id: props.id, type: 'edit' }
  })
}
//xóa dữ liệu sản phẩm
const delAction = async () => {
  {
    ElMessageBox.confirm(`${t('reuse.deleteWarning')}`, props.deleteTitle, {
      confirmButtonText: t('reuse.delete'),
      cancelButtonText: t('reuse.exit'),
      type: 'warning',
      confirmButtonClass: 'ElButton--danger'
    })
      .then(() => {
        const res = props.delApi({ Id: props.id })
        if (res) {
          ElNotification({
            message: t('reuse.deleteSuccess'),
            type: 'success'
          }),
            go(-1)
        } else {
          ElNotification({
            message: t('reuse.deleteFail'),
            type: 'warning'
          })
        }
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
  go(-1)
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

//this is fake data if has api should do form['tableCustomer'] same for product
type Product = {
  code: string
  name: string
  switch: boolean
}
type SpaProduct = {
  code: string
  name: string
  service: Array<string>
}
const fakeTableProductData = reactive<Product[]>([{ code: '', name: '', switch: false }])
const fakeSpaProductData = reactive<SpaProduct[]>([{ code: '', name: '', service: [] }])
const forceRemove = ref(false)
watch(
  () => dataTable.customerData[dataTable.customerData.length - 1],
  () => {
    if (
      dataTable.customerData.length < 1 ||
      (dataTable.customerData[dataTable.customerData.length - 1].code !== '' &&
        dataTable.customerData[dataTable.customerData.length - 1].name !== '' &&
        forceRemove.value == false)
    ) {
      addLastIndexCustomerTable()
    }
  },
  { deep: true }
)
watch(
  () => fakeTableProductData.length,
  () => {
    if (fakeTableProductData.length == 0) {
      addLastIndexProductTable()
    }
  }
)
watch(
  () => fakeTableProductData[fakeTableProductData.length - 1],
  () => {
    if (
      fakeTableProductData.length < 1 ||
      (fakeTableProductData[fakeTableProductData.length - 1]['code'] !== '' &&
        fakeTableProductData[fakeTableProductData.length - 1]['name'] !== '' &&
        forceRemove.value == false)
    ) {
      addLastIndexProductTable()
    }
  },
  { deep: true }
)
const addLastIndexCustomerTable = () => {
  let idTable = dataTable.customerData.length
  dataTable.customerData.push({ id: idTable, code: '', name: '' })
}
const addLastIndexProductTable = () => {
  fakeTableProductData.push({ code: '', name: '', switch: false })
}
//fake option
const listProductsTable = reactive([
  { value: 'dev1', label: '1', name: '111', id: 1 },
  { value: '22', label: '2', name: '222', id: 2 },
  { value: '33', label: '3', name: '333', id: 3 }
])

const listCustomer = ref()
//get list customer
const callAPICustomer = async () => {
  const res = await getAllCustomer({ PageIndex: 1, PageSize: 20 })
  if (res.data && res.data.length > 0) {
    listCustomer.value = res.data.map((customer) => ({
      value: customer.code,
      label: customer.phonenumber,
      name: customer.name,
      id: customer.id
    }))
  }
}

//process logic data when click select
const changeName = (data, scope) => {
  forceRemove.value = false
  //change data of code
  scope.row.code = data
  // need a function to find the name of the option selected
  //then scope.row.name = result find
}
const removeCustomer = (scope) => {
  forceRemove.value = true
  dataTable.customerData.splice(scope.$index, 1)
  console.log('fakeTableCustomerData', dataTable.customerData)
}
const removeProduct = (scope) => {
  forceRemove.value = true
  fakeTableProductData.splice(scope.$index, 1)
}
const getValueOfSelected = (_value, obj, scope) => {
  scope.row.name = obj.name
}
const changeVoucherCondition = () => {}
const SpaSelectOptions = ref()
let callSpaApi = 0
const getSpaOptions = async () => {
  if (callSpaApi == 0) {
    await getSpaLibrary({ PageIndex: 1, PageSize: 100 }).then(
      (res) =>
        (SpaSelectOptions.value = res.data.map((spa) => ({
          label: spa.name,
          value: spa.id
        })))
    )
    callSpaApi++
  }
}
const selectSpaService = ref([])
const optionsSpaService = [
  {
    name: 'SP3542',
    value: 'Kiểm tra',
    label: 'Kiểm tra'
  },
  {
    name: 'SP35423',
    value: 'Vệ sinh',
    label: 'Vệ sinh'
  },
  {
    name: 'SP35424',
    value: 'Khử mùi nano',
    label: 'Khử mùi nano'
  }
]

onBeforeMount(() => {
  callAPICustomer()
})
</script>
<template>
  <ContentWrap :title="props.title" :back-button="props.backButton">
    <ElRow :gutter="20" justify="space-between">
      <ElCol :span="fullSpan">
        <Form :rules="rules" @register="register">
          <template #tableCustomer>
            <el-table :data="dataTable.customerData" border>
              <el-table-column prop="code" :label="t('reuse.customerCode')" width="250"
                ><template #default="scope">
                  <MultipleOptionsBox
                    :fields="[
                      t('reuse.customerCode'),
                      t('reuse.phoneNumber'),
                      t('formDemo.customerName')
                    ]"
                    filterable
                    width="500px"
                    :items="listCustomer"
                    valueKey="value"
                    labelKey="value"
                    :hiddenKey="['id']"
                    :placeHolder="t('reuse.chooseCustomerCode')"
                    :clearable="false"
                    :defaultValue="scope.row.code"
                    @update-value="(value, obj) => getValueOfSelected(value, obj, scope)"
                    @change="(option) => changeName(option, scope)"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="name" :label="t('reuse.customerName')" width="500"
                ><template #default="scope">{{ scope.row.name }}</template></el-table-column
              >
              <el-table-column :label="t('reuse.operator')" fixed="right">
                <template #default="scope">
                  <el-button type="danger" v-if="scope.row.code" @click="removeCustomer(scope)">{{
                    t('reuse.delete')
                  }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <template #tableProduct>
            <el-table :data="fakeTableProductData" border>
              <el-table-column prop="code" :label="t('formDemo.productManagementCode')" width="250"
                ><template #default="scope">
                  <MultipleOptionsBox
                    :fields="[
                      t('reuse.productCode'),
                      t('reuse.managementCode'),
                      t('reuse.productInformation')
                    ]"
                    filterable
                    width="500px"
                    :items="listProductsTable"
                    valueKey="value"
                    labelKey="value"
                    :hiddenKey="['id']"
                    :placeHolder="t('reuse.chooseProductCode')"
                    :clearable="false"
                    :defaultValue="scope.row.code"
                    @update-value="(value, obj) => getValueOfSelected(value, obj, scope)"
                    @change="(option) => changeName(option, scope)"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="name" :label="t('formDemo.productInfomation')" width="500" />
              <el-table-column :label="t('formDemo.joinTheProgram')" width="200">
                <template #default="scope"><el-switch v-model="scope.row.switch" /></template
              ></el-table-column>
              <el-table-column :label="t('reuse.operator')" fixed="right">
                <template #default="scope">
                  <el-button type="danger" v-if="scope.row.code" @click="removeProduct(scope)">{{
                    t('reuse.delete')
                  }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>

          <template #tableProductOfAuction>
            <el-table :data="fakeTableProductData" border>
              <el-table-column prop="code" :label="t('formDemo.productManagementCode')" width="250"
                ><template #default="scope">
                  <MultipleOptionsBox
                    :fields="[
                      t('reuse.productCode'),
                      t('reuse.managementCode'),
                      t('reuse.productInformation')
                    ]"
                    filterable
                    width="500px"
                    :items="listProductsTable"
                    valueKey="value"
                    labelKey="value"
                    :hiddenKey="['id']"
                    :placeHolder="t('reuse.chooseProductCode')"
                    :clearable="false"
                    :defaultValue="scope.row.code"
                    @update-value="(value, obj) => getValueOfSelected(value, obj, scope)"
                    @change="(option) => changeName(option, scope)"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="name" :label="t('formDemo.productInfomation')" width="700" />
              <el-table-column :label="t('reuse.operator')" fixed="right">
                <template #default="scope">
                  <el-button type="danger" v-if="scope.row.code" @click="removeProduct(scope)">{{
                    t('reuse.delete')
                  }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>

          <template #tableProductOfCombo>
            <el-table :data="fakeTableProductData" border>
              <el-table-column prop="code" :label="t('formDemo.productManagementCode')" width="250"
                ><template #default="scope">
                  <MultipleOptionsBox
                    :fields="[
                      t('reuse.productCode'),
                      t('reuse.managementCode'),
                      t('reuse.productInformation')
                    ]"
                    filterable
                    width="500px"
                    :items="listProductsTable"
                    valueKey="value"
                    labelKey="value"
                    :hiddenKey="['id']"
                    :placeHolder="t('reuse.chooseProductCode')"
                    :clearable="false"
                    :defaultValue="scope.row.code"
                    @update-value="(value, obj) => getValueOfSelected(value, obj, scope)"
                    @change="(option) => changeName(option, scope)"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="name" :label="t('formDemo.productInfomation')" width="500" />
              <el-table-column
                prop="selfImportAccessories"
                :label="t('reuse.spaService')"
                width="320"
                ><template #default>
                  <el-select
                    v-model="selectSpaService"
                    multiple
                    placeholder="Select"
                    style="width: 300px"
                  >
                    <div class="flex gap-4">
                      <div class="flex-1 font-bold pl-5 h-[34px]">Mã dịch vụ</div>
                      <div class="flex-1 font-bold pl-5 h-[34px]">Thông tin dịch vụ</div>
                    </div>
                    <el-option
                      v-for="item in optionsSpaService"
                      :key="item.value"
                      :label="item.label"
                      :name="item.name"
                      :value="item.name"
                      class="fix-padding"
                    >
                      <div class="flex gap-4">
                        <div class="flex-1 pl-5">{{ item.name }}</div>
                        <div class="flex-1 pl-5">{{ item.value }}</div>
                      </div>
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column :label="t('reuse.operator')" fixed="right">
                <template #default="scope">
                  <el-button type="danger" v-if="scope.row.code" @click="removeProduct(scope)">{{
                    t('reuse.delete')
                  }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <template #spaProduct>
            <el-table :data="fakeSpaProductData" border>
              <el-table-column prop="code" :label="t('formDemo.productManagementCode')" width="250"
                ><template #default="scope">
                  <MultipleOptionsBox
                    :fields="[
                      t('reuse.productCode'),
                      t('reuse.managementCode'),
                      t('reuse.productInformation')
                    ]"
                    filterable
                    width="500px"
                    :items="listProductsTable"
                    valueKey="value"
                    labelKey="value"
                    :hiddenKey="['id']"
                    :placeHolder="t('reuse.chooseProductCode')"
                    :clearable="false"
                    :defaultValue="scope.row.code"
                    @update-value="(value, obj) => getValueOfSelected(value, obj, scope)"
                    @change="(option) => changeName(option, scope)"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="name" :label="t('formDemo.productInfomation')" width="500" />
              <el-table-column width="200">
                <template #header
                  >{{ t('reuse.spaService')
                  }}<span style="color: orange">{{
                    t('reuse.chooseAtleast1SpaService')
                  }}</span></template
                >
                <template #default="scope">
                  <el-select
                    @click="getSpaOptions"
                    multiple
                    clearable
                    v-model="scope.row.service"
                    class="m-2"
                    placeholder="Select"
                    size="large"
                  >
                    <el-option
                      v-for="item in SpaSelectOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    /> </el-select></template
              ></el-table-column>
              <el-table-column :label="t('reuse.operator')" fixed="right">
                <template #default="scope">
                  <el-button type="danger" v-if="scope.row.code" @click="removeProduct(scope)">{{
                    t('reuse.delete')
                  }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <template #voucherButton>
            <el-button @click="changeVoucherCondition" :icon="addIcon" style="width: 100%">{{
              t('formDemo.change')
            }}</el-button>
          </template>
          <template #statusVoucher="form">
            <el-checkbox v-model="form['statusVoucher']" size="large"
              ><template #default
                ><span>{{ t('formDemo.sendImmediatelyAfterBrowsing') }} </span
                ><span style="color: orange"
                  >({{ t('reuse.voucherStatusExplain') }})</span
                ></template
              ></el-checkbox
            >
          </template>
          <template #statusValue="form">
            <div
              v-if="form['statusValue'] == 0"
              class="backgroundAroundLetter"
              style="background: orange"
              >{{ t('reuse.pending') }}</div
            >
            <div v-else class="backgroundAroundLetter" style="background: blue">{{
              t('formDemo.theProgramIsRunning')
            }}</div>
          </template>
        </Form>
      </ElCol>
      <ElCol
        :span="hasImage ? 8 : 0"
        v-if="hasImage"
        class="max-h-400px overflow-y-auto shadow-inner p-1"
      >
        <ElDivider class="text-center font-bold">{{ t('reuse.addImage') }}</ElDivider>
        <el-upload
          action="#"
          :disabled="props.type === 'detail'"
          :auto-upload="false"
          :show-file-list="multipleImages"
          v-model:file-list="fileList"
          :list-type="listType"
          :limit="limitUpload"
          :on-change="handleChange"
          :multiple="multipleImages"
          :class="multipleImages ? 'avatar-uploader' : 'one-avatar-uploader'"
        >
          <div v-if="!multipleImages" class="one-avatar-uploader">
            <div
              v-if="imageUrl"
              style="width: 148px; height: 148px; border-radius: 4px"
              class="flex justify-center relative mb-2"
            >
              <ElImage fit="contain" :src="imageUrl" class="avatar" />
            </div>
            <ElButton
              v-else
              :icon="addIcon"
              style="border: dashed 1px #e5e7eb"
              class="avatar-uploader-icon"
            />
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
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <ElButton :icon="deleteIcon" :disabled="props.type === 'detail'" />
                </span>
              </span>
            </div>
          </template>
        </el-upload>
        <div
          class="w-250px flex justify-center"
          :class="multipleImages ? 'avatar-uploader' : 'one-avatar-uploader'"
          v-if="imageUrl"
        >
          <ElButton :icon="viewIcon" @click="previewImage" />
          <ElButton :icon="deleteIcon" :disabled="props.type === 'detail'" @click="removeImage" />
        </div>
        <el-dialog top="5vh" v-model="dialogVisible" width="130vh">
          <el-image class="h-full" :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </ElCol>
    </ElRow>
    <template #under v-if="!removeButton">
      <div v-if="props.type === 'add' || isNaN(props.id)">
        <ElButton type="primary" :loading="loading" @click="save('add')">
          {{ t('reuse.save') }}
        </ElButton>
        <ElButton type="primary" :loading="loading" @click="save('saveAndAdd')">
          {{ t('reuse.saveAndAdd') }}
        </ElButton>
      </div>
      <div v-if="props.type === 'detail'">
        <ElButton :loading="loading" @click="edit">
          {{ t('reuse.edit') }}
        </ElButton>
        <ElButton type="danger" :loading="loading" @click="delAction">
          {{ t('reuse.delete') }}
        </ElButton>
      </div>
      <div v-if="props.type === 'edit'">
        <ElButton type="primary" :loading="loading" @click="save('edit')">
          {{ t('reuse.save') }}
        </ElButton>
        <ElButton :loading="loading" @click="cancel">
          {{ t('reuse.cancel') }}
        </ElButton>
        <ElButton type="danger" :loading="loading" @click="delAction">
          {{ t('reuse.delete') }}
        </ElButton>
      </div>
    </template>
  </ContentWrap>
</template>
<style scoped>
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
