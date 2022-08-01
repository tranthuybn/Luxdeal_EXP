import { createTypes, VueTypesInterface, VueTypeValidableDef } from 'vue-types'
import { CSSProperties } from 'vue'

// Custom extension Vue-Types
type PropTypes = VueTypesInterface & {
  readonly style: VueTypeValidableDef<CSSProperties>
}

const propTypes = createTypes({
  func: undefined,
  bool: undefined,
  string: undefined,
  number: undefined,
  object: undefined,
  integer: undefined
}) as PropTypes

// Need types that need to be customized
// see: https://dwightjack.github.io/vue-types/advanced/extending-vue-types.html#the-extend-method
propTypes.extend([
  {
    name: 'style',
    getter: true,
    type: [String, Object],
    default: undefined
  }
])

export { propTypes }
