<!-- <script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter } from 'vue-router'
import { Collapse } from '../../Components/Type'
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
  ElInput,
  ElRadioGroup,
  ElRadio,
  ElDialog,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElDatePicker,
  ElForm,
  ElFormItem,
  ElMessage,
  ElNotification,
  ElTreeSelect,
  UploadProps,
  UploadUserFile
} from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { ref } from 'vue';

const { currentRoute } = useRouter()
const { t } = useI18n()

const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'detailsOfPaymentRequest',
    title: t('formDemo.detailsOfPaymentRequest'),
    columns: []
  },
  {
    icon: plusIcon,
    name: 'detailedListExpenses',
    title: t('formDemo.detailedListExpenses'),
    columns: []
  }
]

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
</script>

<template>
  <div class="demo-collapse dark:bg-[#141414]">
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
          <span class="text-center text-xl">{{ collapse[0].title }}</span>
        </template>
        <el-divider />
        <div class="flex">

        </div>
      </el-collapse-item>
      <el-collapse-item :name="collapse[1].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[1].icon" link />
          <span class="text-center text-xl">{{ collapse[1].title }}</span>
        </template>
        <el-divider content-position="left">{{ t('formDemo.ListOfProductsForSale') }}</el-divider>
        <!-- <el-table
          :data="ListOfProductsForSale"
          border
          :class="[
            'bg-[var(--el-color-white)] dark:(text-white-800) border-[var(--el-border-color)] border-1px)'
          ]"
        >
          <el-table-column
            :label="t('formDemo.productManagementCode')"
            min-width="200"
            prop="productPropertyId"
          >
            <template #default="props">
              <MultipleOptionsBox
                :fields="[
                  t('reuse.productCode'),
                  t('reuse.managementCode'),
                  t('formDemo.productInformation')
                ]"
                filterable
                :disabled="disabledEdit"
                :items="listProductsTable"
                valueKey="productPropertyId"
                labelKey="productCode"
                :hiddenKey="['id']"
                :placeHolder="'Chọn mã sản phẩm'"
                :defaultValue="props.row.productPropertyId"
                @scroll-top="ScrollProductTop"
                @scroll-bottom="ScrollProductBottom"
                :clearable="false"
                @update-value="(value, obj) => getValueOfSelected(value, obj, props)"
                ><template #underButton>
                  <div class="sticky z-999 bottom-0 bg-white dark:bg-black h-10">
                    <div class="block h-1 w-[100%] border-top-1 pb-2"></div>
                    <div
                      class="text-base text-blue-400 cursor-pointer pl-2"
                      @click="
                        () => {
                          addnewproduct()
                          getBrandSelectOptions()
                          getUnitSelectOptions()
                          getOriginSelectOptions()
                          getCategory()
                        }
                      "
                      >+ {{ t('formDemo.quicklyAddProducts') }}</div
                    >
                  </div>
                </template></MultipleOptionsBox
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="productName"
            :label="t('formDemo.productInformation')"
            min-width="620"
          />
          <el-table-column prop="accessory" :label="t('reuse.accessory')" width="180">
            <template #default="data">
              <el-input
                :disabled="disabledEdit"
                v-model="data.row.accessory"
                :placeholder="`/${t('formDemo.selfImportAccessories')}/`"
              />
            </template>
          </el-table-column>
          <el-table-column prop="quantity" :label="t('formDemo.amount')" align="center" width="90">
            <template #default="props">
              <div v-if="type == 'detail'">
                {{ props.row.quantity }}
              </div>
              <el-input
                v-else
                :disabled="disabledEdit"
                v-model="props.row.quantity"
                @change="(data) => handleGetTotal(data, props)"
                style="width: 100%"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="unitName"
            :label="t('reuse.dram')"
            align="center"
            min-width="100"
          />
          <el-table-column prop="unitPrice" :label="t('reuse.unitPrice')" align="right" width="180">
            <template #default="props">
              <CurrencyInputComponent
                v-model="props.row.unitPrice"
                :disabled="disabledEdit"
                v-if="type != 'detail'"
                @change="
                  () => {
                    changePriceRowTable(props, false)
                    autoCalculateOrder()
                  }
                "
              />
              <div v-else>{{
                props.row.unitPrice != ''
                  ? changeMoney.format(parseInt(props.row.unitPrice))
                  : '0 đ'
              }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="totalPrice"
            :label="t('formDemo.intoMoney')"
            align="right"
            width="180"
          >
            <template #default="props">
              {{ changeMoney.format(props.row.totalPrice) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="warehouseTotal"
            :label="t('formDemo.exportWarehouse')"
            min-width="200"
          >
            <template #default="props">
              <div class="flex w-[100%] items-center">
                <el-button
                  text
                  :disabled="disabledEdit"
                  @click="
                    () => {
                      callApiWarehouse(props)
                      openDialogChooseWarehouse = true
                    }
                  "
                >
                  <span v-if="props.row.warehouseTotal != 0" class="text-blue-500">{{
                    props.row.warehouseTotal
                  }}</span>
                  <span v-else class="text-yellow-500">Hết hàng</span>
                </el-button>
              </div>
            </template>
          </el-table-column>

          <el-table-column :label="t('formDemo.manipulation')" align="center" min-width="90">
            <template #default="scope">
              <el-button
                :disabled="disabledDeleteRow"
                @click.prevent="removeListProductsSale(scope.$index)"
                type="danger"
                >{{ t('reuse.delete') }}</el-button
              >
            </template>
          </el-table-column>
        </el-table> -->
        <!-- <el-button class="ml-4 mt-4" v-if="type == 'add' || type == ':type'" @click="addLastIndexSellTable"
          >+ {{ t('formDemo.add') }}</el-button
        > -->

      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style></style> -->
