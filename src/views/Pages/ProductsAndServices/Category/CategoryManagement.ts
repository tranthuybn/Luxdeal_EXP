import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
import { filterProductStatus } from '@/utils/filters'
import { productStatusTransferToText, dateTimeFormat } from '@/utils/format'
import { h } from 'vue'
export const productCategories = [
  { field: '', width: '50' },
  {
    field: 'imgTitle',
    label: t('reuse.categoryTitle'),
    minWidth: '650',
    headerFilter: 'Name'
  },

  {
    field: 'index',
    label: t('reuse.position'),
    minWidth: '150',
    align: 'right',
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
    field: 'status',
    label: t('reuse.status'),
    minWidth: '100',
    filters: filterProductStatus
  }
]
export const colorCategories = [
  { field: '', width: '50' },
  {
    field: 'name',
    label: t('reuse.categoryColorTitle'),
    minWidth: '650',
    headerFilter: 'Name'
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
    filters: filterProductStatus,
    align: 'center',
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return h('div', productStatusTransferToText(cellValue))
    }
  }
]
export const sizeCategories = [
  { field: '', width: '50' },
  {
    field: 'name',
    label: t('reuse.categorySizeTitle'),
    minWidth: '650',
    headerFilter: 'Name'
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
    field: 'name',
    label: t('reuse.categoryMaterialTitle'),
    minWidth: '650',
    headerFilter: 'Name'
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
export const statusCategories = [
  { field: '', width: '50' },
  {
    field: 'name',
    label: t('reuse.categoryStatusTitle'),
    minWidth: '650',
    headerFilter: 'Name'
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
export const genderCategories = [
  { field: '', width: '50' },
  {
    field: 'name',
    label: t('reuse.categoryGenderTitle'),
    minWidth: '650',
    headerFilter: 'Name'
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
export const unitCategories = [
  { field: '', width: '50' },
  {
    field: 'imgTitle',
    label: t('reuse.categoryUnitTitle'),
    minWidth: '650',
    headerFilter: 'Name'
  },

  {
    field: 'index',
    label: t('reuse.position'),
    minWidth: '150',
    align: 'right',
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
    filters: filterProductStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return h('div', productStatusTransferToText(cellValue))
    }
  }
]
export const brandCategories = [
  { field: '', width: '50' },
  {
    field: 'name',
    label: t('reuse.categoryBrandTitle'),
    minWidth: '450',
    headerFilter: 'Name'
  },

  {
    field: 'position',
    label: t('reuse.position'),
    minWidth: '150',
    align: 'center',
    sortable: true,
    componentProps: {
      class: 'fix'
    }
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
export const originCategories = [
  { field: '', width: '50' },
  {
    field: 'imgTitle',
    label: t('reuse.categoryOriginTitle'),
    minWidth: '650',
    headerFilter: 'Name'
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
