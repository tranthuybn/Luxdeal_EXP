<script lang="tsx">
import { PropType, defineComponent, ref, computed, unref, watch, onMounted } from 'vue'
import { ElForm, ElFormItem, ElRow, ElCol, ElTooltip } from 'element-plus'
import { componentMap } from './componentMap'
import { propTypes } from '@/utils/propTypes'
import { getSlot } from '@/utils/tsxHelper'
import {
  setTextPlaceholder,
  setGridProp,
  setComponentProps,
  setItemComponentSlots,
  initModel,
  setFormItemSlots
} from './helper'
import { useRenderSelect } from './components/useRenderSelect'
import { useRenderRadio } from './components/useRenderRadio'
import { useRenderCheckbox } from './components/useRenderCheckbox'
import { useDesign } from '@/hooks/web/useDesign'
import { findIndex } from '@/utils'
import { set } from 'lodash-es'
import { FormProps } from './types'
import { Icon } from '@/components/Icon'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('form')

export default defineComponent({
  name: 'Form',
  props: {
    // The layout structure array of FORM
    formSchema: {
      type: Object as PropType<FormSchema>,
      default: () => {}
    },
    schema: {
      type: Array as PropType<FormSchema[]>,
      default: () => [] || {}
    },
    // Do you need a grid layout
    isCol: propTypes.bool.def(true),
    // Form data object
    model: {
      type: Object as PropType<Recordable>,
      default: () => ({})
    },
    // Whether to automatically set Placeholder
    autoSetPlaceholder: propTypes.bool.def(true),
    // Whether to customize content
    isCustom: propTypes.bool.def(false),
    // Form label width
    labelWidth: propTypes.oneOfType([String, Number]).def('auto')
  },
  emits: ['register'],
  setup(props, { slots, expose, emit }) {
    // Element form instance
    const elFormRef = ref<ComponentRef<typeof ElForm>>()

    // PROPS passed in useform
    const outsideProps = ref<FormProps>({})

    const mergeProps = ref<FormProps>({})

    const getProps = computed(() => {
      const propsObj = { ...props }
      Object.assign(propsObj, unref(mergeProps))
      return propsObj
    })

    // Form data
    const formModel = ref<Recordable>({})

    onMounted(() => {
      emit('register', unref(elFormRef)?.$parent, unref(elFormRef))
    })

    // Assign to the form
    const setValues = (data: Recordable = {}) => {
      formModel.value = Object.assign(unref(formModel), data)
    }

    const setProps = (props: FormProps = {}) => {
      mergeProps.value = Object.assign(unref(mergeProps), props)
      outsideProps.value = props
    }

    const delSchema = (field: string) => {
      const { schema } = unref(getProps)
      const index = findIndex(schema, (v: FormSchema) => v.field === field)
      if (index > -1) {
        schema.splice(index, 1)
      }
    }

    const addSchema = (formSchema: FormSchema, index?: number) => {
      const { schema } = unref(getProps)
      if (index !== void 0) {
        schema.splice(index, 0, formSchema)
        return
      }
      schema.push(formSchema)
    }

    const setSchema = (schemaProps: FormSetPropsType[]) => {
      const { schema } = unref(getProps)
      for (const v of schema) {
        for (const item of schemaProps) {
          if (v.field === item.field) {
            set(v, item.path, item.value)
          }
        }
      }
    }

    const getElFormRef = (): ComponentRef<typeof ElForm> => {
      return unref(elFormRef) as ComponentRef<typeof ElForm>
    }

    expose({
      setValues,
      formModel,
      setProps,
      delSchema,
      addSchema,
      setSchema,
      getElFormRef
    })

    // Structural array of monitoring forms, re -generate formmodel
    watch(
      () => unref(getProps).schema,
      (schema = []) => {
        formModel.value = initModel(schema, unref(formModel))
      },
      {
        immediate: true,
        deep: true
      }
    )

    // Whether to rendering the package label, whether to use a grid layout
    const renderWrap = () => {
      const { isCol } = unref(getProps)
      const content = isCol ? (
        <ElRow gutter={20}>{renderFormItemWrap()}</ElRow>
      ) : (
        renderFormItemWrap()
      )
      return content
    }

    // Whether to render EL-COL
    const renderFormItemWrap = () => {
      // Hidden attribute means hidden, not rendering
      const { schema = [], isCol, formSchema } = unref(getProps)

      return schema.length > 0
        ? schema
            .filter((v) => !v.hidden)
            .map((item) => {
              // If it is a divider component, you need to occupy one line by yourself
              const isDivider = item.component === 'Divider'
              const Com = componentMap['Divider'] as ReturnType<typeof defineComponent>
              return isDivider ? (
                <Com {...{ contentPosition: 'left', ...item.componentProps }}>{item?.label}</Com>
              ) : isCol ? (
                // If you need a grid, you need to wrap ELCOL
                <ElCol {...setGridProp(item.colProps)}>{renderFormItem(item)}</ElCol>
              ) : (
                renderFormItem(item)
              )
            })
        : renderFormItem(formSchema)
    }

    // Rendering Formitem
    const renderFormItem = (item: FormSchema) => {
      // Determine with components with only Options attributes alone
      const notRenderOptions = ['SelectV2', 'Cascader', 'Transfer']
      const slotsMap: Recordable = {
        ...setItemComponentSlots(slots, item?.componentProps?.slots, item.field)
      }
      if (
        item?.component !== 'SelectV2' &&
        item?.component !== 'Cascader' &&
        item?.componentProps?.options
      ) {
        slotsMap.default = () => renderOptions(item)
      }

      const formItemSlots: Recordable = setFormItemSlots(slots, item.field)
      // If there is Labelmessage, automatically use the slot rendering
      if (item?.labelMessage) {
        formItemSlots.label = () => {
          return (
            <>
              <span>{item.label}</span>
              <ElTooltip placement="right" raw-content>
                {{
                  content: () => <span v-html={item.labelMessage}></span>,
                  default: () => (
                    <Icon
                      icon="ep:warning"
                      size={16}
                      color="var(--el-color-primary)"
                      class="ml-2px relative top-1px"
                    ></Icon>
                  )
                }}
              </ElTooltip>
            </>
          )
        }
      }
      return (
        <ElFormItem {...(item.formItemProps || {})} prop={item.field} label={item.label || ''}>
          {{
            ...formItemSlots,
            default: () => {
              const Com = componentMap[item.component as string] as ReturnType<
                typeof defineComponent
              >

              const { autoSetPlaceholder } = unref(getProps)

              return slots[item.field] ? (
                getSlot(slots, item.field, formModel.value)
              ) : (
                <Com
                  vModel={formModel.value[item.field]}
                  {...(autoSetPlaceholder && setTextPlaceholder(item))}
                  {...setComponentProps(item)}
                  {...(notRenderOptions.includes(item?.component as string) &&
                  item?.componentProps?.options
                    ? { options: item?.componentProps?.options || [] }
                    : {})}
                >
                  {{ ...slotsMap }}
                </Com>
              )
            }
          }}
        </ElFormItem>
      )
    }

    // Rendering Options
    const renderOptions = (item: FormSchema) => {
      switch (item.component) {
        case 'Select':
          const { renderSelectOptions } = useRenderSelect(slots)
          return renderSelectOptions(item)
        case 'Radio':
        case 'RadioButton':
          const { renderRadioOptions } = useRenderRadio()
          return renderRadioOptions(item)
        case 'Checkbox':
        case 'CheckboxButton':
          const { renderChcekboxOptions } = useRenderCheckbox()
          return renderChcekboxOptions(item)
        default:
          break
      }
    }

    // Filter the attributes of FORM components
    const getFormBindValue = () => {
      // Avoid excess attributes on labels
      const delKeys = ['schema', 'isCol', 'autoSetPlaceholder', 'isCustom', 'model']
      const props = { ...unref(getProps) }
      for (const key in props) {
        if (delKeys.indexOf(key) !== -1) {
          delete props[key]
        }
      }
      return props
    }

    return () => (
      <ElForm
        ref={elFormRef}
        {...getFormBindValue()}
        model={props.isCustom ? props.model : formModel}
        class={prefixCls}
      >
        {{
          // If you need to be customized, you will not render anything, but provide the default slot
          default: () => {
            const { isCustom } = unref(getProps)
            return isCustom ? getSlot(slots, 'default') : renderWrap()
          }
        }}
      </ElForm>
    )
  }
})
</script>

<style lang="less" scoped>
.@{elNamespace}-form.@{namespace}-form .@{elNamespace}-row {
  margin-right: 0 !important;
  margin-left: 0 !important;
}
</style>
