<script setup lang="ts">
import {
  ElInput,
  ElSelect,
  ElOption,
  ElCol,
  ElRow,
  ElFormItem,
  ElForm,
  ElButton,
  ElDatePicker,
  FormRules,
  FormInstance
} from 'element-plus'
import { reactive, ref } from 'vue'
import moment from 'moment'
import { IDatePickerType } from 'element-plus/lib/components/date-picker/src/date-picker.type'
import { useIcon } from '@/hooks/web/useIcon'

const emit = defineEmits(['refreshData', 'getData'])
const dateFilterFormRule = reactive<FormRules>({})
const dateFilterFormRefer = ref<FormInstance>()
type momentDateType = Date | moment.Moment | null
const searchingKey = ref<string>('')
const periodSelected = ref<string>('')
let dateTimeDisable = ref<boolean>(false)
let dateFormType = ref<IDatePickerType>('date')

const dateFilterForm = reactive({
  selectedFromDay: '',
  selectedToDay: ''
})
const dateTimeFormat = ref<string>('dd/MM/yyyy')
const valueFormat = ref<string>('yyyy-MM-dd')
const periodFilter = reactive([
  { value: '1', label: 'Hôm nay' },
  { value: '2', label: 'Tháng này' },
  { value: '3', label: 'Hôm qua' },
  { value: '4', label: 'Tuần này' },
  { value: '5', label: 'Quý này' },
  { value: '6', label: 'Năm nay' },
  { value: '7', label: 'Năm trước' }
])

const reloadIcon = useIcon({ icon: 'uiw:reload' })
const filterIcon = useIcon({ icon: 'akar-icons:filter' })
function periodChange(val): void {
  dateTimeDisable.value = !!val
  if (val) {
    let start: momentDateType = null
    let end: momentDateType = null
    switch (val) {
      case '1':
        dateFormType.value = 'datetime'
        start = moment().set('hour', 0).set('minute', 0).set('second', 0)
        end = moment().set('hour', 21).set('minute', 59).set('second', 59)
        break
      case '2':
        dateFormType.value = 'date'
        start = moment([new Date().getFullYear(), new Date().getMonth()]).toDate()
        end = moment().endOf('month').toDate()
        break
      case '3':
        dateFormType.value = 'datetime'
        start = moment().subtract(1, 'days').set('hour', 0).set('minute', 0).set('second', 0)
        end = moment().subtract(1, 'days').set('hour', 21).set('minute', 59).set('second', 59)
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
    dateFormType.value = 'date'
    dateFilterForm.selectedFromDay = ''
    dateFilterForm.selectedToDay = ''
  }
}
function setStartDateAndEndDate(start: momentDateType, end: momentDateType): void {
  dateFilterForm.selectedFromDay = moment(start).format('YYYY-MM-DD HH:mm:ss') ?? null
  dateFilterForm.selectedToDay = moment(end).format('YYYY-MM-DD HH:mm:ss') ?? null
}

function reLoadEvent(formEL: FormInstance | undefined) {
  if (!formEL) return
  formEL.resetFields()
  periodSelected.value = ''
  searchingKey.value = ''
  emit('refreshData')
}
async function getDataEvent(formEL: FormInstance | undefined) {
  if (!formEL) return
  await formEL.validate((valid, fields) => {
    if (valid) {
      emit('getData', dateFilterForm, searchingKey.value)
    } else {
      console.error('error submit!', fields)
    }
  })
}
</script>
<template>
  <el-row justify="space-between" :gutter="20">
    <el-col :span="4"> <slot name="headerFilterSlot"></slot> </el-col>
    <el-col :span="3">
      <el-input class="w-full" v-model="searchingKey" placeholder="Nhập từ khoá ..." />
    </el-col>
    <el-col :span="3">
      <el-select
        v-model="periodSelected"
        placeholder="Khoảng thời gian"
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
    <el-col :span="8">
      <el-form
        :model="dateFilterForm"
        :rules="dateFilterFormRule"
        class="inline-flex w-full"
        ref="dateFilterFormRefer"
      >
        <el-form-item prop="selectedFromDay" class="w-full">
          <el-date-picker
            placeholder="Từ ngày"
            :format="dateTimeFormat"
            v-model="dateFilterForm.selectedFromDay"
            :value-format="valueFormat"
            :disabled="dateTimeDisable"
            :type="dateFormType"
            class="w-full"
          />
        </el-form-item>
        <el-form-item prop="selectedToDay" class="w-full">
          <el-date-picker
            placeholder="Đến ngày"
            :format="dateTimeFormat"
            v-model="dateFilterForm.selectedToDay"
            :value-format="valueFormat"
            :disabled="dateTimeDisable"
            :type="dateFormType"
            class="w-full"
          />
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="3" class="flex-grow justify-center">
      <el-button :icon="filterIcon">Bộ lọc mở rộng</el-button>
    </el-col>
    <el-col :span="1" class="flex-grow justify-center">
      <el-button type="primary" @click="reLoadEvent(dateFilterFormRefer)" :icon="reloadIcon" />
    </el-col>
    <el-col :span="2" class="flex-grow justify-center">
      <el-button type="primary" @click="getDataEvent(dateFilterFormRefer)">Lấy dữ liệu</el-button>
    </el-col>
  </el-row>
</template>
