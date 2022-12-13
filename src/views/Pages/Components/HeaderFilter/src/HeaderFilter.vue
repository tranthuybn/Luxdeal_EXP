<script setup lang="ts">
import {
  ElCol,
  ElRow,
  ElButton,
  ElFormItem,
  ElForm,
  FormInstance,
  ElInput,
  ElMessage
} from 'element-plus'
import { reactive, ref, unref } from 'vue'
import moment from 'moment'
import { IDatePickerType } from 'element-plus/lib/components/date-picker/src/date-picker.type'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { Form, FormExpose } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { useValidator } from '@/hooks/web/useValidator'

const { ValidService } = useValidator()
// declare variables
const emit = defineEmits(['refreshData', 'getData'])
const dateFilterFormRefer = ref<FormExpose>()
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
const checkStartDate = (_, endDate: any, __callback: Callback) => {
  const elFormRef = unref(dateFilterFormRefer)?.getElFormRef()
  getFormData().then((res) => {
    res?.startDate && moment(endDate).isBefore(res?.startDate)
      ? elFormRef?.validateField('startDate', () => null)
      : elFormRef?.validateField('startDate', () => null)
  })
  disableChooseDate.value = true
}
const checkEndDate = (_, startDate: any, callback: Callback) => {
  getFormData().then((res) =>
    res?.endDate && moment(res?.endDate).isBefore(startDate)
      ? callback(new Error(t('reuse.warningDate')))
      : callback()
  )
  disableChooseDate.value = true
}
const disableChooseDate = ref(false)
const forceDisable = ref(true)
// form data
const schema = reactive<FormSchema[]>([
  {
    field: 'startDate',
    component: 'DatePicker',
    value: '',
    colProps: { md: 12, xs: 24 },
    componentProps: {
      editable: false,
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
      editable: false,
      placeholder: t('reuse.endDate'),
      format: dateTimeFormat,
      valueFormat: valueDateFormat,
      type: dateFormType,
      disabled: dateTimeDisable
    }
  }
])
const rule = reactive({
  startDate: [{ validator: checkEndDate, trigger: 'change' }],
  endDate: [{ validator: checkStartDate, trigger: 'change' }]
})

const reloadIcon = useIcon({ icon: 'uiw:reload' })
const verifyReset = () => {
  const elFormRef = unref(dateFilterFormRefer)?.getElFormRef()
  elFormRef?.resetFields()
}

async function reLoadEvent() {
  const dateFormData = await getFormData()
  if (
    validateHeaderInput.searchingKey == '' &&
    dateFormData?.startDate == '' &&
    dateFormData?.endDate == ''
  ) {
    return
  }
  verifyReset()
  validateHeaderInput.searchingKey = ''
  periodSelected.value = ''
  dateTimeDisable.value = false
  disableChooseDate.value = false
  forceDisable.value = true
  emit('refreshData', { Keyword: null, startDate: null, endDate: null })
}
async function getDataEvent() {
  //if there is value it will validate and return value, if not valid == null
  let inputValid: any = null
  let noSearchingKey = false
  if (validateHeaderInput.searchingKey !== '') {
    const formEl = unref(formRef)
    await formEl?.validate((valid) => {
      if (valid) {
        inputValid = true
      } else {
        inputValid = false
      }
    })
  } else {
    noSearchingKey = true
  }
  let dateValid: any = null
  const dateFormData = await getFormData()
  if (dateFormData?.startDate !== '' || dateFormData?.endDate !== '') {
    const elFormRef = unref(dateFilterFormRefer)?.getElFormRef()
    await elFormRef?.validate((valid) => {
      if (valid) {
        dateValid = true
      } else {
        dateValid = false
      }
    })
  } else {
    noSearchingKey = true
  }

  if (noSearchingKey) {
    ElMessage(t('reuse.enterSearchingData'))
    return
  }
  //if not false then run ( false when there is a value and is inValid)
  if (inputValid !== false && dateValid !== false) {
    dateTimeDisable.value = false
    disableChooseDate.value = false
    forceDisable.value = true
    getFormData()
      .then((res) => {
        res?.endDate
          ? (res['endDate'] = moment(res?.endDate)
              .set('hour', 23)
              .set('minute', 59)
              .set('second', 59)
              .format('YYYY-MM-DD HH:mm:ss'))
          : ''
        emit('getData', { ...res, Keyword: validateHeaderInput.searchingKey })
      })
      .catch((error) => {
        console.error(error)
      })
  }
}

//validate input header
const validateHeaderInput = reactive({ searchingKey: '' })
const formRef = ref<FormInstance>()
</script>
<template>
  <section>
    <el-row justify="space-between" :gutter="20">
      <el-col :xl="6" :lg="4" :xs="12" class="<xl:mb-2">
        <slot name="headerFilterSlot"></slot>
      </el-col>
      <el-col :xl="5" :lg="4" :xs="12" class="<xl:mb-2">
        <ElForm ref="formRef" :model="validateHeaderInput">
          <ElFormItem
            prop="searchingKey"
            :rules="[
              { validator: ValidService.checkEmojiValidator.validator },
              { validator: ValidService.checkNameLength.validator }
            ]"
          >
            <ElInput
              clearable
              class="w-full"
              v-model="validateHeaderInput.searchingKey"
              :placeholder="t('reuse.enterKeyWords')"
              @keydown.enter.prevent="getDataEvent"
            />
          </ElFormItem>
        </ElForm>
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
      <el-col :xl="3" :lg="5" :xs="12" class="inline-flex <xl:mb-2">
        <el-button type="primary" @click="reLoadEvent()" :icon="reloadIcon" />
        <el-button type="primary" @click="getDataEvent()">{{ t('reuse.getData') }}</el-button>
      </el-col>
    </el-row>
  </section>
</template>
