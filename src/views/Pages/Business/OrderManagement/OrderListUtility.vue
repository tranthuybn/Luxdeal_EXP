<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import TableAddBusinessProduct from '@/views/Pages/Components/TableAddBusinessProduct.vue'
import { RendererElement, RendererNode, VNode } from 'vue'
import { ElCollapse, ElCollapseItem, ElButton } from 'element-plus'
import { getBranchList } from '@/api/HumanResourceManagement'
import { useIcon } from '@/hooks/web/useIcon'
const { t } = useI18n()

const schema = reactive<FormSchema[]>([
  {
    field: 'generalInformation',
    label: t('formDemo.generalInformation'),
    component: 'Divider'
  },
  {
    field: 'orderCode',
    label: t('formDemo.orderCode'),
    component: 'Input',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: t('Nhập mã đơn hàng')
    }
  },
  {
    field: 'collaborators',
    label: t('formDemo.collaborators'),
    component: 'Input',
    colProps: {
      span: 9
    },
    componentProps: {
      placeholder: t('formDemo.selectOrEnterTheCollaboratorCode')
    }
  },
  {
    field: 'discount',
    formItemProps: {
      labelWidth: '0px'
    },
    component: 'Input',
    colProps: {
      span: 9
    },
    componentProps: {
      placeholder: t('formDemo.enterDiscount')
    }
  },
  {
    field: 'orderNotes',
    label: t('formDemo.orderNotes'),
    component: 'Input',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: t('formDemo.addNotes')
    }
  },
  {
    field: 'customer',
    label: t('formDemo.customer'),
    component: 'Divider'
  },
  {
    field: 'customerName',
    label: t('formDemo.customerName'),
    component: 'Input',
    colProps: {
      span: 18
    }
  },
  {
    field: 'companyInformation',
    label: t('formDemo.companyInformation'),
    component: 'Input',
    colProps: {
      span: 18
    },
    componentProps: {
      modelValue: '123213213213\n Mã số thuế',
      class: 'xoaBorder'
    }
  },
  {
    field: 'customer',
    label: t('reuse.promotion'),
    component: 'Divider'
  },
  {
    field: 'voucher',
    label: t('router.voucher'),
    component: 'Select',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: t('formDemo.selectOrEnterCouponCode'),
      options: [
        {
          label: 'option1',
          value: '1'
        },
        {
          label: 'option2',
          value: '2'
        }
      ]
    }
  }
])

const productForm = reactive<FormSchema[]>([
  {
    field: 'informationProduct',
    label: 'quan ly',
    component: 'Input'
  }
])
interface Collapse {
  icon: VNode<RendererNode, RendererElement, { [key: string]: any }>
  name: string
  title: string
  columns?: TableColumn[]
  api?: <T = any>(option: any) => Promise<IResponse<T>>
  buttonAdd: string
  buttons: number
}
const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })
const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'information',
    title: t('formDemo.orderInformation'),
    columns: schema,
    api: getBranchList,
    buttonAdd: '',
    buttons: 3
  },
  {
    icon: plusIcon,
    name: 'product',
    title: t('san pham'),
    columns: productForm,
    api: undefined,
    buttonAdd: '',
    buttons: 3
  }
]
let currentCollapse = ref<string>(collapse[0].name)
const collapseChangeEvent = (val) => {
  if (val) {
    collapse.forEach((el) => {
      if (val.includes(el.name)) el.icon = minusIcon
      else if (el.icon == minusIcon) el.icon = plusIcon
    })
  } else
    collapse.forEach((el) => {
      el.icon = plusIcon
    })
}

const activeName = ref('information')
// const router = useRouter()
// const currentRoute = String(router.currentRoute.value.params.backRoute)
</script>

<template>
  <div class="demo-collapse">
    <el-collapse v-model="activeName" :collapse="collapse" @change="collapseChangeEvent">
      <el-collapse-item
        v-for="(item, index) in collapse"
        :key="index"
        :name="item.name"
        v-model="currentCollapse"
      >
        <template #title>
          <el-button class="header-icon" :icon="item.icon" link />
          <span class="text-center">{{ item.title }}</span>
        </template>
        <TableAddBusinessProduct
          :schema="schema"
          :backButton="false"
          :api="item.api"
          :key="index"
          :columns="item.columns"
          :buttons="item.buttons"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<style scoped>
::v-deep(.el-select) {
  width: 100%;
}
</style>
