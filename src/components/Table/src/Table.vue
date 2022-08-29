<script lang="tsx">
import { ElTable, ElTableColumn, ElPagination, ElButton } from 'element-plus'
import { defineComponent, PropType, ref, computed, unref, watch, onMounted } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { setIndex } from './helper'
import { getSlot } from '@/utils/tsxHelper'
import type { TableProps } from './types'
import { set } from 'lodash-es'
import { Form } from '@/components/Form'

// type CrudSchemaType = CrudSchema[]
export default defineComponent({
  name: 'Table',
  props: {
    pageSize: propTypes.number.def(10),
    currentPage: propTypes.number.def(1),
    // Whether to choose more
    selection: {
      type: Boolean,
      default: true
    },
    // Whether it exceeds hidden, the priority is lower than the Showoverflowtooltip in SHOMA,
    showOverflowTooltip: propTypes.bool.def(false),
    // Head
    columns: {
      type: Array as PropType<TableColumn[]>,
      default: () => []
    },
    // Launch
    expand: propTypes.bool.def(false),
    // Whether to show paging
    pagination: {
      type: Object as PropType<Pagination>,
      default: (): Pagination | undefined => undefined
    },
    /**
     * Only the column of Type = Selection is valid, and the type is BOOLEAN.
     * For TRUE, the data selected before the data is reserved(required to specify Row- Key)
     */
    reserveSelection: propTypes.bool.def(false),
    // Loading status
    loading: propTypes.bool.def(false),
    // Whether to overlap the index
    reserveIndex: propTypes.bool.def(false),
    // Alignment
    align: propTypes.string
      .validate((v: string) => ['left', 'center', 'right'].includes(v))
      .def('left'),
    // Model of header
    headerAlign: propTypes.string
      .validate((v: string) => ['left', 'center', 'right'].includes(v))
      .def('left'),
    data: {
      type: Array as PropType<Recordable[]>,
      default: () => []
    },
    //Array of FormSchema for header
    headerForm: {
      type: Array as PropType<FormSchema[]>,
      default: () => [] || {}
    },
    border: propTypes.bool.def(true),
    maxHeight: propTypes.string.def('auto')
  },
  emits: ['update:pageSize', 'update:currentPage', 'register'],
  setup(props, { attrs, slots, emit, expose }) {
    const elTableRef = ref<ComponentRef<typeof ElTable>>()

    // register
    onMounted(() => {
      const tableRef = unref(elTableRef)
      emit('register', tableRef?.$parent, elTableRef)
    })

    const pageSizeRef = ref(props.pageSize)

    const currentPageRef = ref(props.currentPage)

    // PROPS passed into usetable
    const outsideProps = ref<TableProps>({})

    const mergeProps = ref<TableProps>({})

    const getProps = computed(() => {
      const propsObj = { ...props }
      Object.assign(propsObj, unref(mergeProps))
      return propsObj
    })

    const setProps = (props: TableProps = {}) => {
      mergeProps.value = Object.assign(unref(mergeProps), props)
      outsideProps.value = props
    }

    const setColumn = (columnProps: TableSetPropsType[], columnsChildren?: TableColumn[]) => {
      const { columns } = unref(getProps)
      for (const v of columnsChildren || columns) {
        for (const item of columnProps) {
          if (v.field === item.field) {
            set(v, item.path, item.value)
          } else if (v.children?.length) {
            setColumn(columnProps, v.children)
          }
        }
      }
    }

    const selections = ref<Recordable[]>([])

    const selectionChange = (selection: Recordable[]) => {
      selections.value = selection
    }

    expose({
      setProps,
      setColumn,
      selections
    })

    const pagination = computed(() => {
      const pageSizes = [10, 20, 30, 40, 50, 100]
      return Object.assign(
        {
          small: true,
          background: true,
          pagerCount: 7,
          layout: 'sizes, prev, pager, next, jumper, ->, total',
          pageSizes: pageSizes,
          disabled: false,
          hideOnSinglePage: true,
          total: pageSizes[0]
        },
        unref(getProps).pagination
      )
    })

    watch(
      () => unref(getProps).pageSize,
      (val: number) => {
        pageSizeRef.value = val
      }
    )

    watch(
      () => unref(getProps).currentPage,
      (val: number) => {
        currentPageRef.value = val
      }
    )

    watch(
      () => pageSizeRef.value,
      (val: number) => {
        emit('update:pageSize', val)
      }
    )

    watch(
      () => currentPageRef.value,
      (val: number) => {
        emit('update:currentPage', val)
      }
    )

    const getBindValue = computed(() => {
      const bindValue: Recordable = { ...attrs, ...props }
      delete bindValue.columns
      delete bindValue.data
      return bindValue
    })

    const renderTableSelection = () => {
      const { selection, reserveSelection, headerAlign } = unref(getProps)
      // Multi -choice
      return selection ? (
        <ElTableColumn
          type="selection"
          reserveSelection={reserveSelection}
          align="center"
          headerAlign={headerAlign}
          width="65"
        ></ElTableColumn>
      ) : undefined
    }

    const renderTableExpand = () => {
      const { align, headerAlign, expand } = unref(getProps)
      // Rendering
      return expand ? (
        <ElTableColumn type="expand" align={align} headerAlign={headerAlign}>
          {{
            // @ts-ignore
            default: (data: TableSlotDefault) => getSlot(slots, 'expand', data)
          }}
        </ElTableColumn>
      ) : undefined
    }

    const renderTreeTableColumn = (columnsChildren: TableColumn[]) => {
      const { align, headerAlign, showOverflowTooltip } = unref(getProps)
      return columnsChildren.map((v) => {
        const props = { ...v }
        if (props.children) delete props.children
        return (
          <ElTableColumn
            showOverflowTooltip={showOverflowTooltip}
            align={v.align ?? align}
            headerAlign={headerAlign}
            {...props}
            prop={v.field}
            fixed={v.fixed ?? false}
          >
            {{
              default: (data: TableSlotDefault) =>
                v.children && v.children.length
                  ? renderTableColumn(v.children)
                  : // @ts-ignore
                    getSlot(slots, v.field, data) ||
                    v?.formatter?.(data.row, data.column, data.row[v.field], data.$index) ||
                    data.row[v.field],
              // @ts-ignore
              header: getSlot(slots, `${v.field}-header`)
            }}
          </ElTableColumn>
        )
      })
    }
    const formVisible = ref(false)
    const showForm = () => {
      formVisible.value = !formVisible.value
    }
    const getHeaderForm = (formSchema1?: FormSchema, label: String) => {
      return (
        <div>
          <div>{label}</div>
          <ElButton onClick={showForm}>123</ElButton>
          <div>{formVisible.value ? <Form formSchema={formSchema1} /> : <div></div>}</div>
        </div>
      )
    }
    const headerContent = (HeaderFormSchema: FormSchema[], field: String, label: String) => {
      var index = 100
      HeaderFormSchema.map((item) => {
        if (item.field === field) {
          index = HeaderFormSchema.indexOf(item)
        }
      })
      if (index != 100) {
        return getHeaderForm(HeaderFormSchema[index], label)
      } else {
        return label
      }
    }
    const renderTableColumn = (columnsChildren?: TableColumn[]) => {
      const {
        columns,
        reserveIndex,
        pageSize,
        currentPage,
        align,
        headerAlign,
        showOverflowTooltip,
        headerForm
      } = unref(getProps)
      return [...[renderTableExpand()], ...[renderTableSelection()]].concat(
        (columnsChildren || columns).map((v) => {
          // Self -firing serial number
          if (v.type === 'index') {
            return (
              <ElTableColumn
                type="index"
                index={
                  v.index
                    ? v.index
                    : (index) => setIndex(reserveIndex, index, pageSize, currentPage)
                }
                align={v.align || align}
                headerAlign={v.headerAlign || headerAlign}
                label={v.label}
                width="65"
                fixed={v.fixed ?? false}
              ></ElTableColumn>
            )
          } else {
            const props = { ...v }
            if (props.children) delete props.children
            return (
              <ElTableColumn
                column-key={v.field}
                showOverflowTooltip={showOverflowTooltip}
                align={v.align || align}
                headerAlign={headerAlign}
                {...props}
                prop={v.field}
              >
                {{
                  default: (data: TableSlotDefault) =>
                    v.children && v.children.length
                      ? renderTreeTableColumn(v.children)
                      : // @ts-ignore
                        getSlot(slots, v.field, data) ||
                        v?.formatter?.(data.row, data.column, data.row[v.field], data.$index) ||
                        data.row[v.field],
                  // @ts-ignore
                  header: () =>
                    getSlot(slots, `${v.field}-header`) ||
                    headerContent(headerForm, v.field, v.label)
                }}
              </ElTableColumn>
            )
          }
        })
      )
    }

    return () => (
      <div v-loading={unref(getProps).loading}>
        <ElTable
          // @ts-ignore
          rowKey="id"
          ref={elTableRef}
          data={unref(getProps).data}
          onSelection-change={selectionChange}
          {...unref(getBindValue)}
          headerRowClassName="header-Table-customize"
        >
          {{
            default: () => renderTableColumn(),
            // @ts-ignore
            append: () => getSlot(slots, 'append')
          }}
        </ElTable>
        {unref(getProps).pagination ? (
          <ElPagination
            v-model:pageSize={pageSizeRef.value}
            v-model:currentPage={currentPageRef.value}
            class="mt-10px rounded-1\/2"
            {...unref(pagination)}
          ></ElPagination>
        ) : undefined}
      </div>
    )
  }
})
</script>
<style scoped lang="less">
::v-deep(.header-Table-customize),
::v-deep(.el-table__row) {
  .cell {
    word-break: break-word;
    white-space: unset;
  }
}
::v-deep(.el-pagination.is-background .btn-next),
::v-deep(.el-pagination.is-background .btn-prev),
::v-deep(.el-pagination.is-background .el-pager li) {
  border-radius: 50%;
}
</style>
