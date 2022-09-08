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
    field: 'field7',
    label: t('formDemo.generalServiceInformation'),
    component: 'Divider'
  },
  {
    field: 'field1',
    label: t('formDemo.serviceCode'),
    component: 'Input',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: t('formDemo.enterServiceCode')
    }
  },
  {
    field: 'field2',
    label: t('formDemo.serviceName'),
    component: 'Input',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: t('formDemo.enterServiceName')
    }
  },
  {
    field: 'field3',
    label: t('formDemo.shortDescription'),
    component: 'Input',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: t('formDemo.enterDescription')
    }
  },
  {
    field: 'fied4',
    label: t('formDemo.description'),
    component: 'Editor',
    colProps: {
      span: 24
    },
    componentProps: {
      defaultHtml: ''
    }
  },
  {
    field: 'field7',
    label: t('formDemo.servicePriceAndExecutionTime'),
    component: 'Divider'
  },
  {
    field: 'field4',
    label: t('formDemo.serviceUnitPrice'),
    component: 'Input',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: t('formDemo.enterPrice')
    }
  },
  {
    field: 'field5',
    label: t('formDemo.promotionalPrice'),
    component: 'Input',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: t('formDemo.enterPrice')
    }
  },
  {
    field: 'field61',
    label: t('formDemo.executionTime'),
    component: 'Input',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: t('formDemo.enterNumberHours')
    }
  },
  {
    field: 'field7',
    label: t('formDemo.insurance'),
    component: 'Input',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: t('formDemo.enterNumberDays')
    }
  },
  {
    field: 'field8',
    label: t('formDemo.statusAndFunctional'),
    component: 'Divider'
  },
  {
    field: 'field42',
    label: t('formDemo.status'),
    component: 'Checkbox',
    value: [],
    componentProps: {
      options: [
        {
          label: t('formDemo.pending'),
          value: 'wating'
        },
        {
          label: t('formDemo.isActive'),
          value: 'active'
        },
        {
          label: t('formDemo.pauseActivity'),
          value: 'stop'
        }
      ]
    }
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
    title: 'Thông tin sản phẩm',
    columns: schema,
    api: getBranchList,
    buttonAdd: '',
    buttons: 1
  },
  {
    icon: plusIcon,
    name: 'priceCharacteristics',
    title: 'Quản lý tiêu chuẩn vật tư sử dụng',
    buttonAdd: 'Thêm đặc tính và giá bán',
    buttons: 2
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
const title = 'Thông tin dich vụ'
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
          :title="title"
          :buttons="item.buttons"
          :backButton="false"
          :titleButtons="item.buttonAdd"
          :api="item.api"
          :key="index"
          :columns="item.columns"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped>
@media only screen and (min-width: 1920px) {
  .el-col-xl-12 {
    max-width: 100% !important;
    flex: 0 0 100% !important;
  }
}
</style>
