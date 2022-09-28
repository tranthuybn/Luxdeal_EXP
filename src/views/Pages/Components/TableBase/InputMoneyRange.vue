<script lang="ts" setup>
import { ElPopover, ElButton, ElInput, ElDivider, ElForm, ElFormItem } from 'element-plus'
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { formatMoneyInput, parseMoneyInput } from '@/utils/format'
const { t } = useI18n()
const ArrowDown = useIcon({ icon: 'ic:sharp-keyboard-arrow-down' })
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({ inputFrom: '', inputTo: '' })
// eslint-disable-next-line vue/require-prop-types
const props = defineProps(['field'])
const field = ref(props.field)
const emit = defineEmits(['confirm', 'cancel'])
const confirm2 = () => {
  var arrValue = [ruleForm.inputFrom, ruleForm.inputTo]
  const objValue = {}
  objValue[field.value] = arrValue
  emit('confirm', objValue)
}
const validateFrom = (_rule: any, value: any, callback: any) => {
  value = Number(value.replace(/[^0-9\.-]+/g, ''))
  const valueFrom = Number(ruleForm.inputFrom.replace(/[^0-9\.-]+/g, ''))
  const valueTo = Number(ruleForm.inputTo.replace(/[^0-9\.-]+/g, ''))
  if (value === '') {
    callback(new Error(t('reuse.warningMoney')))
  }
  if (isNaN(value)) {
    callback(new Error(t('reuse.warningInputNumber')))
  }
  if (ruleForm.inputTo !== '' && valueFrom > valueTo) {
    callback(new Error(t('reuse.warningMoneyGreater')))
  }
  callback()
}
const validateTo = (_rule: any, value: any, callback: any) => {
  value = Number(value.replace(/[^0-9\.-]+/g, ''))
  const valueFrom = Number(ruleForm.inputFrom.replace(/[^0-9\.-]+/g, ''))
  const valueTo = Number(ruleForm.inputTo.replace(/[^0-9\.-]+/g, ''))
  if (value === '') {
    callback(new Error(t('reuse.warningMoney')))
  }
  if (isNaN(value)) {
    callback(new Error(t('reuse.warningInputNumber')))
  }
  if (ruleForm.inputFrom !== '' && valueFrom > valueTo) {
    callback(new Error(t('reuse.warningMoneyGreater')))
  }
  callback()
}
const rules = reactive<FormRules>({
  inputFrom: [{ validator: validateFrom, required: true }],
  inputTo: [{ validator: validateTo, required: true }]
})
const filtering = ref(false)
const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      filtering.value = true
      confirm2()
    } else {
      console.error('error submit!', fields)
    }
  })
}

const cancel = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  filtering.value = false
  emit('cancel', field.value)
}
const hide = (formEl: FormInstance | undefined) => {
  if (!filtering.value) {
    formEl?.resetFields()
  }
}
</script>
<template>
  <el-popover placement="bottom" trigger="click" width="fit-content" @hide="hide(ruleFormRef)">
    <template #reference>
      <span>
        <el-button :icon="ArrowDown" text style="padding: 0" />
      </span>
    </template>
    <ElForm ref="ruleFormRef" :model="ruleForm" :rules="rules">
      <el-form-item :label="t('reuse.from')" prop="inputFrom" label-width="50px">
        <el-input
          v-model="ruleForm.inputFrom"
          :placeholder="t('reuse.placeholderMoney')"
          :formatter="(value) => formatMoneyInput(value)"
          :parser="(value) => parseMoneyInput(value)"
          ><template #suffix> {{ t('reuse.currency') }}</template>
        </el-input>
      </el-form-item>
      <el-form-item :label="t('reuse.to')" prop="inputTo" label-width="50px">
        <el-input
          v-model="ruleForm.inputTo"
          :placeholder="t('reuse.placeholderMoney')"
          :formatter="(value) => formatMoneyInput(value)"
          :parser="(value) => parseMoneyInput(value)"
          ><template #suffix> {{ t('reuse.currency') }}</template>
        </el-input>
      </el-form-item>
      <el-divider />
      <div class="flexButton">
        <el-form-item>
          <el-button type="primary" @click="confirm(ruleFormRef)">{{
            t('reuse.confirm')
          }}</el-button>
          <el-button @click="cancel(ruleFormRef)">{{ t('reuse.cancel') }}</el-button>
        </el-form-item></div
      >
    </ElForm>
  </el-popover>
</template>
<style scoped>
.flexButton {
  display: flex;
  justify-content: center;
}
</style>
