<script lang="ts">
import { reactive, ref } from 'vue'
import type { 
    FormInstance, 
    FormRules,
    ElCollapse,
  ElCollapseItem,
  ElUpload,
  ElSelect,
  ElOption,
  ElCheckbox,
  ElButton,
  ElDivider,
  ElTable,
  ElTableColumn,
  ElInput,
  ElDialog,
  ElForm,
 } from 'element-plus'

 const ruleForm = reactive({
  name: 'Hello',
  region: '',
  count: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})

</script>
<template>
    <div>
        <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
    :size="formSize"
    status-icon>
    <el-form-item label="Activity name" prop="name">
      <el-input v-model="ruleForm.name" />
    </el-form-item>


    </el-form>
    </div>
</template>








<style scoped>
</style>
<style lang='scss' scoped>
</style>