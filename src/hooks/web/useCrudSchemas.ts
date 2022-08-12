import { reactive } from 'vue'
import { eachTree, treeMap, filter } from '@/utils/tree'
import { findIndex } from '@/utils'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { useI18n } from '@/hooks/web/useI18n'
import type { AxiosPromise } from 'axios'

export type CrudSchema = Omit<TableColumn, 'children'> & {
  search?: CrudSearchParams
  table?: CrudTableParams
  form?: CrudFormParams
  detail?: CrudDescriptionsParams
  children?: CrudSchema[]
}

type CrudSearchParams = {
  // Whether it is displayed in the query item
  show?: boolean
  // Dictionary name, you will take a global dictionary
  dictName?: string
  // interface
  api?: () => Promise<any>
} & Omit<FormSchema, 'field'>

type CrudTableParams = {
  // Whether to display the header
  show?: boolean
} & Omit<FormSchema, 'field'>

type CrudFormParams = {
  // Dictionary name, you will take a global dictionary
  dictName?: string
  // interface
  api?: () => Promise<any>
  // Whether to display the table item
  show?: boolean
} & Omit<FormSchema, 'field'>

type CrudDescriptionsParams = {
  // Whether to display the table item
  show?: boolean
} & Omit<DescriptionsSchema, 'field'>

const dictStore = useDictStoreWithOut()

const { t } = useI18n()

interface AllSchemas {
  searchSchema: FormSchema[]
  tableColumns: TableColumn[]
  formSchema: FormSchema[]
  detailSchema: DescriptionsSchema[]
}

// Filter all structures
export const useCrudSchemas = (
  crudSchema: CrudSchema[]
): {
  allSchemas: AllSchemas
} => {
  // All structure data
  const allSchemas = reactive<AllSchemas>({
    searchSchema: [],
    tableColumns: [],
    formSchema: [],
    detailSchema: []
  })

  const searchSchema = filterSearchSchema(crudSchema, allSchemas)
  allSchemas.searchSchema = searchSchema || []

  const tableColumns = filterTableSchema(crudSchema)
  allSchemas.tableColumns = tableColumns || []

  const formSchema = filterFormSchema(crudSchema, allSchemas)
  allSchemas.formSchema = formSchema

  const detailSchema = filterDescriptionsSchema(crudSchema)
  allSchemas.detailSchema = detailSchema

  return {
    allSchemas
  }
}

// Filter Search structure
const filterSearchSchema = (crudSchema: CrudSchema[], allSchemas: AllSchemas): FormSchema[] => {
  const searchSchema: FormSchema[] = []

  // Get the dictionary queue
  const searchRequestTask: Array<() => Promise<void>> = []

  eachTree(crudSchema, (schemaItem: CrudSchema) => {
    // Determine whether it is displayed
    if (schemaItem?.search?.show) {
      const searchSchemaItem = {
        // Deficiency Input
        component: schemaItem.search.component || 'Input',
        componentProps: {},
        ...schemaItem.search,
        field: schemaItem.field,
        label: schemaItem.search?.label || schemaItem.label
      }

      if (searchSchemaItem.dictName) {
        // If there is DICTNAME, it is proved to obtain data from the dictionary
        const dictArr = dictStore.getDictObj[searchSchemaItem.dictName]
        searchSchemaItem.componentProps!.options = filterOptions(dictArr)
      } else if (searchSchemaItem.api) {
        searchRequestTask.push(async () => {
          const res = await (searchSchemaItem.api as () => AxiosPromise)()
          if (res) {
            const index = findIndex(allSchemas.searchSchema, (v: FormSchema) => {
              return v.field === searchSchemaItem.field
            })
            if (index !== -1) {
              allSchemas.searchSchema[index]!.componentProps!.options = filterOptions(
                res,
                searchSchemaItem.componentProps.optionsAlias?.labelField
              )
            }
          }
        })
      }

      // Delete unnecessary fields
      delete searchSchemaItem.show
      delete searchSchemaItem.dictName

      searchSchema.push(searchSchemaItem)
    }
  })

  for (const task of searchRequestTask) {
    task()
  }

  return searchSchema
}

// Filter Table structure
const filterTableSchema = (crudSchema: CrudSchema[]): TableColumn[] => {
  const tableColumns = treeMap<CrudSchema>(crudSchema, {
    conversion: (schema: CrudSchema) => {
      if (schema?.table?.show !== false) {
        return {
          ...schema.table,
          ...schema
        }
      }
    }
  })

  // The first filtering will have undefined so it takes secondary filtration
  return filter<TableColumn>(tableColumns as TableColumn[], (data) => {
    if (data.children === void 0) {
      delete data.children
    }
    return !!data.field
  })
}

// Filter form structure
const filterFormSchema = (crudSchema: CrudSchema[], allSchemas: AllSchemas): FormSchema[] => {
  const formSchema: FormSchema[] = []

  // Get the dictionary queue
  const formRequestTask: Array<() => Promise<void>> = []

  eachTree(crudSchema, (schemaItem: CrudSchema) => {
    // Determine whether it is displayed
    if (schemaItem?.form?.show !== false) {
      const formSchemaItem = {
        // Deficiency Input
        component: schemaItem?.form?.component || 'Input',
        componentProps: {},
        ...schemaItem.form,
        field: schemaItem.field,
        label: schemaItem.search?.label || schemaItem.label
      }

      if (formSchemaItem.dictName) {
        // If there is DICTNAME, it is proved to obtain data from the dictionary
        const dictArr = dictStore.getDictObj[formSchemaItem.dictName]
        formSchemaItem.componentProps!.options = filterOptions(dictArr)
      } else if (formSchemaItem.api) {
        formRequestTask.push(async () => {
          const res = await (formSchemaItem.api as () => AxiosPromise)()
          if (res) {
            const index = findIndex(allSchemas.formSchema, (v: FormSchema) => {
              return v.field === formSchemaItem.field
            })
            if (index !== -1) {
              allSchemas.formSchema[index]!.componentProps!.options = filterOptions(
                res,
                formSchemaItem.componentProps.optionsAlias?.labelField
              )
            }
          }
        })
      }

      // Delete unnecessary fields
      delete formSchemaItem.show
      delete formSchemaItem.dictName

      formSchema.push(formSchemaItem)
    }
  })

  for (const task of formRequestTask) {
    task()
  }
  console.log(formSchema)
  return formSchema
}

// Filter Descriptions structure
const filterDescriptionsSchema = (crudSchema: CrudSchema[]): DescriptionsSchema[] => {
  const descriptionsSchema: FormSchema[] = []

  eachTree(crudSchema, (schemaItem: CrudSchema) => {
    // Determine whether it is displayed
    if (schemaItem?.detail?.show !== false) {
      const descriptionsSchemaItem = {
        ...schemaItem.detail,
        field: schemaItem.field,
        label: schemaItem.detail?.label || schemaItem.label
      }

      // Delete unnecessary fields
      delete descriptionsSchemaItem.show

      descriptionsSchema.push(descriptionsSchemaItem)
    }
  })

  return descriptionsSchema
}

// Add internationalization to Options
const filterOptions = (options: Recordable, labelField?: string) => {
  return options.map((v: Recordable) => {
    if (labelField) {
      v['labelField'] = t(v.labelField)
    } else {
      v['label'] = t(v.label)
    }
    return v
  })
}
