import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
import { filterTableStatus } from '@/utils/filters'
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
    filters: filterTableStatus
  }
]
export const colorCategories = [
  { field: '', width: '50' },
  {
    field: 'imgTitle',
    label: t('reuse.categoryColorTitle'),
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
    filters: filterTableStatus
  }
]
export const sizeCategories = [
  { field: '', width: '50' },
  {
    field: 'imgTitle',
    label: t('reuse.categorySizeTitle'),
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
    filters: filterTableStatus
  }
]
export const materialCategories = [
  { field: '', width: '50' },
  {
    field: 'imgTitle',
    label: t('reuse.categoryMaterialTitle'),
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
    filters: filterTableStatus
  }
]
export const statusCategories = [
  { field: '', width: '50' },
  {
    field: 'imgTitle',
    label: t('reuse.categoryStatusTitle'),
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
    filters: filterTableStatus
  }
]
export const genderCategories = [
  { field: '', width: '50' },
  {
    field: 'imgTitle',
    label: t('reuse.categoryGenderTitle'),
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
    filters: filterTableStatus
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
    filters: filterTableStatus
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
    filters: filterTableStatus
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
    filters: filterTableStatus
  }
]
