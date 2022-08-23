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

export { apiType, TableResponse, Tab }
