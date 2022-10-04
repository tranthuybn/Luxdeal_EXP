<script setup lang="ts">
import {
  ElSelect,
  ElOption,
  ElCol,
  ElRow,
  ElButton,
  ElFormItem,
  ElForm,
  FormInstance,
  ElInput
} from 'element-plus'
import { reactive, ref, unref } from 'vue'
import moment from 'moment'
import { IDatePickerType } from 'element-plus/lib/components/date-picker/src/date-picker.type'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { Form, FormExpose } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { useValidator } from '@/hooks/web/useValidator'

const { ValidService, required } = useValidator()
// declare variables
const emit = defineEmits(['refreshData', 'getData'])
const dateFilterFormRefer = ref<FormExpose>()
type momentDateType = Date | moment.Moment | null
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
  const elFormRef = unref(dateFilterFormRefer)?.getElFormRef()
  elFormRef?.validateField('startDate', () => null)
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
  startDate: [{ validator: checkEndDate, trigger: 'change' }, required()],
  endDate: [{ validator: checkStartDate, trigger: 'change' }, required()]
})
const periodFilter = reactive([
  { value: '3', label: 'Hôm qua' },
  { value: '1', label: 'Hôm nay' },
  { value: '4', label: 'Tuần này' },
  { value: '2', label: 'Tháng này' },
  { value: '5', label: 'Quý này' },
  { value: '6', label: 'Năm nay' },
  { value: '7', label: 'Năm trước' }
])
const reloadIcon = useIcon({ icon: 'uiw:reload' })
function periodChange(val): void {
  dateTimeDisable.value = !!val
  if (val) {
    let start: momentDateType = null
    let end: momentDateType = null
    switch (val) {
      case '1':
        dateFormType.value = 'date'
        start = moment().set('hour', 0).set('minute', 0).set('second', 0)
        end = moment().set('hour', 23).set('minute', 59).set('second', 59)
        break
      case '2':
        dateFormType.value = 'date'
        start = moment([new Date().getFullYear(), new Date().getMonth()]).toDate()
        end = moment().endOf('month').toDate()
        break
      case '3':
        dateFormType.value = 'date'
        start = moment().subtract(1, 'days').set('hour', 0).set('minute', 0).set('second', 0)
        end = moment().subtract(1, 'days').set('hour', 23).set('minute', 59).set('second', 59)
        break
      case '4':
        dateFormType.value = 'date'
        start = moment().clone().startOf('isoWeek')
        end = moment().clone().endOf('isoWeek')
        break
      case '5':
        dateFormType.value = 'date'
        start = moment().startOf('quarter')
        end = moment().endOf('quarter')
        break
      case '6':
        dateFormType.value = 'date'
        start = moment().startOf('year')
        end = moment().endOf('year')
        break
      case '7':
        dateFormType.value = 'date'
        start = moment().subtract(1, 'years').startOf('year')
        end = moment().subtract(1, 'years').endOf('year')

        break
    }
    setStartDateAndEndDate(start, end)
  } else {
    ;(dateFormType.value = 'date'), verifyReset()
  }
}
const verifyReset = () => {
  const elFormRef = unref(dateFilterFormRefer)?.getElFormRef()
  elFormRef?.resetFields()
}
const setStartDateAndEndDate = (start: momentDateType, end: momentDateType) => {
  unref(dateFilterFormRefer)?.setValues({
    startDate: start ? moment(start).format('YYYY-MM-DD HH:mm:ss') : '',
    endDate: end ? moment(end).format('YYYY-MM-DD HH:mm:ss') : ''
  })
  forceDisable.value = false
}
function reLoadEvent() {
  verifyReset()
  validateHeaderInput.searchingKey = ''
  periodSelected.value = ''
  dateTimeDisable.value = false
  disableChooseDate.value = false
  forceDisable.value = true
  emit('refreshData', { Keyword: null, startDate: null, endDate: null })
}
async function getDataEvent() {
  let inputValid = false

  const formEl = unref(formRef)
  formEl?.validate((valid) => {
    if (valid) {
      inputValid = true
    } else {
      inputValid = false
    }
  })

  const elFormRef = unref(dateFilterFormRefer)?.getElFormRef()
  elFormRef?.validate((valid) => {
    if (valid && inputValid) {
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
  })
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
      <el-col :xl="3" :lg="3" :xs="12" class="<xl:mb-2">
        <el-select
          v-model="periodSelected"
          :disabled="disableChooseDate && forceDisable"
          :placeholder="t('reuse.dateRange')"
          class="w-full"
          clearable
          @change="periodChange"
        >
          <el-option
            v-for="item in periodFilter"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
