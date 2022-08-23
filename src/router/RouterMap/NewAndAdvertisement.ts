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
      path: 'notify',
      component: () => import('@/views/Pages/NewsAndAdvertisement/Notify.vue'),
      name: 'New-and-advertisement.notify',
      meta: {
        title: t('router.notify')
      }
    },
    {
      path: 'forum',
      component: () => import('@/views/Pages/NewsAndAdvertisement/Forum.vue'),
      name: 'New-and-advertisement.forum',
      meta: {
        title: t('router.forum')
      }
    },
    {
      path: 'news-site',
      component: () => import('@/views/Pages/NewsAndAdvertisement/NewsSites.vue'),
      name: 'New-and-advertisement.news-site',
      meta: {
        title: t('router.newsSite')
      }
    },
    {
      path: 'banner-advertisement',
      component: () => import('@/views/Pages/NewsAndAdvertisement/BannerAdvertisement.vue'),
      name: 'New-and-advertisement.banner-advertisement',
      meta: {
        title: t('router.bannerAdvertisement')
      }
    },
    {
      path: 'profile-admin',
      name: 'New-and-advertisement.profile-admin',
      redirect: { name: 'New-and-advertisement.profile-admin.policies-guidelines' },
      meta: {
        title: t('router.profileAdmin')
      },
      children: [
        {
          path: 'policies-guidelines',
          component: () =>
            import('@/views/Pages/NewsAndAdvertisement/ProfileAdmin/PoliciesGuidelines.vue'),
          name: 'New-and-advertisement.profile-admin.policies-guidelines',
          meta: {
            title: t('router.policiesGuidelines')
          }
        },
        {
          path: 'about-us',
          component: () => import('@/views/Pages/NewsAndAdvertisement/ProfileAdmin/AboutUs.vue'),
          name: 'New-and-advertisement.profile-admin.about-us',
          meta: {
            title: t('router.aboutUs')
          }
        },
        {
          path: 'contact',
          component: () => import('@/views/Pages/NewsAndAdvertisement/ProfileAdmin/Contact.vue'),
          name: 'New-and-advertisement.profile-admin.contact',
          meta: {
            title: t('reuse.contact')
          }
        },
        {
          path: 'transaction-point',
          component: () =>
            import('@/views/Pages/NewsAndAdvertisement/ProfileAdmin/TransactionPoint.vue'),
          name: 'New-and-advertisement.profile-admin.transaction-point',
          meta: {
            title: t('router.transactionPoint')
          }
        }
      ]
    }
  ]
}
