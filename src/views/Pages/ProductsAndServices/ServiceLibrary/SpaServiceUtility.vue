<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import TableOperator from '@/views/Pages/Components/TableBase/src/TableOperator.vue'
import { RendererElement, RendererNode, VNode } from 'vue'
import { ElCollapse, ElCollapseItem, ElButton } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
const { t } = useI18n()

const schema = reactive<FormSchema[]>([
  {
    field: 'generalServiceInformation',
    label: t('formDemo.generalServiceInformation'),
    component: 'Divider'
  },
  {
    field: 'serviceCode',
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
    field: 'serviceName',
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
    field: 'shortDescription',
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
    field: 'description',
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
    field: 'servicePriceAndExecutionTime',
    label: t('formDemo.servicePriceAndExecutionTime'),
    component: 'Divider'
  },
  {
    field: 'serviceUnitPrice',
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
    field: 'promotionalPrice',
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
    field: 'executionTime',
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
    field: 'insurance',
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
    field: 'statusAndFunctional',
    label: t('formDemo.statusAndFunctional'),
    component: 'Divider'
  },
  {
    field: 'status',
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
    title: t('formDemo.productInfomation'),
    columns: schema,
    api: undefined,
    buttonAdd: '',
    buttons: 1
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
        <TableOperator
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
::v-deep(.el-checkbox-group) {
  display: flex;
}
</style>
