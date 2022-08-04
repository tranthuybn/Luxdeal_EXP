export type TableProps = {
  pageSize?: number
  currentPage?: number
  // Whether to choose more
  selection?: boolean
  // Whether it exceeds hidden, the priority is lower than the Showoverflowtooltip in SHOMA,
  showOverflowTooltip?: boolean
  // Head
  columns?: TableColumn[]
  // Whether to show paging
  pagination?: Pagination | undefined
  /**
   * Only the column of Type = Selection is valid, and the type is BOOLEAN.
   *  For TRUE, the data selected before the data is reserved (required to specify Row-Key)
   * */
  reserveSelection?: boolean
  // Loading status
  loading?: boolean
  // Whether to overlap the index
  reserveIndex?: boolean
  // Alignment
  align?: 'left' | 'center' | 'right'
  // Model of header
  headerAlign?: 'left' | 'center' | 'right'
  data?: Recordable
  expand?: boolean
} & Recordable
