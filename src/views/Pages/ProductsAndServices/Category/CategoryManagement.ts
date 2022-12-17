import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
import { filterProductStatus } from '@/utils/filters'
import { productStatusTransferToText, dateTimeFormat, valueDateFormat } from '@/utils/format'
import { h } from 'vue'

import { setImageDisplayInDOm } from '@/utils/domUtils'
export const productCategories = [
  { field: '', width: '50' },
  {
    field: 'imageurl',
    label: t('reuse.categoryTitle'),
    minWidth: '650',
    headerFilter: 'Name',
    formatter: (record: Recordable, column: TableColumn, cellValue: TableSlotDefault) =>
      setImageDisplayInDOm(record, column, cellValue, record.name)
  },

  {
    field: 'index',
    label: t('reuse.position'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '150',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterProductStatus,
    formatter: (_: Recordable, __: TableColumn, _cellValue: boolean) => {
      return h('div', productStatusTransferToText(_))
    }
  }
]
export const colorCategories = [
  { field: '', width: '50' },
  {
    field: 'imageurl',
    label: t('reuse.categoryColorTitle'),
    minWidth: '950',
    headerFilter: 'Name',
    formatter: (record: Recordable, column: TableColumn, cellValue: TableSlotDefault) =>
      setImageDisplayInDOm(record, column, cellValue, record.name)
  },

  {
    field: 'index',
    label: t('reuse.position'),
    minWidth: '150',
    sortable: true
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '150',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterProductStatus,
    valueFormat: valueDateFormat,
    formatter: (_: Recordable, __: TableColumn, _cellValue: boolean) => {
      return h('div', productStatusTransferToText(_))
    }
  }
]

export const sizeCategories = [
  { field: '', width: '50' },
  {
    field: 'imageurl',
    label: t('reuse.categorySizeTitle'),
    minWidth: '950',
    headerFilter: 'Name',
    formatter: (record: Recordable, column: TableColumn, cellValue: TableSlotDefault) =>
      setImageDisplayInDOm(record, column, cellValue, record.name)
  },

  {
    field: 'index',
    label: t('reuse.position'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '100',
    align: 'center',
    filters: filterProductStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return h('div', productStatusTransferToText(cellValue))
    }
  }
]
export const materialCategories = [
  { field: '', width: '50' },
  {
    field: 'imageurl',
    label: t('reuse.categoryMaterialTitle'),
    minWidth: '950',
    headerFilter: 'Name',
    formatter: (record: Recordable, column: TableColumn, cellValue: TableSlotDefault) =>
      setImageDisplayInDOm(record, column, cellValue, record.name)
  },

  {
    field: 'index',
    label: t('reuse.position'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '150',
    align: 'center',
    filters: filterProductStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return h('div', productStatusTransferToText(cellValue))
    }
  }
]
export const statusCategories = [
  { field: '', width: '50' },
  {
    field: 'imageurl',
    label: t('reuse.categoryStatusTitle'),
    minWidth: '950',
    headerFilter: 'Name',
    formatter: (record: Recordable, column: TableColumn, cellValue: TableSlotDefault) =>
      setImageDisplayInDOm(record, column, cellValue, record.name)
  },

  {
    field: 'index',
    label: t('reuse.position'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '150',
    align: 'center',
    filters: filterProductStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return h('div', productStatusTransferToText(cellValue))
    }
  }
]
export const genderCategories = [
  { field: '', width: '50' },
  {
    field: 'imageurl',
    label: t('reuse.categoryGenderTitle'),
    minWidth: '950',
    headerFilter: 'Name',
    formatter: (record: Recordable, column: TableColumn, cellValue: TableSlotDefault) =>
      setImageDisplayInDOm(record, column, cellValue, record.name)
  },

  {
    field: 'index',
    label: t('reuse.position'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '150',
    align: 'center',
    filters: filterProductStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return h('div', productStatusTransferToText(cellValue))
    }
  }
]
export const unitCategories = [
  { field: '', width: '50' },
  {
    field: 'imageurl',
    label: t('reuse.categoryUnitTitle'),
    minWidth: '950',
    headerFilter: 'Name',
    formatter: (record: Recordable, column: TableColumn, cellValue: TableSlotDefault) =>
      setImageDisplayInDOm(record, column, cellValue, record.name)
  },

  {
    field: 'index',
    label: t('reuse.position'),
    minWidth: '150',
    headerAlign: 'center',
    align: 'center',
    sortable: true
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true,
    valueFormat: valueDateFormat,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterProductStatus,
    formatter: (_: Recordable, __: TableColumn, _cellValue: boolean) => {
      return h('div', productStatusTransferToText(_))
    }
  }
]
export const brandCategories = [
  { field: '', width: '50' },
  {
    field: 'imageurl',
    label: t('reuse.categoryBrandTitle'),
    minWidth: '950',
    headerFilter: 'Name',
    formatter: (record: Recordable, column: TableColumn, cellValue: TableSlotDefault) =>
      setImageDisplayInDOm(record, column, cellValue, record.name)
  },

  {
    field: 'index',
    label: t('reuse.position'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '150',
    align: 'center',
    filters: filterProductStatus,
    formatter: (_: Recordable, __: TableColumn, _cellValue: boolean) => {
      return h('div', productStatusTransferToText(_))
    }
  }
]
export const originCategories = [
  { field: '', width: '50' },
  {
    field: 'imageurl',
    label: t('reuse.categoryOriginTitle'),
    minWidth: '950',
    headerFilter: 'Name',
    formatter: (record: Recordable, column: TableColumn, cellValue: TableSlotDefault) =>
      setImageDisplayInDOm(record, column, cellValue, record.name)
  },

  {
    field: 'index',
    label: t('reuse.position'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return dateTimeFormat(cellValue)
    }
  },
  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '150',
    filters: filterProductStatus,
    formatter: (_: Recordable, __: TableColumn, _cellValue: boolean) => {
      return h('div', productStatusTransferToText(_))
    }
  }
]
