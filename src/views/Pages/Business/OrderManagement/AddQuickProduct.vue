<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import {
  ElDialog,
  ElNotification 
} from 'element-plus'
import { createQuickProduct } from '@/api/Business'
import { useValidator } from '@/hooks/web/useValidator'
import {  getBusinessProductLibrary } from '@/api/LibraryAndSetting'
import TableOperatorTreeSelect from '@/views/Pages/ProductsAndServices/ProductLibrary/TableOperatorTreeSelect.vue'

const doCloseOnClickModal = ref(false)
const { t } = useI18n()
const apiStatus = ref(true)
const emit = defineEmits(['save', 'update:modelValue'])
const { required, ValidService, notSpace } = useValidator()
const props = defineProps({
  modelValue:{
    type: Boolean,
    required: true,
    default: false
  }
})
const schema = reactive<FormSchema[]>([
  {
    field: 'Divider02',
    label: t('reuse.generalProductInformation'),
    component: 'Divider'
  },
  {
    field: 'ProductCode',
    label: t('reuse.productCode'),
    component: 'Select',
    componentProps: {
      placeholder: t('reuse.enterProductCode'),
      style: 'width: 100%',
      loading: true,
      allowCreate: true,
      filterable: true,
      options: []
    },
    colProps: {
      span: 24
    },
    formItemProps: {
      style: { height: '55px' }
    }
  },
  {
    field: 'Name',
    label: t('reuse.productName'),
    component: 'Select',
    componentProps: {
      placeholder: t('reuse.enterProductName'),
      style: 'width: 100%',
      loading: true,
      allowCreate: true,
      filterable: true,
      options: []
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'ShortDescription',
    label: t('reuse.shortDescription'),
    component: 'Input',
    componentProps: {
      placeholder: t('reuse.under256Characters')
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'productCharacteristics',
    label: t('formDemo.productCharacteristics'),
    component: 'Select',
    componentProps: {
      placeholder: t('formDemo.selectFeature')
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'Divider',
    label: t('router.productCategoryProducts'),
    component: 'Divider'
  },
  {
    field: 'ProductTypeId',
    label: t('reuse.selectCategory'),
    colProps: {
      span: 24
    }
  },
  {
    field: 'BrandId',
    label: t('router.productCategoryBrand'),
    component: 'Select',
    componentProps: {
      placeholder: t('reuse.chooseBrand'),
      style: 'width: 100%',
      options: []
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'UnitId',
    label: t('router.productCategoryUnit'),
    component: 'Select',
    componentProps: {
      style: 'width: 100%',
      placeholder: t('reuse.chooseUnit'),
      options: []
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'OriginId',
    label: t('router.productCategoryOrigin'),
    component: 'Select',
    componentProps: {
      placeholder: t('reuse.chooseOrigin'),
      style: 'width: 100%',
      options: []
    },
    colProps: {
      span: 24
    }
  },
])
const close = () =>{
  emit('update:modelValue', false)
}

const rules = reactive({
  ProductTypeId: [required()],
  BrandId: [required()],
  UnitId: [required()],
  OriginId: [required()],
  ProductCode: [
    required(),
    { validator: notSpace },
    { validator: ValidService.checkCodeServiceLength.validator }
  ],
  Name: [
    required(),
    { validator: ValidService.checkNameLength.validator },
    { validator: ValidService.checkSpaceBeforeAndAfter.validator }
  ],
  ShortDescription: [
    { validator: ValidService.checkNameLength.validator },
    { validator: ValidService.checkSpaceBeforeAndAfter.validator }
  ],
  productCharacteristics: [
    required()
  ]
})

const postData = async (data) => {
    const payload = {
      productId: data.ProductTypeId.id,
      productCode: data.ProductCode,
      productPropertyCode: data.quickManagementCode,
      name: data.Name,
      shortDescription: data.ShortDescription,
      productTypeId: data.ProductTypeId.id,
      brandId: data.BrandId,
      originId: data.UnitId,
      unitId: data.OriginId,
      categories: data.productCharacteristics,
    }
    await createQuickProduct(JSON.stringify(payload))
    .then((res)=>{
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      })
      emit('save', payload, res.data.id)  
    })
    .catch((error)=>{
        ElNotification({
            message: error.response.data.message ?? t('reuse.addFail'),
            type: 'warning'
        })
    })
   close()
}

</script>
<template>
    <el-dialog
        :close-on-click-modal="doCloseOnClickModal"
        :modelValue="props.modelValue"
        :title="t('formDemo.quicklyAddProducts')"
        width="40%"
        align-center
        @close="close"
    >
      <TableOperatorTreeSelect
        class="infinite-list"
        style="overflow: auto"
        type="add"
        :apiId="getBusinessProductLibrary"
        :schema="schema"
        :hasImage="false"
        @post-data="postData"
        :showButton="false"
        :rules="rules"
        :class="[
          'bg-[var(--el-color-white)] dark:(bg-[var(--el-color-black)] border-[var(--el-border-color)] border-1px)'
        ]"
        :apiStatus="apiStatus"
        :addQuickProduct="true"
        :close="close"
      />
    </el-dialog>
</template>

<style lange="less" scoped>
  ::v-deep(.btn-wrap) {
    margin-left: 540px;
  }
</style>
