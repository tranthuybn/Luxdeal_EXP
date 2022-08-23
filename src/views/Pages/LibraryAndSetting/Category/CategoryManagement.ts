import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()

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
    sortable: true
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '100',
    filters: [
      { text: t('reuse.active'), value: t('reuse.active') },
      { text: t('reuse.inactive'), value: t('reuse.inactive') },
      { text: t('reuse.pending'), value: t('reuse.pending') }
    ]
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
    sortable: true
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '100',
    filters: [
      { text: t('reuse.active'), value: t('reuse.active') },
      { text: t('reuse.inactive'), value: t('reuse.inactive') },
      { text: t('reuse.pending'), value: t('reuse.pending') }
    ]
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
    sortable: true
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '100',
    filters: [
      { text: t('reuse.active'), value: t('reuse.active') },
      { text: t('reuse.inactive'), value: t('reuse.inactive') },
      { text: t('reuse.pending'), value: t('reuse.pending') }
    ]
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
    sortable: true
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '100',
    filters: [
      { text: t('reuse.active'), value: t('reuse.active') },
      { text: t('reuse.inactive'), value: t('reuse.inactive') },
      { text: t('reuse.pending'), value: t('reuse.pending') }
    ]
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
    sortable: true
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '100',
    filters: [
      { text: t('reuse.active'), value: t('reuse.active') },
      { text: t('reuse.inactive'), value: t('reuse.inactive') },
      { text: t('reuse.pending'), value: t('reuse.pending') }
    ]
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
    sortable: true
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '100',
    filters: [
      { text: t('reuse.active'), value: t('reuse.active') },
      { text: t('reuse.inactive'), value: t('reuse.inactive') },
      { text: t('reuse.pending'), value: t('reuse.pending') }
    ]
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
    sortable: true
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '100',
    filters: [
      { text: t('reuse.active'), value: t('reuse.active') },
      { text: t('reuse.inactive'), value: t('reuse.inactive') },
      { text: t('reuse.pending'), value: t('reuse.pending') }
    ]
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
    sortable: true
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '100',
    filters: [
      { text: t('reuse.active'), value: t('reuse.active') },
      { text: t('reuse.inactive'), value: t('reuse.inactive') },
      { text: t('reuse.pending'), value: t('reuse.pending') }
    ]
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
    sortable: true
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '100',
    filters: [
      { text: t('reuse.active'), value: t('reuse.active') },
      { text: t('reuse.inactive'), value: t('reuse.inactive') },
      { text: t('reuse.pending'), value: t('reuse.pending') }
    ]
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
    sortable: true
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '100',
    filters: [
      { text: t('reuse.active'), value: t('reuse.active') },
      { text: t('reuse.inactive'), value: t('reuse.inactive') },
      { text: t('reuse.pending'), value: t('reuse.pending') }
    ]
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
    sortable: true
  },
  {
    field: 'status',
    label: t('reuse.status'),
    minWidth: '100',
    filters: [
      { text: t('reuse.active'), value: t('reuse.active') },
      { text: t('reuse.inactive'), value: t('reuse.inactive') },
      { text: t('reuse.pending'), value: t('reuse.pending') }
    ]
  }
]
