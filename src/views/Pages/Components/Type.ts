interface TableResponse<T = any> {
  total: number
  list: T[]
  pageNumber: number
  pageSize: number
}
type apiType = <T = any>(option: any) => Promise<IResponse<TableResponse<T>>>

interface Tab {
  name: string
  label: string
  api: <T = any>(option: any) => Promise<IResponse<TableResponse<T>>>
  column: TableColumn[]
}
import { RendererElement, RendererNode, VNode } from 'vue'

interface Collapse {
  icon: VNode<RendererNode, RendererElement, { [key: string]: any }>
  name: string
  title: string
  columns: TableColumn[]
  api: apiType | undefined
  buttonAdd: string
  type?: string
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
}
export { apiType, TableResponse, Tab, Collapse }
