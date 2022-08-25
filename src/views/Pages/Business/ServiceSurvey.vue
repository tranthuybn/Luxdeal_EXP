<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../Components/tableType01-datetimefilter-basic.vue'
import { getServiceSurveyList } from '@/api/Business'

const { t } = useI18n()
const columns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'orderCode',
    label: t('reuse.orderCode'),
    minWidth: '150'
  },
  {
    field: 'service',
    label: t('reuse.service'),
    minWidth: '150'
  },

  {
    field: 'customerName',
    label: t('reuse.customerName'),
    minWidth: '150'
  },

  {
    field: 'serviceRating',
    label: t('reuse.serviceRating'),
    minWidth: '130'
  },
  {
    field: 'surveyContent',
    label: t('reuse.surveyContent'),
    minWidth: '200'
  },
  {
    field: 'picture',
    label: t('reuse.picture'),
    minWidth: '150'
  },
  {
    field: 'surveyDate',
    label: t('reuse.surveyDate'),
    minWidth: '150'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150'
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue :columns="columns" :api="getServiceSurveyList" />
</template>
