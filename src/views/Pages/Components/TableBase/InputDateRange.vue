<script lang="ts" setup>
import { ElPopover, ElButton, ElDivider } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { reactive, ref, unref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { dateTimeFormat, valueDateFormat } from '@/utils/format'
import { Form, FormExpose } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { useValidator } from '@/hooks/web/useValidator'
const { required } = useValidator()
const { t } = useI18n()
const ArrowDown = useIcon({ icon: 'ic:sharp-keyboard-arrow-down' })
// eslint-disable-next-line vue/require-prop-types
const props = defineProps(['field'])
const propField = ref(props.field)
const emit = defineEmits(['confirm'])
const { register, methods } = useForm()
const { getFormData } = methods
const dateFilterFormRefer = ref<FormExpose>()
const schema = reactive<FormSchema[]>([
  {
    field: propField,
    component: 'DatePicker',
    value: '',
    colProps: {
      span: 24
    },
    formItemProps: {
      rules: [required()]
    },
    componentProps: {
      type: 'daterange',
      rangeSeparator: t('reuse.to'),
      startPlaceholder: t('reuse.placeholderDate'),
      endPlaceholder: t('reuse.placeholderDate'),
      unlinkPanels: true,
      format: dateTimeFormat,
      valueFormat: valueDateFormat
    }
  }
])
async function confirm() {
  const elFormRef = unref(dateFilterFormRefer)?.getElFormRef()
  elFormRef?.validate((valid) => {
    if (valid) {
      getFormData()
        .then((res) => {
          emit('confirm', res)
        })
        .catch(() => {
          console.error('have some issues while emitting')
        })
    }
  })
}
const cancel = () => {
  const elFormRef = unref(dateFilterFormRefer)?.getElFormRef()
  elFormRef?.resetFields()
}
</script>
<template>
  <el-popover placement="bottom" width="fit-content" trigger="click">
    <template #reference>
      <span>
        <el-button :icon="ArrowDown" text style="padding: 0" />
      </span>
    </template>
    <Form :schema="schema" ref="dateFilterFormRefer" @register="register" />
    <el-divider />
    <div class="flexButton">
      <el-button @click="confirm" type="primary">{{ t('reuse.confirm') }}</el-button>
      <el-button @click="cancel">{{ t('reuse.cancel') }}</el-button>
    </div>
  </el-popover>
</template>
<style scoped>
.flexButton {
  display: flex;
  justify-content: center;
}
</style>
