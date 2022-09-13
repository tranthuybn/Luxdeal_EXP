<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import {
  ElCollapse,
  ElCollapseItem,
  ElUpload,
  ElSelect,
  ElOption,
  ElCheckbox,
  ElButton
} from 'element-plus'
import type { UploadFile } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useForm } from '@/hooks/web/useForm'
import { Collapse } from '../../Components/Type'
import { Form } from '@/components/Form'

import tableDatetimeFilterBasicVue from '@/views/Pages/Components/TableDataBase.vue'
import { featuresPrice } from './ProductLibraryManagement'
import { getFeaturesPrices } from '@/api/LibraryAndSetting'

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
      span: 20
    },
    componentProps: {
      placeholder: t('formDemo.enterOrderCode')
    }
  },
  {
    field: 'collaborators',
    component: 'Input',
    colProps: {
      span: 20
    },
    componentProps: {
      placeholder: t('formDemo.selectOrEnterTheCollaboratorCode')
    }
  },
  {
    field: 'orderNotes',
    component: 'Input',
    colProps: {
      span: 20
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
      span: 20
    }
  },
  {
    field: 'companyInformation',
    component: 'Input',
    colProps: {
      span: 20
    }
  },
  {
    field: 'debt',
    component: 'Input',
    colProps: {
      span: 20
    }
  }
])

const activeName = ref('orderInformation')
const handleChange = (val: string[]) => {
  console.log(val)
}

const titleName = t('formDemo.productAndPayment')

const { register } = useForm()

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

const collapse: Array<Collapse> = [
  {
    icon: plusIcon,
    name: 'priceCharacteristics',
    title: 'Bảng đặc tính và giá bán',
    columns: featuresPrice,
    api: getFeaturesPrices,
    buttonAdd: 'Thêm đặc tính và giá bán',
    typeForm: 'table',
    typeButton: 'table',
    expand: true,
    apiTableChild: undefined,
    columnsTableChild: undefined,
    pagination: false,
    removeHeaderFilter: true,
    removeDrawer: true,
    selection: false,
    customOperator: 2,
    titleChilden: 'reuse.rentalPriceTableByQuantity'
  }
]

const newSchema = reactive<FormSchema[]>([
  {
    field: 'paymenAndDelivery',
    label: t('formDemo.paymenAndDelivery'),
    component: 'Divider'
  },
  {
    field: 'choosePayment',
    component: 'Select'
  },
  {
    field: 'chooseShipping',
    component: 'Select'
  },
  {
    field: 'orderStatus',
    component: 'Input',
    value: []
  },
  {
    field: 'buttons',
    component: 'Input',
    value: []
  }
])

const value = ref('')
const value2 = ref('')

const options1 = [
  {
    value: 'cashPayment',
    label: t('formDemo.cashPayment')
  },
  {
    value: 'cardPayment',
    label: t('formDemo.cardPayment')
  }
]

const options2 = [
  {
    value: 'deliveryAtTheCounter',
    label: t('formDemo.deliveryAtTheCounter')
  },
  {
    value: 'deliveryToYourPlace',
    label: t('formDemo.deliveryToYourPlace')
  }
]

const checked1 = ref(true)
const checked2 = ref(false)
const checked3 = ref(false)
const checked4 = ref(false)
const checked5 = ref(false)
const checked6 = ref(false)
const checked7 = ref(false)

const doThis = () => {
  console.log('sas')
}
</script>

<template>
  <div class="demo-collapse dark:bg-[#141414]">
    <el-collapse v-model="activeName" @change="handleChange">
      <el-collapse-item :title="`${t('formDemo.orderInformation')}`" name="orderInformation">
        <div class="flex w-[100%]">
          <div class="w-[70%]">
            <Form
              :schema="schema"
              label-position="top"
              hide-required-asterisk
              size="large"
              class="flex border-1 border-[var(--el-border-color)] border-solid rounded-3xl box-shadow-blue bg-white dark:bg-[#141414]"
              @register="register"
            >
              <template #orderCode>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[16%] text-right" for="">{{ t('formDemo.orderCode') }}</label>
                  <input
                    class="w-[80%] border-1 w-[100%] outline-none pl-2"
                    type="text"
                    :placeholder="`${t('formDemo.orderCode')}`"
                  />
                </div>
              </template>
              <template #collaborators>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[16%] text-right" for="">{{ t('formDemo.collaborators') }}</label>
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
                  <label class="w-[16%] text-right" for="">{{ t('formDemo.orderNotes') }}</label>
                  <input
                    class="w-[80%] border-1 outline-none pl-2"
                    type="text"
                    :placeholder="`${t('formDemo.addNotes')}`"
                  />
                </div>
              </template>
              <template #customerName>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[16%] text-right" for="">{{ t('formDemo.customerName') }}</label>
                  <div class="flex w-[84%] gap-2">
                    <input class="w-[80%] border-1 outline-none pl-2" type="text" />
                    <button @click.stop.prevent="doThis" class="border-1 pl-5 pr-5 border-[#2C6DDA]"
                      >+ {{ t('button.add') }}</button
                    >
                  </div>
                </div>
              </template>
              <template #companyInformation>
                <div class="flex items-center w-[100%] gap-4">
                  <div class="w-[16%] text-right" for="">{{
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
                  <div class="ml-[17%] w-[80%] bg-[#f4f8fd] dark:bg-[#3B3B3B] text-blue-500">
                    <p class="ml-2">{{ t('formDemo.noDebt') }}</p>
                  </div>
                </div>
              </template>
            </Form>
          </div>
          <div class="w-[30%] p-2">
            <div class="text-sm text-[#303133] font-medium p-2 pl-4 dark:text-[#fff]">{{
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
                  <div class="text-[#303133] font-medium dark:text-[#fff]"
                    >+ {{ t('formDemo.addPhotosOrFiles') }}</div
                  >
                </el-dialog>
              </el-upload>
            </div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item
        :title="titleName"
        v-for="(item, index) in collapse"
        :name="item.name"
        :key="index"
      >
        <tableDatetimeFilterBasicVue
          :pagination="item.pagination"
          :removeHeaderFilter="item.removeHeaderFilter"
          :removeDrawer="item.removeDrawer"
          :expand="item.expand"
          v-if="item.typeForm === 'table' || item.typeForm === 'all'"
          :titleButtons="item.buttonAdd"
          :columns="item.columns"
          :api="item.api"
          :apiTableChild="item.apiTableChild"
          :columnsTableChild="item.columnsTableChild"
          :selection="item.selection"
          :customOperator="item.customOperator"
          :titleChilden="item.titleChilden"
          :customOperatorChilden="item.customOperatorChilden"
        />
        <Form
          :schema="newSchema"
          label-position="top"
          hide-required-asterisk
          size="large"
          @register="register"
          class="d-block dark:bg-[#141414]"
        >
          <template #choosePayment>
            <div class="flex align-middle gap-4">
              <label class="w-[9%] text-right">{{ t('formDemo.choosePayment') }}</label>
              <div class="w-[46%]">
                <el-select
                  v-model="value"
                  class="m-2"
                  :placeholder="`${t('formDemo.cashPayment')}`"
                  size="large"
                >
                  <el-option
                    v-for="i in options1"
                    :key="i.value"
                    :label="i.label"
                    :value="i.value"
                  />
                </el-select>
              </div>
            </div>
          </template>
          <template #chooseShipping>
            <div class="flex gap-4">
              <label class="w-[9%] text-right">{{ t('formDemo.chooseShipping') }}</label>
              <div class="w-[46%]">
                <el-select
                  v-model="value2"
                  class="m-2"
                  :placeholder="`${t('formDemo.deliveryAtTheCounter')}`"
                  size="large"
                >
                  <el-option
                    v-for="i in options2"
                    :key="i.value"
                    :label="i.label"
                    :value="i.value"
                  />
                </el-select>
              </div>
            </div>
          </template>
          <template #orderStatus>
            <div class="flex gap-4 w-[100%] ml-1">
              <label class="w-[9%] text-right">{{ t('formDemo.orderStatus') }}</label>
              <div class="w-[84%] pl-1">
                <el-checkbox v-model="checked1" :label="`${t('reuse.pending')}`" size="large" />
                <el-checkbox
                  v-model="checked2"
                  :label="`${t('reuse.closedTheOrder')}`"
                  size="large"
                />
                <el-checkbox v-model="checked3" :label="`${t('reuse.delivery')}`" size="large" />
                <el-checkbox
                  v-model="checked4"
                  :label="`${t('reuse.successfulDelivery')}`"
                  size="large"
                />
                <el-checkbox
                  v-model="checked5"
                  :label="`${t('reuse.deliveryFailed')}`"
                  size="large"
                />
                <el-checkbox v-model="checked6" :label="`${t('reuse.paying')}`" size="large" />
                <el-checkbox v-model="checked7" :label="`${t('common.doneLabel')}`" size="large" />
              </div>
            </div>
          </template>
          <template #buttons>
            <div class="w-[100%] flex gap-4">
              <div class="ml-[10%] w-[100%] flex ml-1 gap-4">
                <el-button class="min-w-40">{{ t('formDemo.edit') }}</el-button>
                <el-button type="primary" class="min-w-40">{{
                  t('formDemo.printSalesSlip')
                }}</el-button>
                <el-button class="min-w-40">{{ t('formDemo.printDepositSlip') }}</el-button>
                <el-button type="primary" class="min-w-40">{{ t('formDemo.complete') }}</el-button>
                <el-button class="min-w-40">{{ t('reuse.cancel') }}</el-button>
                <el-button type="danger" class="min-w-40">{{ t('reuse.delete') }}</el-button>
              </div>
            </div>
          </template>
        </Form>
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

::v-deep(.d-block > .el-row) {
  display: block;
}

::v-deep(.el-form-item__content) {
  display: block;
}

@media only screen and (min-width: 1920px) {
  ::v-deep(.el-col-xl-12) {
    max-width: 100%;
  }
}
</style>
