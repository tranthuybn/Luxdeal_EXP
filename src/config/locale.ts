import { useCache } from '@/hooks/web/useCache'
import en from 'element-plus/es/locale/lang/en'
import vi from 'element-plus/es/locale/lang/vi'

const { wsCache } = useCache()

export const elLocaleMap = {
  en: en,
  vi: vi
}
export interface LocaleState {
  currentLocale: LocaleDropdownType
  localeMap: LocaleDropdownType[]
}

export const localeModules: LocaleState = {
  currentLocale: {
    lang: wsCache.get('lang') || 'vi',
    elLocale: elLocaleMap[wsCache.get('lang') || 'vi']
  },
  // multi-language
  localeMap: [
    {
      lang: 'vi',
      name: 'Vietnamese'
    },
    {
      lang: 'en',
      name: 'English'
    }
  ],
}
