import { ProhibitSetUser } from '@/services/api/appManager.js'
export default {
  methods: {
    prohibitToPost(id, obj) {
      const loading = this.$loading({ lock: true })
      ProhibitSetUser({ Id: id, Email: obj.email, Phone: obj.phone })
        .then((res) => {
          const { data } = res.data
          if (res.data.statusCode === 200 && data) {
            this.$base_notify(
              !data?.valid ? 'success' : 'error',
              data?.message ?? 'Thiết lập trạng thái đăng bài thành công'
            )
            obj.isPostProhibit = data?.valid
          } else
            this.$base_notify('error', data?.message ?? 'Thiết lập trạng thái đăng bài thất bại')
        })
        .catch((err) => {
          console.error(err)
          this.$base_notify('error', 'Lỗi hệ thống')
        })
        .finally(() => {
          loading.close()
        })
    }
  }
}
