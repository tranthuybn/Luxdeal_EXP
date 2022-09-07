<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { TableOperator } from '../../Components/TableBase'
import { useRouter } from 'vue-router'
const { t } = useI18n()

const schema = reactive<FormSchema[]>([
  {
    field: 'field7',
    label: t('Thông tin chung dịch vụ'),
    component: 'Divider'
  },
  {
    field: 'field1',
    label: t('Mã dịch vụ'),
    component: 'Input',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: 'Nhập mã dịch vụ'
    }
  },
  {
    field: 'field2',
    label: t('Tên dịch vụ'),
    component: 'Input',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: 'Nhập tên dịch vụ'
    }
  },
  {
    field: 'field3',
    label: t('Mô tả ngắn'),
    component: 'Input',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: 'Nhập mô tả'
    }
  },
  {
    field: 'fied4',
    label: 'Mô tả',
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
    label: t('Giá dịch vụ và thời gian thực hiện'),
    component: 'Divider'
  },
  {
    field: 'field4',
    label: t('Đơn giá dịch vụ'),
    component: 'Input',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: 'Nhập giá'
    }
  },
  {
    field: 'field5',
    label: t('Giá khuyến mãi'),
    component: 'Input',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: 'Nhập giá'
    }
  },
  {
    field: 'field61',
    label: t('Thời gian thực hiện'),
    component: 'Input',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: 'Nhập số giờ'
    }
  },
  {
    field: 'field7',
    label: t('Bảo hành'),
    component: 'Input',
    colProps: {
      span: 18
    },
    componentProps: {
      placeholder: 'Nhập số ngày'
    }
  },
  {
    field: 'field8',
    label: t('Trạng thái & chức năng'),
    component: 'Divider'
  },
  {
    field: 'field42',
    label: t('Trạng thái'),
    component: 'Checkbox',
    value: [],
    componentProps: {
      options: [
        {
          label: 'Chờ duyệt',
          value: 'wating'
        },
        {
          label: 'Đang hoạt động',
          value: 'active'
        },
        {
          label: 'Tạm dừng hoạt động',
          value: 'stop'
        }
      ]
    }
  }
])
const router = useRouter()
const currentRoute = String(router.currentRoute.value.params.backRoute)
const title = 'Thông tin dich vụ'
</script>

<template>
  <div class="wrapper">
    <el-scrollbar height="800px">
      <TableOperator :schema="schema" :nameBack="currentRoute" :title="title" />
    </el-scrollbar>
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
