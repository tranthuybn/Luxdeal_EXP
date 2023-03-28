import { ElMessageBox } from "element-plus"
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

export const confirmDialog = async (message) =>{
    return ElMessageBox.confirm(
        t(message),
        t('reuse.warning'),
        {
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            type: 'warning',
        }
    )
        .then(() => {
            return true
        })
        .catch(() => {
            return false
        })
}