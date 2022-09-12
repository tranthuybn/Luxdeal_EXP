<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ElCollapse, ElCollapseItem, ElUpload } from 'element-plus'
import type { UploadFile } from 'element-plus'
// import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
// import { getBranchList } from '@/api/HumanResourceManagement'
import { useIcon } from '@/hooks/web/useIcon'
import { useForm } from '@/hooks/web/useForm'
// import CollapseBase from '@/views/Pages/Components/CollapseBase.vue'
import { Collapse } from '../../Components/Type'
// import { columnProfileProduct } from './ProductLibraryManagement'
import { Form } from '@/components/Form'
// import { ElCheckbox, ElLink } from 'element-plus'

// import { TableOperator } from '../Components/TableBase'
// import TableOperator from '../../Components/TableBase/src/TableOperator.vue'
// import tableDatetimeFilterBasicVue from '@/views/Pages/Components/tableType01-datetimefilter-basic.vue'
import { featuresPrice } from './ProductLibraryManagement'
import { getPriceByQuantity } from '@/api/LibraryAndSetting'

const { t } = useI18n()

const schema = reactive<FormSchema[]>([
  {
    field: 'generalInformation',
    label: t('formDemo.generalInformation'),
    component: 'Divider'
  },
  {
    field: 'orderCode',
    component: 'Input',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: t('formDemo.enterOrderCode')
    }
  },
  {
    field: 'collaborators',
    component: 'Input',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: t('formDemo.selectOrEnterTheCollaboratorCode')
    }
  },
  {
    field: 'orderNotes',
    component: 'Input',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: t('formDemo.addNotes')
    }
  },
  {
    field: 'customer',
    label: t('formDemo.customer'),
    component: 'Divider'
  },
  {
    field: 'customerName',
    component: 'Input',
    colProps: {
      span: 18
    }
  },
  {
    field: 'companyInformation',
    component: 'Input',
    colProps: {
      span: 18
    }
  },
  {
    field: 'debt',
    component: 'Input',
    colProps: {
      span: 18
    }
  }
  // {
  //   field: 'customer',
  //   label: t('reuse.promotion'),
  //   component: 'Divider'
  // },
  // {
  //   field: 'voucher',
  //   component: 'Select',
  //   colProps: {
  //     span: 18
  //   },
  //   componentProps: {
  //     placeholder: t('formDemo.selectOrEnterCouponCode'),
  //     options: [
  //       {
  //         label: 'option1',
  //         value: '1'
  //       },
  //       {
  //         label: 'option2',
  //         value: '2'
  //       }
  //     ]
  //   }
  // }
  // {
  //   field: 'discountVoucher',
  //   component: 'Input',
  //   colProps: {
  //     span: 18
  //   },
  //   componentProps: {
  //     modelValue: t('formDemo.discountVoucher'),
  //     class: 'custom-background'
  //   }
  // }
])
const activeName = ref('orderInformation')
const handleChange = (val: string[]) => {
  console.log(val)
}

const { register } = useForm()
// const props = defineProps({
//   collapse: {
//     type: Array<Collapse>,
//     default: () => []
//   }
// })
// const plusIcon = useIcon({ icon: 'akar-icons:plus' })
// const minusIcon = useIcon({ icon: 'akar-icons:minus' })

// let currentCollapse = ref<string>(props.collapse[0].name)
// const collapseChangeEvent = (val) => {
//   if (val) {
//     props.collapse.forEach((el) => {
//       if (val.includes(el.name)) el.icon = minusIcon
//       else if (el.icon == minusIcon) el.icon = plusIcon
//     })
//   } else
//     props.collapse.forEach((el) => {
//       el.icon = plusIcon
//     })
// }
// const collapse: Array<Collapse> = [
//   {
//     icon: minusIcon,
//     name: 'information',
//     title: 'Thông tin sản phẩm',
//     columns: [],
//     api: undefined,
//     buttonAdd: '',
//     buttons: 1,
//     expand: false,
//     apiTableChild: undefined,
//     columnsTableChild: undefined,
//     pagination: false,
//     removeHeaderFilter: true,
//     removeDrawer: false,
//     selection: false
//   },
//   {
//     icon: minusIcon,
//     name: 'information',
//     title: 'Thông tin sản phẩm',
//     columns: [],
//     api: undefined,
//     buttonAdd: '',
//     buttons: 1,
//     expand: false,
//     apiTableChild: undefined,
//     columnsTableChild: undefined,
//     pagination: false,
//     removeHeaderFilter: true,
//     removeDrawer: false,
//     selection: false
//   }
// ]

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)

const handleRemove = (file: UploadFile) => {
  console.log(file)
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const handleDownload = (file: UploadFile) => {
  console.log(file)
}

const plusIcon = useIcon({ icon: 'akar-icons:plus' })
// const minusIcon = useIcon({ icon: 'akar-icons:minus' })

const collapse: Array<Collapse> = [
  {
    icon: plusIcon,
    name: 'priceCharacteristics',
    title: 'Bảng đặc tính và giá bán',
    columns: featuresPrice,
    api: undefined,
    buttonAdd: 'Thêm đặc tính và giá bán',
    buttons: 2,
    expand: true,
    apiTableChild: undefined,
    columnsTableChild: undefined,
    pagination: false,
    removeHeaderFilter: true,
    removeDrawer: false,
    selection: false
  }
]
// Table column
// const testTable = reactive<TableColumn[]>([
//   {
//     field: 'managementCode',
//     label: t('reuse.managementCode'),
//     minWidth: '250'
//   },
//   {
//     field: 'featureGroup',
//     label: t('Thông tin sản phẩm'),
//     minWidth: '200'
//   },
//   {
//     field: 'quantityTo',
//     label: t('Kho xuất'),
//     minWidth: '130'
//   },
//   {
//     field: 'productCategoryUnit',
//     label: t('Số lượng'),
//     minWidth: '130'
//   },
//   {
//     field: 'unitPrices',
//     label: t('Đơn giá'),
//     minWidth: '130'
//   },
//   {
//     field: 'promotionPrice',
//     label: t('Thành tiền'),
//     minWidth: '130'
//   }
// ])
</script>

<template>
  <div class="demo-collapse">
    <el-collapse v-model="activeName" @change="handleChange">
      <el-collapse-item :title="`- ${t('formDemo.orderInformation')}`" name="orderInformation">
        <div class="flex w-[100%]">
          <div class="w-[70%]">
            <Form
              :schema="schema"
              label-position="top"
              hide-required-asterisk
              size="large"
              class="flex border-1 border-[var(--el-border-color)] border-solid rounded-3xl box-shadow-blue bg-white"
              @register="register"
            >
              <template #orderCode>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[12%] text-right" for="">{{ t('formDemo.orderCode') }}</label>
                  <input
                    class="w-[80%] border-1 w-[100%] outline-none pl-2"
                    type="text"
                    :placeholder="`${t('formDemo.orderCode')}`"
                  />
                </div>
              </template>
              <template #collaborators>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[12%] text-right" for="">{{ t('formDemo.collaborators') }}</label>
                  <div class="flex w-[80%] gap-2">
                    <input
                      class="w-[50%] border-1 outline-none pl-2"
                      type="text"
                      :placeholder="`${t('formDemo.selectOrEnterTheCollaboratorCode')}`"
                    />
                    <input
                      class="w-[50%] border-1 outline-none pl-2"
                      type="text"
                      :placeholder="`${t('formDemo.enterDiscount')}`"
                    />
                  </div>
                </div>
              </template>
              <template #orderNotes>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[12%] text-right" for="">{{ t('formDemo.orderNotes') }}</label>
                  <input
                    class="w-[80%] border-1 outline-none pl-2"
                    type="text"
                    :placeholder="`${t('formDemo.addNotes')}`"
                  />
                </div>
              </template>
              <template #customerName>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[12%] text-right" for="">{{ t('formDemo.customerName') }}</label>
                  <div class="flex w-[88%] gap-2">
                    <input class="w-[80%] border-1 outline-none pl-2" type="text" />
                    <button class="border-1 pl-5 pr-5 border-[#2C6DDA]"
                      >+ {{ t('button.add') }}</button
                    >
                  </div>
                </div>
              </template>
              <template #companyInformation>
                <div class="flex items-center w-[100%] gap-4">
                  <div class="w-[12%] text-right" for="">{{
                    t('formDemo.companyInformation')
                  }}</div>
                  <div class="w-[80%] leading-5">
                    <div>Công ty cổ phần Bắc Á</div>
                    <div>Mã số thuế: 0994563243</div>
                    <div>Địa chỉ: 79 Khúc Thừa Dụ, phường Dịch Vọng, quận Cầu Giấy, Hà Nội</div>
                    <div>Email: info@baca.com</div>
                  </div>
                </div>
              </template>
              <template #debt>
                <div class="flex items-center w-[100%]">
                  <div class="ml-[13%] w-[80%] bg-[#f4f8fd] text-blue-500">
                    <p class="ml-4">{{ t('formDemo.noDebt') }}</p>
                  </div>
                </div>
              </template>
            </Form>
          </div>
          <div class="w-[30%] p-2">
            <div class="text-sm text-[#303133] font-medium p-2 pl-4">{{
              t('formDemo.attachments')
            }}</div>
            <div class="pl-4">
              <el-upload action="#" list-type="picture-card" :auto-upload="false" class="relative">
                <template #file="{ file }">
                  <div>
                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                    <span class="el-upload-list__item-actions">
                      <span
                        class="el-upload-list__item-preview"
                        @click="handlePictureCardPreview(file)"
                      >
                      </span>
                      <span
                        v-if="!disabled"
                        class="el-upload-list__item-delete"
                        @click="handleDownload(file)"
                      >
                      </span>
                      <span
                        v-if="!disabled"
                        class="el-upload-list__item-delete"
                        @click="handleRemove(file)"
                      >
                      </span>
                    </span>
                  </div>
                </template>
                <el-dialog v-model="dialogVisible" class="absolute">
                  <div class="text-[#303133] font-medium"
                    >+ {{ t('formDemo.addPhotosOrFiles') }}</div
                  >
                </el-dialog>
              </el-upload>
            </div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="- Thông tin sản phẩm" name="productInformation">
        <div v-for="(item, index) in collapse" :key="index" :name="item.name">
          <tableDatetimeFilterBasicVue
            :pagination="item.pagination"
            :removeHeaderFilter="item.removeHeaderFilter"
            :removeDrawer="item.removeDrawer"
            :expand="item.expand"
            v-if="item.buttons == 2"
            :titleButtons="item.buttonAdd"
            :columns="item.columns"
            :api="item.api"
            :key="item.buttons"
            :apiTableChild="item.apiTableChild"
            :columnsTableChild="item.columnsTableChild"
            :selection="item.selection"
          />
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<style scoped>
::v-deep(.el-select) {
  width: 100%;
}
::v-deep(.el-textarea__inner) {
  box-shadow: none;
  padding: 5px 0;
}

::v-deep(.el-form-item) {
  display: flex;
  align-items: center;
}

::v-deep(.el-upload--picture-card) {
  width: 160px;
  height: 40px;
  border: 1px solid #409eff;
}
</style>
