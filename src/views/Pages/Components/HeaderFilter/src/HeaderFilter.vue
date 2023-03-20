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
import { reactive, ref, unref, toRefs, watch } from 'vue'
import moment from 'moment'
import { IDatePickerType } from 'element-plus/lib/components/date-picker/src/date-picker.type'
import { useIcon } from '@/hooks/web/useIcon'
import { useI18n } from '@/hooks/web/useI18n'
import { Form, FormExpose } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'

// declare variables
const props = defineProps({removeButtonAdd: {
  type: Boolean,
  default: false
}})
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
}
const checkEndDate = (_, startDate: any, callback: Callback) => {
  getFormData().then((res) =>
    res?.endDate && moment(res?.endDate).isBefore(startDate)
      ? callback(new Error(t('reuse.warningDate')))
      : callback()
  )
}
// Define the disabledDate function for the startDate picker
const disabledStartDate = (date) => {
  const { endDate } = toRefs(state)
  if (endDate.value) {
    return date.getTime() > endDate.value
  } else {
    return date.getTime() > Date.now()
  }
}

// Define the disabledDate function for the endDate picker
const disabledEndDate = (date) => {
  const { startDate } = toRefs(state)
  if (startDate.value) {
    return date.getTime() < startDate.value || date.getTime() > Date.now()
  } else {
    return date.getTime() > Date.now()
  }
}

const state = reactive({
  startDate: 0,
  endDate: 0,
})

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
      disabled: dateTimeDisable,
      disabledDate: disabledStartDate,
      onChange: (date)=>{state.startDate =  moment(date, "YYYY-MM-DD HH:mm:ss").valueOf() }
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
      disabled: dateTimeDisable,
      disabledDate: disabledEndDate,
      onChange: (date)=>{state.endDate =  moment(date, "YYYY-MM-DD HH:mm:ss").valueOf() }
    }
  }
])


watch(
  () => [state.startDate, state.endDate],
  () => {
    if(schema[0].componentProps && schema[1].componentProps) {
      schema[0].componentProps.disabledDate = disabledStartDate
      schema[1].componentProps.disabledDate = disabledEndDate
    }
  }
)

const rule = reactive({
  startDate: [{ validator: checkEndDate }],
  endDate: [{ validator: checkStartDate }]
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
        dateFormType.value = 'datetime'
        start = moment().set('hour', 0).set('minute', 0).set('second', 0)
        end = moment().set('hour', 23).set('minute', 59).set('second', 59)
        break
      case '2':
        dateFormType.value = 'date'
        start = moment([new Date().getFullYear(), new Date().getMonth()]).toDate()
        end = moment().toDate()
        break
      case '3':
        dateFormType.value = 'datetime'
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
}
function reLoadEvent() {
  validateHeaderInput.searchingKey = ''
  periodSelected.value = ''
  state.startDate = 0
  state.endDate = 0
  dateTimeDisable.value = false
  verifyReset()
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
      getFormData()
        .then((res) => {
          res?.endDate
            ? (res['endDate'] = moment(res?.endDate).format('YYYY-MM-DD'))
            : ''
          res?.startDate
          ? (res['startDate'] = moment(res?.endDate).format('YYYY-MM-DD'))
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
    <el-row :class="[props.removeButtonAdd ? 'relative top-8' : '']" justify="space-between" :gutter="20">
      <el-col :xl="6" :lg="4" :xs="12" class="<xl:mb-2">
        <slot name="headerFilterSlot"></slot>
      </el-col>
      <el-col :xl="5" :lg="4" :xs="12" class="<xl:mb-2">
        <ElForm @submit.prevent ref="formRef" :model="validateHeaderInput">
          <ElFormItem prop="searchingKey">
            <ElInput
              clearable
              class="w-full"
              @keyup.enter="getDataEvent"
              v-model="validateHeaderInput.searchingKey"
              :placeholder="t('reuse.enterKeyWords')"
            />
          </ElFormItem>
        </ElForm>
      </el-col>
      <el-col :xl="3" :lg="3" :xs="12" class="<xl:mb-2">
        <el-select
          v-model="periodSelected"
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
