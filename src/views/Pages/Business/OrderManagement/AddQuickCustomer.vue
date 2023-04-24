<script setup lang="ts">
import { reactive, ref, unref} from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import {
  ElDialog,
  ElNotification,
  ElButton
} from 'element-plus'
import { addQuickCustomer, getGenCodeCustomers } from '@/api/Business'
import { useValidator } from '@/hooks/web/useValidator'
import { useForm } from '@/hooks/web/useForm'
import { Form } from '@/components/Form'
import { FORM_IMAGES } from '@/utils/format'
import { ContentWrap } from '@/components/ContentWrap'

const { register, elFormRef, methods } = useForm()
const doCloseOnClickModal = ref(false)
const { t } = useI18n()
const emit = defineEmits(['save', 'update:modelValue', 'postSuccess'])
const { required, ValidService } = useValidator()
const loading = ref(false)
const props = defineProps({
  modelValue:{
    type: Boolean,
    required: true,
    default: false
  }
})
const changeValueClassify = (data) => {
    if(!data){
      schema[2].hidden = false
      schema[3].hidden = true
      schema[4].hidden = true
      schema[5].hidden = true
    }else{ 
      schema[2].hidden = true
      schema[3].hidden = false
      schema[4].hidden = false
      schema[5].hidden = false
    }
}

const schema = reactive<FormSchema[]>([
  {
    field: 'classify',
    label: t('formDemo.classify'),
    component: 'Select',
    value: false,
    componentProps: {
        options: [
            {
                value: true,
                label: t('formDemo.company')
            },
            {
                value: false,
                label: t('formDemo.individual')
            }
        ],
        onChange: changeValueClassify
    },
    colProps: {
      span: 13,
    }
  },
  {
    field: 'customerType',
    component: 'Select',
    value: 1,
    componentProps: {
        options: [
            {
                value: 1,
                label: t('formDemo.customer')
            },
            {
                value: 2,
                label: t('reuse.supplier')
            },
            {
                value: 3,
                label: t('formDemo.joint')
            }
        ]
    },
    colProps: {
      span: 11
    }
  },
  {
    field: 'customerName',
    label: t('reuse.customerName'),
    component: 'Input',
    componentProps: {
      placeholder: t('formDemo.enterCustomerName'),
    },
    colProps: {
      span: 24
    },
  },
  {
    field: 'companyName',
    label: t('reuse.companyName'),
    component: 'Input',
    componentProps: {
      placeholder: t('formDemo.enterCompanyName'),
    },
    colProps: {
      span: 24
    },
    hidden: true
  },
  {
    field: 'taxCode',
    label: t('reuse.taxCode'),
    component: 'Input',
    value: '',
    hidden: true,
    componentProps: {
      style: 'width: 100%',
      placeholder: t('formDemo.enterTaxCode')
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'representative',
    label: t('reuse.representative'),
    hidden: true,
    component: 'Input',
    componentProps: {
      placeholder: t('reuse.enterRepresentativeName')
    },
    colProps: {
      span: 24
    }
  },

  {
    field: 'phonenumber',
    label: t('reuse.phoneNumber'),
    component: 'Input',
    componentProps: {
      placeholder: t('reuse.enterPhoneNumber'),
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'email',
    label: t('reuse.email'),
    component: 'Input',
    componentProps: {
      placeholder: t('reuse.enterEmail'),
      style: 'width: 100%'
    },
    colProps: {
      span: 24
    }
  },
])

const close = () =>{
  unref(elFormRef)!.resetFields()
  emit('update:modelValue', false)
  changeValueClassify(false)
}

const rules = reactive({
    classify: [required()],
    taxCode: [required()],
    customerType: [required()],
    customerName:[required()],
    companyName: [required()],
    phonenumber: [required(), ValidService.checkPhone ],
    email: [ValidService.checkEmail]
})
const postData = async (data) => {
    await getGenCodeCustomers({})
    .then((res) => {
      data.customerCode = res.toString()
    })
    .catch((error) => {
     throw Error(error)
    })
    const payload = {
        Code: data.customerCode,
        IsOrganization: data.classify,
        Name: data.classify ? data.companyName : data.customerName,
        TaxCode: data.taxCode,
        Representative: data.representative,
        Phonenumber: data.phonenumber,
        Email: data.email,
        CustomerType: data.customerType
    }
    await addQuickCustomer(FORM_IMAGES(payload))
    .then(()=>{
      ElNotification({
        message: t('reuse.addSuccess'),
        type: 'success'
      })
      emit('postSuccess', true)
      changeValueClassify(false)
    })
    .catch((error)=>{
        ElNotification({
            message: error.response.data.message ?? t('reuse.addFail'),
            type: 'warning'
        })
    })
    .finally(() => {
        close()
    })
}

const save = async () => {
    await unref(elFormRef)!.validate(async (isValid) => {
        if(isValid) {
            const { getFormData } = methods
            await getFormData()
            .then(res => {
                postData(res)
            })
            .catch((error) => { throw Error(error)})
        }
    })
}

</script>
<template>
    <el-dialog
        :close-on-click-modal="doCloseOnClickModal"
        :modelValue="props.modelValue"
        :title="t('formDemo.QuicklyAddCustomers')"
        width="750px"
        align-center
        @close="close"
    >
        <ContentWrap>
            <Form :schema="schema" :rules="rules" @register="register" />
            <template #under>
                <div class="flex justify-right gap-2">
                    <ElButton type="primary" :loading="loading" @click="save">
                    {{ t('reuse.save') }}
                    </ElButton>
                    <ElButton :loading="loading" @click="close">
                    {{ t('reuse.exit') }}
                    </ElButton>
                </div>
            </template>
        </ContentWrap>
    </el-dialog>
</template>

<style lang="less" scoped>
  ::v-deep(.btn-wrap) {
    justify-content: flex-end;
    padding-right: 10px;
    padding-bottom: 0;
  }
  ::v-deep(.el-dialog__header){
    padding-bottom: 15px ;
  }
</style>
