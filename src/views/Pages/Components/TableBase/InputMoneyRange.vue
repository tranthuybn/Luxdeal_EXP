<script lang="ts" setup>
import { ElPopover, ElButton, ElInput, ElDivider, ElForm, ElFormItem } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { formatMoneyInput, parseMoneyInput } from '@/utils/format'
const { t } = useI18n()
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({ inputFrom: '', inputTo: '' })
// eslint-disable-next-line vue/require-prop-types
const props = defineProps(['field'])
const field = ref(props.field)
const emit = defineEmits(['confirm'])
const confirm = () => {
  var arrValue = [ruleForm.inputFrom, ruleForm.inputTo]
  const objValue = {}
  objValue[field.value] = arrValue
  console.log(objValue[field.value])
  emit('confirm', objValue)
}
const cancel = () => {
  ruleForm.inputFrom = ruleForm.inputTo = ''
}
const rules = reactive<FormRules>({
  inputFrom: [{ required: true, message: t('reuse.warningMoney'), trigger: 'blur' }],
  inputTo: [{ required: true, message: t('reuse.warningMoney'), trigger: 'blur' }]
})
</script>
<template>
  <el-popover placement="bottom" trigger="click" width="fit-content">
    <template #reference>
      <el-button :icon="ArrowDown" text />
    </template>
    <ElForm ref="ruleFormRef" :model="ruleForm" :rules="rules">
      <el-form-item :label="t('reuse.from')" prop="inputFrom">
        <el-input
          v-model="ruleForm.inputFrom"
          :placeholder="t('reuse.placeholderMoney')"
          :formatter="(value) => formatMoneyInput(value)"
          :parser="(value) => parseMoneyInput(value)"
          ><template #suffix> đ</template>
        </el-input>
      </el-form-item>
      <el-form-item :label="t('reuse.to')" prop="inputTo">
        <el-input
          v-model="ruleForm.inputTo"
          :placeholder="t('reuse.placeholderMoney')"
          :formatter="(value) => formatMoneyInput(value)"
          :parser="(value) => parseMoneyInput(value)"
          ><template #suffix> đ</template>
        </el-input>
      </el-form-item>
    </ElForm>
    <el-divider />
    <el-button @click="confirm">{{ t('reuse.confirm') }}</el-button>
    <el-button @click="cancel">{{ t('reuse.cancel') }}</el-button>
  </el-popover>
</template>
