<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import {
  ElSelect,
  ElOption,
  ElButton,
  ElDivider,
  ElInput,
  ElDialog,
  ElForm,
  ElFormItem,
  ElTreeSelect,
ElNotification} from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { originSelect, unitSelect, brandSelect, optionsCategory} from '@/views/Pages/ProductsAndServices/ProductLibrary/ProductLibraryManagement'
import { createQuickProduct, getCheckProduct, getproductId } from '@/api/Business'
import ProductAttribute from '../../ProductsAndServices/ProductLibrary/ProductAttribute.vue'
import { useValidator } from '@/hooks/web/useValidator'
import { GenerateCodeOrder } from '@/api/common'


const { t } = useI18n()

const props = defineProps({
  listProducts: {
    type: Array<ListProduct>,
    required: true
  },
  modelValue:{
    type: Boolean,
    required: true,
    default: false
  }
})
const emit = defineEmits(['save', 'update:modelValue'])
type ListProduct = {
  productCode: string,//product.code,
  value: string,//product.productCode,
  name: string,// product.name ?? '',
  unit: string,//product.unitName,
  price: string,//product.price.toString(),
  productPropertyId: number,//product.id,
  productPropertyCode: string,//product.productPropertyCode
}

const ruleFormRef = ref<FormInstance>()
const ruleForm = ref({
  productId: null,
  quickProductCode: '',
  quickManagementCode: '',
  quickProductName: '',
  quickDescription: '',
  chooseCategory: '',
  chooseBrand: '',
  chooseOrigin: '',
  chooseUnit: '',
  productCharacteristics: ''
})
const {requiredOption, requiredCategory } = useValidator()
const rules = reactive<FormRules>({
  quickProductCode: [requiredOption()],
  quickManagementCode: [requiredOption()],
  quickProductName: [requiredOption()],
  quickDescription: [requiredOption()],
  chooseCategory: [requiredOption()],
  chooseBrand: [requiredOption()],
  chooseOrigin: [requiredOption()],
  chooseUnit: [requiredOption()],
  productCharacteristics: [requiredOption(),{ validator: requiredCategory }]
})
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      postQuickProduct()
    }
  })
}
const postQuickProduct = async () => {
  const codeProduct = props.listProducts?.find(product=>product.productPropertyId == Number(ruleForm.value.quickProductCode))
  const payload = {
    productId: ruleForm.value.productId,
    productCode: codeProduct ? codeProduct.value :ruleForm.value.quickProductCode,
    productPropertyCode: ruleForm.value.quickManagementCode,
    name: ruleForm.value.quickProductName,
    shortDescription: ruleForm.value.quickDescription,
    productTypeId: ruleForm.value.chooseCategory,
    brandId: ruleForm.value.chooseBrand,
    originId: ruleForm.value.chooseOrigin,
    unitId: ruleForm.value.chooseUnit,
    categories: ruleForm.value.productCharacteristics,
  }

  const res = await createQuickProduct(payload)
  if (res) {
    ElNotification({
      message: t('reuse.addSuccess'),
      type: 'success'
    })
    emit('save', payload, res.id)    
  } else {
    ElNotification({
      message: t('reuse.addFail'),
      type: 'warning'
    })
  }
  close()
}

const handleChangeQuickAddProduct = async (data) => {
  const dataSelectedObj = props.listProducts.find((product) => product.productPropertyId == data)

  // call API checkProduct
  let codeCheckProduct = ref()
  let checkProductAPI = 0
  if (checkProductAPI == 0) {
    const res = await getCheckProduct({ keyWord: dataSelectedObj!.value })
    codeCheckProduct.value = res.data[0]
  }
  checkProductAPI++

  // call API getProductId
  let formProductData = ref()
  let getProductIdAPI = 0
  if (getProductIdAPI == 0) {
    const res = await getproductId({ Id: codeCheckProduct.value?.id })
    formProductData.value = res.data[0]
  }
  getProductIdAPI++

  // fill data
  ruleForm.value.productId = codeCheckProduct.value?.id
  ruleForm.value.quickProductName = formProductData.value.name
  ruleForm.value.quickDescription = formProductData.value.shortDescription
  ruleForm.value.chooseBrand = formProductData.value.categories[0]?.id
  ruleForm.value.chooseCategory = formProductData.value.categories[1]?.id
  ruleForm.value.chooseUnit = formProductData.value.categories[2]?.id
  ruleForm.value.chooseOrigin = formProductData.value.categories[3]?.id
}
const attributeChange = (attributeArray)=>{
  ruleForm.value.productCharacteristics = attributeArray.map(e=>({
    id:e.value
  }))
}

const close = () =>{
  emit('update:modelValue', false)
}

onMounted(()=>{
  GenerateCodeOrder({CodeType:1,Code:'SP'}).then((res)=>{
    ruleForm.value.quickManagementCode = res.data
  })
})
</script>
<template>
        <!-- Dialog Thêm nhanh sản phẩm -->
        <el-dialog
        :modelValue="modelValue"
        :title="t('formDemo.quicklyAddProducts')"
        width="40%"
        align-center
        @close="close"
      >
      <el-form :model="ruleForm" label-width="150px" ref="ruleFormRef" :rules="rules">
          <el-divider />

          <div class="flex items-center mb-4">
            <span class="w-[25%] text-base font-bold">{{ t('formDemo.productInfomation') }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
            <el-form-item :label="t('reuse.productCode')" prop="quickProductCode">
            <el-select
              filterable
              allow-create
              v-model="ruleForm.quickProductCode"
              :placeholder="t('formDemo.AddSelectProductCode')"
              @change="(data) => handleChangeQuickAddProduct(data)"
            >
              <el-option
                v-for="item in props.listProducts"
                :key="item.productPropertyId"
                :label="item.value"
                :value="item.productPropertyId"
              />
            </el-select>
            </el-form-item>

            <el-form-item :label="t('reuse.managementCode')" prop="quickManagementCode">
            <el-input
              :modelValue="ruleForm.quickManagementCode"
              style="width: 100%"
              :placeholder="t('formDemo.addManagementCode')"
            />
            </el-form-item>

            <el-form-item :label="t('reuse.productName')" prop="quickProductName">
            <el-input
              v-model="ruleForm.quickProductName"
              style="width: 100%"
              :placeholder="t('formDemo.EnterNameDescription')"
            />
            </el-form-item>
            <el-form-item :label=" t('formDemo.shortDescription')" prop="quickDescription">
            <el-input
              v-model="ruleForm.quickDescription"
              style="width: 100%"
              :placeholder="t('formDemo.EnterNameDescription')"
            />
            </el-form-item>
            
            <el-form-item :label="t('formDemo.productCharacteristics')" prop="productCharacteristics">
            <ProductAttribute :value="ruleForm.productCharacteristics" @change-value="attributeChange" class="w-full"/>
            </el-form-item>

          <div class="flex items-center mb-4">
            <span class="w-[25%] text-base font-bold">{{
              t('router.productCategoryProducts')
            }}</span>
            <span class="block h-1 w-[75%] border-t-1 dark:border-[#4c4d4f]"></span>
          </div>
              <el-form-item :label="t('reuse.selectCategory')" prop="chooseCategory">
                  <el-tree-select
                  v-model="ruleForm.chooseCategory"
                  :data="optionsCategory"
                  :placeholder="t('reuse.selectCategory')"
                />
              </el-form-item>
              <el-form-item :label="t('router.productCategoryBrand')" prop="chooseBrand">
              <el-select v-model="ruleForm.chooseBrand" :placeholder="t('reuse.chooseBrand')">
                <el-option
                  v-for="item in brandSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              </el-form-item>
              
              <el-form-item :label="t('router.productCategoryUnit')" prop="chooseUnit">
              <el-select v-model="ruleForm.chooseUnit" :placeholder="t('reuse.chooseUnit')">
                <el-option
                  v-for="item in unitSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              </el-form-item>
              
              <el-form-item :label="t('router.productCategoryOrigin')" prop="chooseOrigin">
              <el-select v-model="ruleForm.chooseOrigin" :placeholder="t('reuse.chooseOrigin')">
                <el-option
                  v-for="item in originSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              </el-form-item>

          </el-form>

        <template #footer>
          <span class="dialog-footer">
            <el-button
              class="btn"
              type="primary"
              @click="submitForm(ruleFormRef)"
              >{{ t('reuse.save') }}</el-button
            >
            <el-button class="btn" @click="close">{{
              t('reuse.exit')
            }}</el-button>
          </span>
        </template>
      </el-dialog>
</template>
