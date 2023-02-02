span<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import {
  ElCollapse,
  ElCollapseItem,
  ElSelect,
  ElOption,
  ElButton,
  ElDivider,
  ElTable,
  ElTableColumn,
  ElInput,
  ElForm,
  ElFormItem,
  ElDatePicker,
  // ElRow
} from 'element-plus'
import { reactive, ref, watch } from 'vue'; 
import { dateTimeFormat } from '@/utils/format';
import { useIcon } from '@/hooks/web/useIcon'
import { Collapse } from '../../Components/Type'
// import { placeholder } from '@babel/types';
// const { currentRoute } = useRouter()
const { t } = useI18n()

const plusIcon = useIcon({ icon: 'akar-icons:plus' })
const minusIcon = useIcon({ icon: 'akar-icons:minus' })

const collapse: Array<Collapse> = [
  {
    icon: minusIcon,
    name: 'generalInformation',
    title: t('formDemo.paymentrequestinformation'),
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
  },
  {
    icon: plusIcon,
    name: 'productAndPayment',
    title: t('formDemo.detailedlistofexpenses'),
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
  } else {
    collapse.forEach((el) => {
      el.icon = plusIcon
    })
  }
}
const activeName = ref([collapse[0].name, collapse[1].name])

const form = reactive({
  code: 'MH123',
  date: new Date(),
  region: '',
  text: '',
  MaDH: 'BH3435',
  text2:''
})
const tableData = ref([
  {
    stt: '/Nhập tay/',
    sct: '',
    date: new Date(),
    content: '',
    quanti: '',
    price: '',
    total: '',
    note: '',
  }
 
])

const deleteRow = (index: number) => {
  tableData.value.splice(index, 1)
}
// const input = ref('')

const onAddItem = () => {
  tableData.value.push({    
    stt: '',
    sct: '',
    date: new Date(),
    content: '',
    quanti: '',
    price: '',
    total: '',
    note: ''
  })
}
watch(
  () => tableData.value[tableData.value.length - 1],
  () => {
    if (
      tableData.value[tableData.value.length - 1].sct &&
      tableData.value[tableData.value.length - 1].date &&
      tableData.value[tableData.value.length - 1].content &&
      tableData.value[tableData.value.length - 1].quanti &&
      tableData.value[tableData.value.length - 1].price &&
      tableData.value[tableData.value.length - 1].total
    )
    onAddItem()
  },
  {
    deep: true
  }
)

const depositPrice = ref(0)
</script>
<template>
  <el-collapse
      v-model="activeName"
      @change="collapseChangeEvent"
      :class="[
        'bg-[var(--el-color-white)] dark:(bg-[var(--el-color-black)] border-[var(--el-border-color)] border-1px)'
      ]"
    >
      <el-collapse-item :name="collapse[0].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[0].icon" link />
          <span class="text-center text-xl">{{ collapse[0].title }}</span>
        </template>
        <div class="flex gap-4 bg-white">
    <div class="flex-1">
      <el-divider content-position="left">Thông tin đề nghị thanh toán</el-divider>
      <el-form :model="form" label-width="160px">
          <el-form-item label="Mã phiếu">
            <div>{{ form.code }}</div>
          </el-form-item>
          <el-form-item label="Ngày tạo">
            <div>{{ dateTimeFormat(form.date) }}</div>
          </el-form-item>
        <el-form-item
label="Người yêu cầu" :rules="[
        { required: true, message: 'Chọn dữ liệu' },
        { type: 'string', message: 'Chọn giá trị' },
         ]">
          <el-select class="w-[100%]" v-model="form.region" placeholder="Lấy tk đang tạo phiếu">
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="Lý do chi tiền" prop="name" :rules="[
        { required: true, message: 'Nhập mô tả' },
        { type: 'number', message: 'Chuỗi string' },
         ]">
          <el-input v-model="form.text" placeholder="Nhập mô tả" />
        </el-form-item>
  </el-form>
  <el-divider content-position="left">Đối tượng</el-divider>
  <el-form :model="form" label-width="160px">
    <el-form-item label="Chọn đối tượng" prop="name">
      <el-select class="w-[100%]" v-model="form.text2" placeholder="chọn đối tượng">
            <el-option label="Nguyễn Văn Trường" value="one" />
            <el-option label="Nguyễn Phong Linh" value="two" />
          </el-select>
      </el-form-item>
  </el-form>
    </div>
    <div class="flex-1">
      <el-divider content-position="left">Chứng từ kèm theo</el-divider>
      <div class="">Mã đơn hàng {{ form.MaDH }}</div>
    </div>

  </div>
      </el-collapse-item>

      <el-collapse-item :name="collapse[1].name">
        <template #title>
          <el-button class="header-icon" :icon="collapse[1].icon" link />
          <span class="text-center text-xl">{{ collapse[1].title }}</span>
        </template>



        <el-table :data="tableData" border style="width: 100%">
          <el-table-column type="index" label="STT" width="180" />
          <el-table-column prop="sct" label="Số chứng từ" width="180" >
            <template #default="props">
            <el-input  v-model="props.row.sct"/>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="Ngày chứng từ" >
            <template #default="props">
            <el-date-picker
              v-model="props.row.date"
              type="date"
              placeholder="Pick a day"
              format="DD/MM/YYYY"
            />
          </template>
          </el-table-column>
          <el-table-column prop="content" label="Nội dung chi" >
            <template #default="props">
              <el-input v-model="props.row.content" />
            </template>
          </el-table-column>
          <el-table-column prop="quanti" label="Số lượng" >
            <template #default="props">
            <el-input v-model="props.row.quanti" />
          </template>
          </el-table-column>
          <el-table-column prop="price" label="Đơn giá" >
            <template #default="props">
            <el-input v-model="props.row.price" />
            </template>
          </el-table-column>
          <el-table-column prop="total" label="Thành tiền" >
            <template #default="props">
            <el-input v-model="props.row.total" />
            </template>
          </el-table-column>
          <el-table-column prop="note" label="Ghi chú" >
            <template #default="props">
            <el-input v-model="props.row.note" />
            </template>            
          </el-table-column>
          <el-table-column label="Thao Tác" >
            <template #default="scope">
            <el-button
                size="small"
                type="danger"
                
                @click.prevent="deleteRow(scope.$index)"
                >Xóa</el-button>
              </template>
          </el-table-column>
        </el-table>

  <div class="flex justify-end">
  <div class="total flex flex-col w-[680px]">

    <div class="flex gap-4">
      <label class="w-[10%] text-right font-bold">Tổng tiền</label>
      <span class="w-[170px] text-right">10000 đ</span>
    </div>
    <div class="flex gap-4">
      <label class="w-[10%] text-right">Đặt cọc</label>
      <span class="w-[170px] text-right">
        <el-input class="poi_text_right" v-model="depositPrice" />
      </span>
    </div>
    <div class="flex gap-4">
      <label class="w-[10%] text-right">Còn lại</label>
      <span class="w-[170px] text-right">10000 đ</span>
    </div>
  </div>
</div>

  <el-divider content-position="left">Thông tin thanh toán</el-divider>
  <el-form :model="form" label-width="160px">
  <el-form-item 
          label="Số tiền chi" prop="name" :rules="[
        { required: true, message: 'Nhập số tiền' },
        { type: 'number', message: 'Nhập số tiền' },
   
         ]">
          <el-input v-model="form.text" placeholder="Nhập số tiền" />
        </el-form-item>
        <el-form-item
          label="Viết bằng chữ" prop="name" :rules="[
        { required: true, message: 'Nhập chữ' },
        { type: 'string', message: 'Nhập chữ' },
   
         ]">
          <el-input v-model="form.text" placeholder="Viết bằng chữ" />
        </el-form-item>
        <el-form-item
        label="Hình thức thanh toán" :rules="[
        { required: true, message: 'Viết bằng chữ' },
        { type: 'string', message: 'Viết bằng chữ' },
         ]">
          <el-select class="w-[100%]" v-model="form.region" placeholder="Thanh toán tiền mặt">
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="Trạng thái">
          <p>Khởi tạo & ghi số</p>
        </el-form-item>
        <el-form-item >
          <el-button>In phiếu</el-button>
          <el-button type="primary">Lưu và chờ duyệt</el-button>
          <el-button type="danger">Hủy</el-button>
        </el-form-item>
      </el-form>
</el-collapse-item>
</el-collapse>
</template>  
<style scoped>
.requied{
  color: red;
}
::v-deep(.el-select){
  width: 100%;
}
::v-deep(.poi_text_right > .el-input__wrapper > .el-input__inner){
  text-align: right;
}
</style>