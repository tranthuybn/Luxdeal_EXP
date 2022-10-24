import { TableData } from '@/api/table/types'

interface TableResponse<T = any> {
  total: number
  list: T[]
  pageNumber: number
  pageSize: number
}
type apiType = (option: any) => Promise<IResponse<TableResponse<TableData>>>

interface Tab {
  name: string
  label: string
  api: (option: any) => Promise<IResponse<TableResponse<TableData>>>
  column: TableColumn[]
  params?: string
  delApi?: (option: any) => Promise<IResponse<TableResponse<TableData>>>
  titleAdd?: string
  customOperator?: number
}
import { RendererElement, RendererNode, VNode } from 'vue'

interface Collapse {
  [key: string]: any
  icon: VNode<RendererNode, RendererElement, { [key: string]: any }>
  name: string
  title?: string
  columns?: TableColumn[]
  api?: any
  buttonAdd?: string
  typeForm?: string
  typeButton?: string
  expand?: boolean
  apiTableChild?: apiType | undefined
  columnsTableChild?: TableColumn[] | undefined
  pagination?: boolean
  removeHeaderFilter?: boolean
  removeDrawer?: boolean
  selection?: boolean
  customOperator?: number
  hasImage?: boolean
  titleChilden?: string
  rules?: Object
  customOperatorChildren?: boolean
  titleButtonChildren?: string
  customOperatorChilden?: boolean
  value?: number
}
export { apiType, TableResponse, Tab, Collapse }
