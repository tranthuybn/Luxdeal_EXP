import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
import { filterTableStatus } from '@/utils/filters'
export const productCategories = [
  { field: 'void', width: '50' },
  {
    field: 'imgTitle',
    label: t('reuse.categoryTitle'),
    minWidth: '650',
    sortable: true
  },

  {
    field: 'position',
    label: t('reuse.position'),
    minWidth: '150',
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

export const spaProductCategories = [
  { field: 'void', width: '50' },
  {
    field: 'imgTitle',
    label: t('reuse.categoryTitle'),
    minWidth: '650',
    sortable: true
  },

  {
    field: 'position',
    label: t('reuse.position'),
    minWidth: '150',
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
export const propertyProductCategories = [
  { field: 'void', width: '50' },
  {
    field: 'imgTitle',
    label: t('reuse.categoryTitle'),
    minWidth: '650',
    sortable: true
  },

  {
    field: 'position',
    label: t('reuse.position'),
    minWidth: '150',
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
  { field: 'void', width: '50' },
  {
    field: 'imgTitle',
    label: t('reuse.categoryColorTitle'),
    minWidth: '650',
    sortable: true
  },

  {
    field: 'position',
    label: t('reuse.position'),
    minWidth: '150',
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
  { field: 'void', width: '50' },
  {
    field: 'imgTitle',
    label: t('reuse.categorySizeTitle'),
    minWidth: '650',
    sortable: true
  },

  {
    field: 'position',
    label: t('reuse.position'),
    minWidth: '150',
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
  { field: 'void', width: '50' },
  {
    field: 'imgTitle',
    label: t('reuse.categoryMaterialTitle'),
    minWidth: '650',
    sortable: true
  },

  {
    field: 'position',
    label: t('reuse.position'),
    minWidth: '150',
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
  { field: 'void', width: '50' },
  {
    field: 'imgTitle',
    label: t('reuse.categoryStatusTitle'),
    minWidth: '650',
    sortable: true
  },

  {
    field: 'position',
    label: t('reuse.position'),
    minWidth: '150',
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
  { field: 'void', width: '50' },
  {
    field: 'imgTitle',
    label: t('reuse.categoryGenderTitle'),
    minWidth: '650',
    sortable: true
  },

  {
    field: 'position',
    label: t('reuse.position'),
    minWidth: '150',
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
  { field: 'void', width: '50' },
  {
    field: 'imgTitle',
    label: t('reuse.categoryUnitTitle'),
    minWidth: '650',
    sortable: true
  },

  {
    field: 'position',
    label: t('reuse.position'),
    minWidth: '150',
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
  { field: 'void', width: '50' },
  {
    field: 'imgTitle',
    label: t('reuse.categoryBrandTitle'),
    minWidth: '650',
    sortable: true
  },

  {
    field: 'position',
    label: t('reuse.position'),
    minWidth: '150',
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
  { field: 'void', width: '50' },
  {
    field: 'imgTitle',
    label: t('reuse.categoryOriginTitle'),
    minWidth: '650',
    sortable: true
  },

  {
    field: 'position',
    label: t('reuse.position'),
    minWidth: '150',
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
