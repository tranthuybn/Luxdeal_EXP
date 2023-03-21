import {
      getBranchList,
} from '@/api/HumanResourceManagement'
import {ElMessage} from 'element-plus'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

export const callAPIBranchList = async () => {
    const res: any =  await getBranchList()
    if (res) {
        return res.data.map((branchs) => ({ text: branchs.name, value: branchs.id }))
    } else {
      ElMessage({
        message: t('reuse.cantGetData'),
        type: 'error'
      })
      return
    }
}

export const departmentList = []