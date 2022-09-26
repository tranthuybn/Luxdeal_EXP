<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Collapse } from '../../Components/Type'
import { useIcon } from '@/hooks/web/useIcon'
import { Form } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import { ElCollapse, ElCollapseItem, UploadFile } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
const { t } = useI18n()

const schema = reactive<FormSchema[]>([
  {
    field: 'orderInformation',
    label: 'thông tin chung',
    component: 'Divider',
    colProps: {
      span: 12
    }
  },
  {
    field: 'discountCode',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'promotion',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'duration',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'desc',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: 'mô tả'
    }
  }
])

const { register } = useForm()

const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })

const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'generalInformation',
    title: 'Chi tiết chương trình flash sale',
    columns: [],
    api: undefined,
    buttonAdd: '',
    typeForm: 'form',
    typeButton: 'form01',
    expand: false,
    apiTableChild: undefined,
    columnsTableChild: undefined,
    pagination: false,
    removeHeaderFilter: true,
    removeDrawer: true,
    selection: false,
    customOperator: 3
  }
]

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
const activeName = ref(collapse[0].name)

const discountCode = ref('FS3452323')
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
const handleRemove = (file: UploadFile) => {
  console.log(file)
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const handleDownload = (file: UploadFile) => {
  console.log(file)
}
</script>

<template>
  <div class="demo-collapse dark:bg-[#141414]">
    <el-collapse v-model="activeName" @change="collapseChangeEvent">
      <el-collapse-item :name="collapse[0].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[0].icon" link />
          <span class="text-center text-xl">{{ collapse[0].title }}</span>
        </template>

        <div class="flex w-[100%] gap-6">
          <div class="w-[50%]">
            <Form
              :schema="schema"
              label-position="top"
              hide-required-asterisk
              size="large"
              class="flex border-1 border-[var(--el-border-color)] border-none rounded-3xl box-shadow-blue bg-white dark:bg-[#141414]"
              @register="register"
            >
              <template #discountCode>
                <div class="discountCode">
                  <p
                    >Mã chương trình Flash sale <strong>{{ discountCode }}</strong></p
                  >
                </div>
              </template>
              <template #promotion>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[15%] leading-5 text-right" for=""
                    >Khuyễn mại <span style="color: red">*</span>
                  </label>

                  <div class="flex w-[80%] gap-2">
                    <input
                      class="w-[50%] border-1 outline-none pl-2"
                      type="text"
                      :placeholder="`Giảm theo %`"
                    />
                    <input
                      class="w-[50%] border-1 outline-none pl-2"
                      type="text"
                      :placeholder="`nhập số %`"
                    />
                  </div>
                </div>
              </template>
              <template #duration>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[15%] leading-5 text-right" for=""
                    >Thời hạn <span style="color: red">*</span>
                  </label>

                  <div class="flex w-[80%] gap-2">
                    <input
                      class="w-[50%] border-1 outline-none pl-2"
                      type="text"
                      :placeholder="`${t('reuse.startDate')}`"
                    />
                    <input
                      class="w-[50%] border-1 outline-none pl-2"
                      type="text"
                      :placeholder="`${t('reuse.endDate')}`"
                    />
                  </div>
                </div>
              </template>
              <template #desc>
                <div class="flex items-center w-[100%] gap-4">
                  <label class="w-[15%] text-right leading-5" for=""
                    >Mô tả ngắn<span style="color: red">*</span>
                  </label>
                  <input
                    class="w-[80%] border-1 outline-none pl-2"
                    type="text"
                    :placeholder="`nhập mô tả ngắn`"
                  />
                </div>
              </template>
            </Form>
          </div>
          <div class="w-[50%]">
            <div class="text-sm text-[#303133] font-medium p pl-4 dark:text-[#fff]">
              <el-divider content-position="left">hình ảnh</el-divider>
              <div class="flex">
                <div class="pl-4"> Thêm ảnh </div>
              </div>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped>
::v-deep(.el-select) {
  width: 100%;
}

::v-deep(.el-textarea__inner) {
  box-shadow: none;
  padding: 5px 0;
}

::v-deep(.el-form-item) {
  display: flex;
  align-items: center;
}

::v-deep(.el-upload--picture-card) {
  width: 160px;
  height: 40px;
  border: 1px solid #409eff;
}

::v-deep(.d-block > .el-row) {
  display: block;
}

::v-deep(.el-form-item__content) {
  display: block;
}

@media only screen and (min-width: 1920px) {
  ::v-deep(.el-col-xl-12) {
    max-width: 100%;
  }
}

::v-deep(label) {
  color: #828387;
}

::v-deep(.cell) {
  color: #303133;
}

::v-deep(.el-divider__text) {
  font-size: 16px;
}
</style>
