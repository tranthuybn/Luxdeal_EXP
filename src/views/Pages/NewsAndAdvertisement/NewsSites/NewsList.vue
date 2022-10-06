<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import tableDatetimeFilterBasicVue from '../../Components/TableDataBase.vue'
import { getNotificationList } from '@/api/NewsAndAdvertisement'
import { filterSubject, filterSentStatus, filterNotification } from '@/utils/filters'
import { setImageDisplayInDOm } from '@/utils/domUtils'

const { t } = useI18n()
const columns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('reuse.index'),
    type: 'index',
    align: 'center'
  },
  {
    field: 'notificationCode',
    label: t('reuse.notificationCode'),
    minWidth: '150'
  },
  {
    field: 'title',
    label: t('reuse.title'),
    minWidth: '150'
  },
  {
    field: 'shortDescription',
    label: t('reuse.shortDescription'),
    minWidth: '200'
  },
  {
    field: 'notificationType',
    label: t('reuse.notificationType'),
    minWidth: '150',
    filters: filterNotification
  },
  {
    field: 'subject',
    label: t('reuse.subject'),
    minWidth: '150',
    filters: filterSubject
  },
  {
    field: 'image',
    label: t('reuse.image'),
    minWidth: '150',
    align: 'center',
    formatter: (record: Recordable, column: TableColumn, cellValue: TableSlotDefault) =>
      setImageDisplayInDOm(record, column, cellValue)
  },
  {
    field: 'sendDate',
    label: t('reuse.sendDate'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'createDate',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'creator',
    label: t('reuse.creator'),
    minWidth: '150',
    headerFilter: 'Name'
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterSentStatus
  }
])
</script>
<template>
  <tableDatetimeFilterBasicVue :columns="columns" :api="getNotificationList" />
</template>
