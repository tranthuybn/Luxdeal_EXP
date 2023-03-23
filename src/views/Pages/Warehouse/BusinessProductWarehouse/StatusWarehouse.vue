<script setup lang="ts">
import { PropType } from 'vue'
import { TicketStatusHistory} from "./TicketEnum"
import { dateTimeFormat } from '@/utils/format'


type Status = {
  approveAt?: string
  name: string
  value: number
  isActive?: boolean
}

defineProps({
    arrayStatusWH: {
      type: Array as PropType<Status[]>,
      required: true,
      default: () => []
    },
    label:{
        type: String,
        default: ''
    }
})

const renderClassStatus = (status) =>{
    if(status == TicketStatusHistory.NewCreate){
        return 'box_3'//gray
    }
    if(status == TicketStatusHistory.Approve){
        return 'box_1'//yellow
    }
    if(status == TicketStatusHistory.Exported ||
        status == TicketStatusHistory.Depositing ||
        status == TicketStatusHistory.Imported ||
        status == TicketStatusHistory.Transferred)
    {
        return 'box_2'//blue
    }
    if(status == TicketStatusHistory.CancelExport || 
        status == TicketStatusHistory.CancelImport || 
        status == TicketStatusHistory.CancelTransfer)
    {
        return 'box_4'//red
    }
    else{
        return ''
    }
}
</script>

<template>
          <div class="flex gap-4 w-[100%] ml-1 pb-3 mb-2">
          <label class="ml-10" style="word-break: break-word">{{ label }}</label>
          <div class="w-[75%]">
          <div class="flex items-center w-[100%] flex-wrap">
            <div
              class="duplicate-status"
              v-for="item in arrayStatusWH"
              :key="item.value"
            >
                <div>
                    <span
                        class="triangle-left border-solid border-b-12 border-t-12 border-l-10 border-t-transparent border-b-transparent border-l-white dark:border-l-black dark:bg-transparent"
                        ></span>
                    <span :class="[{active: item.isActive}, renderClassStatus(item.value)]">
                        {{ item.name }} <span class="right"> </span>
                    </span>
                    <p v-if="item?.approveAt">{{
                    item?.approveAt ? dateTimeFormat(item?.approveAt) : ''
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