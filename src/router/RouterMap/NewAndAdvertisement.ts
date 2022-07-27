import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
export default {
  path: '/new-and-advertisement',
  component: Layout,
  redirect: { name: 'new-and-advertisement.new-and-advertisement-list' },
  name: 'New-and-advertisement',
  meta: {
    title: t('router.newsAndAdvertisement'),
    icon: 'arcticons:social',
    alwaysShow: true
  },
  children: [
    {
      path: 'new-and-advertisement-list',
      component: () => import('@/views/Pages/NewsAndAdvertisement/index.vue'),
      name: 'New-and-advertisement.new-and-advertisement-list',
      meta: {
        title: t('router.newsAndAdvertisement')
      }
    }
  ]
}
