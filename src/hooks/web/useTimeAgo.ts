import { useTimeAgo as useTimeAgoCore, UseTimeAgoMessages } from '@vueuse/core'
import { computed, unref } from 'vue'
import { useLocaleStoreWithOut } from '@/store/modules/locale'

const TIME_AGO_MESSAGE_MAP: {
  vi: UseTimeAgoMessages
  en: UseTimeAgoMessages
} = {
  vi: {
    justNow: '刚刚',
    past: (n) => (n.match(/\d/) ? `${n} trước` : n),
    future: (n) => (n.match(/\d/) ? `${n} sau` : n),
    month: (n, past) => (n === 1 ? (past ? 'tháng trước' : 'tháng sau') : `tháng ${n} `),
    year: (n, past) => (n === 1 ? (past ? 'năm trước' : 'năm sau') : `năm ${n}`),
    day: (n, past) => (n === 1 ? (past ? 'hôm qua' : 'ngày mai') : `ngày ${n}`),
    week: (n, past) => (n === 1 ? (past ? 'tuần trước' : 'tuần sau') : `tuần ${n} `),
    hour: (n) => `${n} giờ`,
    minute: (n) => `${n} phút`,
    second: (n) => `${n} giây`
  },
  en: {
    justNow: '刚刚',
    past: (n) => (n.match(/\d/) ? `${n} ago` : n),
    future: (n) => (n.match(/\d/) ? `in ${n}` : n),
    month: (n, past) =>
      n === 1 ? (past ? 'last month' : 'next month') : `${n} month${n > 1 ? 's' : ''}`,
    year: (n, past) =>
      n === 1 ? (past ? 'last year' : 'next year') : `${n} year${n > 1 ? 's' : ''}`,
    day: (n, past) => (n === 1 ? (past ? 'yesterday' : 'tomorrow') : `${n} day${n > 1 ? 's' : ''}`),
    week: (n, past) =>
      n === 1 ? (past ? 'last week' : 'next week') : `${n} week${n > 1 ? 's' : ''}`,
    hour: (n) => `${n} hour${n > 1 ? 's' : ''}`,
    minute: (n) => `${n} minute${n > 1 ? 's' : ''}`,
    second: (n) => `${n} second${n > 1 ? 's' : ''}`
  }
}

export const useTimeAgo = (time: Date | number | string) => {
  const localeStore = useLocaleStoreWithOut()

  const currentLocale = computed(() => localeStore.getCurrentLocale)

  const timeAgo = useTimeAgoCore(time, {
    messages: TIME_AGO_MESSAGE_MAP[unref(currentLocale).lang]
  })

  return timeAgo
}
