<script setup lang="ts">
import { TransactionStatusHistory } from './OrderFixbug';
import { PropType } from 'vue-types/dist/types';
import { dateTimeFormat } from '@/utils/format';
import { useI18n } from '@/hooks/web/useI18n';

const { t } = useI18n()

defineProps({
    statusAccountingEntry: {
        type: Array as PropType<TransactionStatusHistory[]>,
        default: () => []
    }
})

const renderClassStatus = (status) =>{
    if(status == 1)
    {
        return 'box_2'//blue
    }
    if(status == 0)
    {
        return 'box_4'//red
    }
    else{
        return ''
    }
}
</script>
<template>
        <div class="flex gap-4 pt-2 pb-4">
            <label class="w-[30%] text-right">{{ t('formDemo.status') }}</label>
            <div class="w-[100%]">
              <div class="flex items-center w-[100%] flex-wrap">
                <div
                  class="duplicate-status"
                  v-for="item in statusAccountingEntry"
                  :key="item.transactionStatus"
                >
                <div>
                    <span
                        class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-black dark:bg-transparent"
                        ></span>
                    <span :class="[{active: item.isActive}, renderClassStatus(item.transactionStatus)]">
                        {{ item.transactionStatusName }} <span class="right"> </span>
                    </span>
                    <p v-if="item.createdAt">{{
                      item.createdAt ? dateTimeFormat(item.createdAt) : ''
                    }}</p>
                    <p v-else class="text-transparent">''</p>
                </div>
                </div>
              </div>
          </div>
          </div>
</template>
<style lang="scss" scoped>
@import '@/styles/statusHistory.scss';
</style>