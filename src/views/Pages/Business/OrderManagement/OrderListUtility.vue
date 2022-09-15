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
  ElButton,
  ElDivider,
  ElTable,
  ElTableColumn,
  ElInput
} from 'element-plus'
import type { UploadFile } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useForm } from '@/hooks/web/useForm'
import { Form } from '@/components/Form'
import { Collapse } from '../../Components/Type'
const { t } = useI18n()

const schema = reactive<FormSchema[]>([
  {
    field: 'orderInformation',
    label: t('formDemo.orderInformation'),
    component: 'Divider',
    colProps: {
      span: 12
    }
  },
  {
    field: 'orderCode',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('formDemo.enterOrderCode')
    }
  },
  {
    field: 'collaborators',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('formDemo.selectOrEnterTheCollaboratorCode')
    }
  },
  {
    field: 'orderNotes',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('formDemo.addNotes')
    }
  }
])

const newList = reactive<FormSchema[]>([
  {
    field: 'customer',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'customerName',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'debtAndAddress',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'companyInformation',
    component: 'Input',
    colProps: {
      span: 12
    }
  }
])

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
const minusIcon = useIcon({ icon: 'akar-icons:minus' })

const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'generalInformation',
    title: t('formDemo.generalInformation'),
    columns: [],
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
    customOperator: 3
  },
  {
    icon: plusIcon,
    name: 'productAndPayment',
    title: t('formDemo.productAndPayment'),
    columns: [],
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
    customOperator: 3
  },
  {
    icon: plusIcon,
    name: 'productImportHistory',
    title: t('formDemo.productImportHistory'),
    columns: [],
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
    customOperator: 3
  }
]

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
    label: t('formDemo.selfDelivery')
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

const input = ref("`/${t('formDemo.selfImportAccessories')}/`")

const tableData = [
  {
    name: 'LV Flourine red X monogam bag da sần - Lage(.5.5 - 40.5)-Gently used / Đỏ; không quai',
    address: 'No. 189, Grove St, Los Angeles',
    quantity: '2',
    unitPrice: '10,000,000 đ',
    intoMoney: '20,000,000 đ'
  },
  {
    name: 'LV Flourine red X monogam bag da sần - Lage(.5.5 - 40.5)-Gently used / Đỏ; có quai',
    address: 'No. 189, Grove St, Los Angeles',
    quantity: '2',
    unitPrice: '10,000,000 đ',
    intoMoney: '20,000,000 đ'
  },
  {
    name: 'Vòng cổ ngọc trai kim cương',
    address: 'No. 189, Grove St, Los Angeles',
    quantity: '1',
    unitPrice: '150,000,000 đ',
    intoMoney: '150,000,000 đ'
  },
  {
    name: '',
    address: '',
    quantity: '',
    unitPrice: '',
    intoMoney: ''
  }
]

const tableData2 = [
  {
    name: '',
    address: '',
    quantity: '',
    unitPrice: '',
    intoMoney: ''
  }
]

const debtTable = [
  {
    dateOfPayment: t('formDemo.dateOfPayment'),
    col: 'Thanh toán tiền mua hàng',
    date: '02/07/2022',
    address: '',
    quantity: '',
    unitPrice: '',
    intoMoney: ''
  }
]

const historyTable = [
  {
    name: 'Droplist & chỉ lấy sản phẩm trong danh sách sản phẩm bán của đơn này',
    address: 'No. 189, Grove St, Los Angeles',
    quantity: '//',
    unitPrice: '//',
    intoMoney: '//'
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
const activeName = ref('1')
</script>

<template>
  <div class="demo-collapse dark:bg-[#141414]">
    <el-collapse v-model="activeName" @change="collapseChangeEvent">
      <el-collapse-item name="1">
        <template #title>
          <el-button class="header-icon" :icon="collapse[0].icon" link />
          <span class="text-center text-xl">{{ collapse[0].title }}</span>
        </template>
        <div class="flex w-[100%] gap-6">
          <div class="w-[50%]">
            <Form
              :schema="schema"
              label-position="top"
              hide-required-asterisk
              size="large"
              class="flex border-1 border-[var(--el-border-color)] border-none rounded-3xl box-shadow-blue bg-white dark:bg-[#141414]"
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

              <template #debt>
                <div class="flex items-center w-[100%]">
                  <div class="ml-[17%] w-[80%] bg-[#f4f8fd] dark:bg-[#3B3B3B] text-blue-500">
                    <p class="ml-2">{{ t('formDemo.noDebt') }}</p>
                  </div>
                </div>
              </template>
            </Form>
          </div>
          <div class="w-[50%]">
            <div class="text-sm text-[#303133] font-medium p pl-4 dark:text-[#fff]">
              <el-divider content-position="left">{{ t('formDemo.attachments') }}</el-divider>
            </div>
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
        <div class="flex w-[100%]">
          <div class="w-[100%]">
            <Form
              :schema="newList"
              label-position="top"
              hide-required-asterisk
              size="large"
              @register="register"
            >
              <template #customer>
                <div class="flex w-[100%] gap-8">
                  <el-divider content-position="left">{{ t('formDemo.customer') }}</el-divider>
                  <el-divider content-position="left">{{ t('formDemo.delivery') }}</el-divider>
                </div>
              </template>
              <template #customerName>
                <div class="flex gap-4">
                  <div class="flex w-[50%]">
                    <div class="flex w-[100%] gap-4">
                      <label class="w-[15%] text-right ml-2">{{
                        t('formDemo.customerName')
                      }}</label>
                      <input
                        class="w-[62%] border-1 outline-none pl-2"
                        type="text"
                        :placeholder="`${t('formDemo.chooseACustomer')}`"
                      />
                      <button
                        @click.stop.prevent="doThis"
                        class="border-1 pl-4 pr-4 font-bold border-blue-500"
                        >+ {{ t('button.add') }}</button
                      >
                    </div>
                  </div>
                  <div class="flex w-[50%] max-h-[42px]">
                    <div class="flex w-[100%] gap-4">
                      <label class="w-[20%] text-right ml-2">{{
                        t('formDemo.chooseShipping')
                      }}</label>
                      <el-select
                        v-model="value2"
                        :placeholder="`${t('formDemo.selfDelivery')}`"
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
                </div>
              </template>
              <template #debtAndAddress>
                <div class="flex w-[100%] gap-6">
                  <div class="w-[50%] pl-[8%]">
                    <p class="max-w-[94%] bg-[#F4F8FD] ml-3 pl-2 text-blue-500 dark:bg-[#3B3B3B]">{{
                      t('formDemo.noDebt')
                    }}</p>
                  </div>
                  <div class="flex w-[50%] gap-4">
                    <p class="w-[16%] ml-2 text-[#828387] text-right">{{
                      t('formDemo.deliveryAddress')
                    }}</p>
                    <p>79 Khúc Thừa Dụ, phường Dịch Vọng, quận Cầu Giấy, Hà Nội</p>
                    <p class="text-blue-500 cursor-pointer"
                      >+ {{ t('formDemo.changeTheAddress') }}</p
                    >
                  </div>
                </div>
              </template>
              <template #companyInformation>
                <div class="flex gap-4 w-[100%]">
                  <label class="w-[16%] text-right">{{ t('formDemo.customerName') }}</label>
                  <div class="leading-6 mt-2">
                    <div>Nguyễn Phương Linh</div>
                    <div>Số điện thoại: 094345355</div>
                  </div>
                </div>
                <div class="flex gap-4 w-[100%]">
                  <label class="w-[16%] text-right">{{ t('formDemo.companyInformation') }}</label>
                  <div class="leading-6 mt-2">
                    <div>Công ty cổ phần Bắc Á</div>
                    <div>Mã số thuế: 0994563243</div>
                    <div>Địa chỉ: 79 Khúc Thừa Dụ, phường Dịch Vọng, quận Cầu Giấy, Hà Nội</div>
                    <div>Email: info@baca.com</div>
                  </div>
                </div>
              </template>
            </Form>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template #title>
          <el-button class="header-icon" :icon="collapse[1].icon" link />
          <span class="text-center text-xl">{{ collapse[1].title }}</span>
        </template>
        <el-divider content-position="left">{{ t('formDemo.ListOfProductsForSale') }}</el-divider>
        <el-table :data="tableData" border class="pl-4 dark:text-[#fff]">
          <el-table-column :label="`${t('formDemo.productManagementCode')}`" width="150">
            <el-select v-model="value" class="m-2" size="large">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-table-column>
          <el-table-column prop="name" :label="`${t('reuse.productInformation')}`" width="680" />
          <el-table-column :label="`${t('reuse.accessory')}`" width="180">
            <el-input :v-model="input" :placeholder="`/${t('formDemo.selfImportAccessories')}/`" />
          </el-table-column>
          <el-table-column prop="quantity" :label="`${t('formDemo.amount')}`" width="90" />
          <el-table-column
            prop="unitPrice"
            :label="`${t('reuse.unitPrice')}`"
            align="right"
            width="180"
          />
          <el-table-column
            prop="intoMoney"
            :label="`${t('formDemo.intoMoney')}`"
            align="right"
            width="180"
          />
          <el-table-column :label="`${t('formDemo.exportWarehouse')}`" width="200">
            <div class="flex w-[100%]">
              <div class="flex-1">Còn hàng</div>
              <div class="flex-1 text-right text-blue-500 cursor-pointer"
                >+ {{ t('formDemo.chooseWarehouse') }}</div
              >
            </div>
          </el-table-column>
          <el-table-column
            prop="address"
            :label="`${t('formDemo.manipulation')}`"
            align="center"
            width="90"
          >
            <button class="bg-[#EA4F37] pt-2 pb-2 pl-4 pr-4 text-[#fff]">Xóa</button>
          </el-table-column>
        </el-table>
        <el-table :data="tableData2" class="pl-4 dark:text-[#fff]">
          <el-table-column width="150" />
          <el-table-column width="680" />
          <el-table-column width="180" />
          <el-table-column width="90" />
          <el-table-column align="right" width="180">
            <div class="dark:text-[#fff]">{{ t('formDemo.intoMoney') }}</div>
            <div class="text-blue-500 cursor-pointer">{{ t('formDemo.doesNotIncludeVAT') }} </div>
            <div class="text-blue-500 cursor-pointer">+ {{ t('formDemo.choosePromotion') }}</div>
            <div class="dark:text-[#fff]">Tổng tiền</div>
          </el-table-column>
          <el-table-column align="right" width="180">
            <div class="dark:text-[#fff]">190,000,000 đ</div>
            <div class="dark:text-[#fff] text-transparent dark:text-transparent">s</div>
            <div class="dark:text-[#fff]">-95,000,000 đ</div>
            <div class="dark:text-[#fff]">95,000,000 đ</div>
          </el-table-column>
          <el-table-column width="200" />
          <el-table-column width="90" />
        </el-table>
        <el-divider content-position="left">{{ t('formDemo.debtTrackingSheet') }}</el-divider>
        <el-table :data="debtTable" border>
          <el-table-column prop="date" :label="`${t('formDemo.dateOfPayment')}`" width="150" />
          <el-table-column prop="col" :label="`${t('reuse.content')}`" width="240" />
          <el-table-column :label="`${t('formDemo.receiptOrPayment')}`" align="right">
            <div class="text-blue-500">+{{ t('formDemo.receiptOrPayment') }}</div>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.paymentOrder')}`" align="right">
            <div class="text-blue-500">+{{ t('formDemo.paymentOrder') }}</div>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.collected')}`" align="right">
            <div>+ 95,000,000 đ</div>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.spent')}`" />
          <el-table-column :label="`${t('formDemo.unpaidDebt')}`">
            <div>0 đ</div>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.choosePayment')}`">
            <el-select class="m-2" placeholder="Select" size="large">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-table-column>
          <el-table-column :label="`${t('formDemo.manipulation')}`" width="90" align="center">
            <button class="bg-[#EA4F37] pt-2 pb-2 pl-4 pr-4 text-[#fff]">Xóa</button>
          </el-table-column>
        </el-table>
        <div class="w-[100%]">
          <el-divider content-position="left">{{ t('formDemo.statusAndManipulation') }}</el-divider>
        </div>
        <div class="flex gap-4 w-[100%] ml-1 items-center pb-3">
          <label class="w-[9%] text-right">{{ t('formDemo.orderStatus') }}</label>
          <div class="w-[84%] pl-1">
            <el-checkbox v-model="checked1" :label="`${t('reuse.pending')}`" size="large" />
            <el-checkbox v-model="checked2" :label="`${t('reuse.closedTheOrder')}`" size="large" />
            <el-checkbox v-model="checked3" :label="`${t('reuse.delivery')}`" size="large" />
            <el-checkbox
              v-model="checked4"
              :label="`${t('reuse.successfulDelivery')}`"
              size="large"
            />
            <el-checkbox v-model="checked5" :label="`${t('reuse.deliveryFailed')}`" size="large" />
            <el-checkbox v-model="checked6" :label="`${t('reuse.paying')}`" size="large" />
            <el-checkbox v-model="checked7" :label="`${t('common.doneLabel')}`" size="large" />
          </div>
        </div>
        <div class="w-[100%] flex gap-4">
          <div class="ml-[10%] w-[100%] flex ml-1 gap-4">
            <el-button type="primary" class="min-w-42 min-h-11">{{
              t('formDemo.printSalesSlip')
            }}</el-button>
            <el-button class="min-w-42 min-h-11">{{ t('formDemo.temporaryStorage') }}</el-button>
            <el-button type="primary" class="min-w-42 min-h-11">{{
              t('formDemo.complete')
            }}</el-button>
            <el-button type="danger" class="min-w-42 min-h-11">{{ t('reuse.cancel') }}</el-button>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template #title>
          <el-button class="header-icon" :icon="collapse[2].icon" link />
          <span class="text-center text-xl">{{ collapse[2].title }}</span>
        </template>
        <div>
          <el-divider content-position="left">Bảng theo dõi nhập hàng</el-divider>
          <el-table :data="historyTable" border class="pl-4 dark:text-[#fff]">
            <el-table-column :label="`${t('formDemo.productManagementCode')}`" width="150">
              <el-select v-model="value" class="m-2" size="large">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-table-column>
            <el-table-column prop="name" :label="`${t('reuse.productInformation')}`" width="680" />
            <el-table-column :label="`${t('reuse.accessory')}`" width="180">
              <el-input
                :v-model="input"
                :placeholder="`/${t('formDemo.selfImportAccessories')}/`"
              />
            </el-table-column>
            <el-table-column prop="quantity" :label="`${t('formDemo.amount')}`" width="90" />
            <el-table-column
              prop="unitPrice"
              :label="`${t('reuse.unitPrice')}`"
              align="right"
              width="180"
            />
            <el-table-column
              prop="intoMoney"
              :label="`${t('formDemo.intoMoney')}`"
              align="right"
              width="180"
            />
            <el-table-column
              :label="`${t('formDemo.orderReceiptsGoods')}`"
              align="right"
              width="200"
              class="text-blue-500"
            >
              +{{ t('formDemo.orderReceiptsGoods') }}
            </el-table-column>
            <el-table-column
              prop="address"
              :label="`${t('formDemo.manipulation')}`"
              align="center"
              width="90"
            >
              <button class="bg-[#EA4F37] pt-2 pb-2 pl-4 pr-4 text-[#fff]">Xóa</button>
            </el-table-column>
          </el-table>
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

::v-deep(label) {
  color: #828387;
}

::v-deep(.cell) {
  color: #303133;
}

::v-deep(.el-divider__text) {
  font-size: 16px;
}
</style>
