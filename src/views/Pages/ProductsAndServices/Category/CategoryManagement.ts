import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
import { filterProductStatus } from '@/utils/filters'
import { productStatusTransferToText } from '@/utils/format'
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
    field: 'position',
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
    align: 'right',
    type: 'index',
    sortable: true
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true
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
    align: 'right',
    sortable: true,
    type: 'index'
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true
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
    align: 'right',
    sortable: true,
    type: 'index'
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '100',
    filters: filterProductStatus
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
    align: 'right',
    sortable: true,
    type: 'index'
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '100',
    filters: filterProductStatus
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
    align: 'right',
    sortable: true,
    type: 'index'
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'isActive',
    label: t('reuse.status'),
    minWidth: '100',
    filters: filterProductStatus
  }
]
export const unitCategories = [
  {
    field: 'name',
    label: t('reuse.categoryUnitTitle'),
    minWidth: '650',
    headerFilter: 'Name'
  },

  {
    field: 'index',
    label: t('reuse.position'),
    minWidth: '150',
    type: 'index',
    align: 'right',
    sortable: true
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true
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
    field: 'imgTitle',
    label: t('reuse.categoryBrandTitle'),
    minWidth: '650',
    headerFilter: 'Name'
  },

  {
    field: 'position',
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
export const originCategories = [
  { field: '', width: '50' },
  {
    field: 'name',
    label: t('reuse.categoryOriginTitle'),
    minWidth: '650',
    headerFilter: 'Name'
  },

  {
    field: 'index',
    label: t('reuse.position'),
    minWidth: '150',
    type: 'index',
    align: 'right',
    sortable: true
  },
  {
    field: 'createdAt',
    label: t('reuse.createDate'),
    minWidth: '150',
    align: 'center',
    sortable: true
  },
  {
    field: 'isHide',
    label: t('reuse.status'),
    minWidth: '100',
    filters: filterProductStatus,
    formatter: (_: Recordable, __: TableColumn, cellValue: boolean) => {
      return h('div', productStatusTransferToText(cellValue))
    }
  }
]
