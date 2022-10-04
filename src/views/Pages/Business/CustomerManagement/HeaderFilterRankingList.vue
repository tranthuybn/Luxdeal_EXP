<script setup lang="ts">
import { ElInput, ElCol, ElRow, ElButton, ElFormItem } from 'element-plus'
import { reactive, ref, unref } from 'vue'
import moment from 'moment'
import { IDatePickerType } from 'element-plus/lib/components/date-picker/src/date-picker.type'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { Form, FormExpose } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'

// declare variables
const emit = defineEmits(['refreshData', 'getData'])
const dateFilterFormRefer = ref<FormExpose>()
const searchingKey = ref<string>('')
const periodSelected = ref<string>('')
// disable when selection have value
let dateTimeDisable = ref<boolean>(false)
let dateFormType = ref<IDatePickerType>('date')
const { t } = useI18n()
const dateTimeFormat = ref<string>('DD/MM/YYYY')
const valueDateFormat = ref<string>('YYYY-MM-DD HH:mm:ss')

type Callback = (error?: string | Error | undefined) => void
const { register, methods } = useForm()

const { getFormData } = methods
//validation
const checkStartDate = (_, endDate: any, callback: Callback) => {
  getFormData().then((res) =>
    res?.startDate && moment(endDate).isBefore(res?.startDate)
      ? callback(new Error(t('reuse.warningDate')))
      : callback()
  )
}
const checkEndDate = (_, startDate: any, callback: Callback) => {
  getFormData().then((res) =>
    res?.endDate && moment(res?.endDate).isBefore(startDate)
      ? callback(new Error(t('reuse.warningDate')))
      : callback()
  )
}
// form data
const schema = reactive<FormSchema[]>([
  {
    field: 'startDate',
    component: 'DatePicker',
    value: '',
    colProps: { md: 12, xs: 24 },
    componentProps: {
      placeholder: t('reuse.startDate'),
      format: dateTimeFormat,
      valueFormat: valueDateFormat,
      type: dateFormType,
      disabled: dateTimeDisable
    }
  },
  {
    field: 'endDate',
    component: 'DatePicker',
    value: '',
    colProps: { md: 12, xs: 24 },
    componentProps: {
      placeholder: t('reuse.endDate'),
      format: dateTimeFormat,
      valueFormat: valueDateFormat,
      type: dateFormType,
      disabled: dateTimeDisable
    }
  }
])
const rule = reactive({
  startDate: [{ validator: checkEndDate }],
  endDate: [{ validator: checkStartDate }]
})

const reloadIcon = useIcon({ icon: 'uiw:reload' })

const verifyReset = () => {
  const elFormRef = unref(dateFilterFormRefer)?.getElFormRef()
  elFormRef?.resetFields()
}

function reLoadEvent() {
  searchingKey.value = ''
  periodSelected.value = ''
  dateTimeDisable.value = false
  verifyReset()
  emit('refreshData', { Keyword: null, startDate: null, endDate: null })
}
async function getDataEvent() {
  const elFormRef = unref(dateFilterFormRefer)?.getElFormRef()
  elFormRef?.validate((valid) => {
    if (valid) {
      getFormData()
        .then((res) => {
          emit('getData', { ...res, Keyword: searchingKey.value })
        })
        .catch((error) => {
          console.error(error)
        })
    }
  })
}
</script>
<template>
  <section>
    <el-row justify="space-between" :gutter="20">
      <el-col :xl="6" :lg="4" :xs="12" class="<xl:mb-2">
        <slot name="headerFilterSlot"></slot>
      </el-col>
      <el-col :xl="5" :lg="4" :xs="12" class="<xl:mb-2">
        <ElFormItem>
          <el-input class="w-full" v-model="searchingKey" :placeholder="t('reuse.enterKeyWords')" />
        </ElFormItem>
      </el-col>
      <el-col :xl="7" :lg="8" :xs="24" class="<xl:mb-2">
        <Form
          :rules="rule"
          :schema="schema"
          :label-width="0"
          ref="dateFilterFormRefer"
          @register="register"
        />
      </el-col>
      <el-col :xl="3" :lg="5" :xs="12" class="flex <xl:mb-2">
        <div class="flex">
          <el-button type="primary" @click="getDataEvent()">{{ t('reuse.getData') }}</el-button>
          <el-button type="primary" @click="reLoadEvent()" :icon="reloadIcon" />
        </div>
      </el-col>
    </el-row>
  </section>
</template>
