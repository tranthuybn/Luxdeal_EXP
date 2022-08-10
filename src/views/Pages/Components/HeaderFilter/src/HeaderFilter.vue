<script setup lang="ts">
import { ElInput, ElSelect, ElOption, ElCol, ElRow, ElButton } from 'element-plus'
import { reactive, ref, unref } from 'vue'
import moment from 'moment'
import { IDatePickerType } from 'element-plus/lib/components/date-picker/src/date-picker.type'
import { useIcon } from '@/hooks/web/useIcon'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { Form, FormExpose } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { Icon } from '@/components/Icon'

// declare variables
const emit = defineEmits(['refreshData', 'getData'])
const dateFilterFormRefer = ref<FormExpose>()
type momentDateType = Date | moment.Moment | null
const searchingKey = ref<string>('')
const periodSelected = ref<string>('')
// disable when selection have value
let dateTimeDisable = ref<boolean>(false)
let dateFormType = ref<IDatePickerType>('date')
const { required } = useValidator()
const { t } = useI18n()

const rules = {
  startDate: [required()],
  endDate: [required()]
}
const dateTimeFormat = ref<string>('DD/MM/YYYY')
const valueFormat = ref<string>('YYYY-MM-DD')

const schema = reactive<FormSchema[]>([
  {
    field: 'startDate',
    component: 'DatePicker',
    value: null,
    componentProps: {
      placeholder: t('reuse.startDate'),
      format: dateTimeFormat,
      valueFormat: valueFormat,
      type: dateFormType,
      disabled: dateTimeDisable
    }
  },
  {
    field: 'endDate',
    component: 'DatePicker',
    value: null,
    componentProps: {
      placeholder: t('reuse.endDate'),
      format: dateTimeFormat,
      valueFormat: valueFormat,
      type: dateFormType,
      disabled: dateTimeDisable
    }
  }
])
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
    ;(dateFormType.value = 'date'), verifyReset()
  }
}
const verifyReset = () => {
  const elFormRef = unref(dateFilterFormRefer)?.getElFormRef()
  elFormRef?.resetFields()
}
const setStartDateAndEndDate = (start: momentDateType, end: momentDateType) => {
  unref(dateFilterFormRefer)?.setValues({
    startDate: moment(start).format('YYYY-MM-DD HH:mm:ss') ?? null,
    endDate: moment(end).format('YYYY-MM-DD HH:mm:ss') ?? null
  })
}
function reLoadEvent() {
  searchingKey.value = ''
  verifyReset()
  emit('refreshData')
}
const formValidation = () => {
  const elFormRef = unref(dateFilterFormRefer)?.getElFormRef()
  elFormRef?.validate()?.catch(() => {})
}

async function getDataEvent() {
  formValidation()
  const { getFormData } = methods
  const formData = await getFormData()
  emit('getData', formData, searchingKey.value)
}

const { register, methods } = useForm()
</script>
<template>
  <section>
    <el-row justify="space-between" :gutter="20">
      <el-col :xl="6" :lg="4" :xs="12" class="<xl:mb-2">
        <slot name="headerFilterSlot"></slot>
      </el-col>
      <el-col :xl="5" :lg="4" :xs="12" class="<xl:mb-2">
        <el-input class="w-full" v-model="searchingKey" :placeholder="t('reuse.enterKeyWords')" />
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
        <Form :schema="schema" :rules="rules" ref="dateFilterFormRefer" @register="register" />
      </el-col>
      <el-col :xl="3" :lg="5" :xs="12" class="inline-flex <xl:mb-2">
        <el-button type="primary" @click="reLoadEvent()" :icon="reloadIcon" />
        <el-button type="primary" @click="getDataEvent()">{{ t('reuse.getData') }}</el-button>
      </el-col>
    </el-row>
    <el-row class="mb-2">
      <el-col :xl="8" :lg="12" :xs="24">
        <div class="extension-function">
          <p>
            <span>{{ t('reuse.choose') }}</span>
            <span> (0,0) </span>
          </p>
          <p
            ><span>{{ t('reuse.exportExcel') }}</span
            ><span>
              <Icon
                icon="file-icons:microsoft-excel"
                size="{16}"
                color="var(--el-color-primary)"
                class="ml-2px relative top-1px"
              />
            </span>
          </p>
          <p>
            <span>{{ t('reuse.duplicate') }}</span>
            <span>
              <Icon
                icon="ion:duplicate"
                size="{16}"
                color="var(--el-color-primary)"
                class="ml-2px relative top-1px"
              />
            </span>
          </p>
          <p>
            <span>{{ t('reuse.delete') }}</span>
            <span>
              <Icon
                icon="fluent:delete-12-regular"
                size="{16}"
                color="var(--el-color-primary)"
                class="ml-2px relative top-1px"
              />
            </span>
          </p>
        </div>
      </el-col>
    </el-row>
  </section>
</template>
<style lang="scss" scoped>
@mixin d-flex {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.extension-function {
  @include d-flex;
  p {
    border-bottom: 2px solid var(--app-contnet-bg-color);
    @include d-flex;
    box-sizing: border-box;
    cursor: pointer;
    width: max-content;
    span {
      width: fit-content;
      font-weight: 500;
    }
    &:hover {
      border-bottom: 2px solid var(--el-color-primary);
    }
  }
}
</style>
