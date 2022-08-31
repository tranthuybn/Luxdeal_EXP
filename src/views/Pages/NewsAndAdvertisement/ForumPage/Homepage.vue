<script setup lang="ts">
import { ElRow, ElCol, ElCard, ElTabs, ElTabPane, ElCheckbox, ElPopover } from 'element-plus'
import { ref } from 'vue'
import CarouselComponent from './carousel.vue'
const sliders = [
  'https://api.cooftech.net/PostsImages\\637829583833908676_fpLD6o.jpg',
  'https://api.cooftech.net/PostsImages\\637829583834658748_4665561.jpg',
  'https://api.cooftech.net/PostsImages\\637829583835486538_car_2.jpg'
]
const formInfo = {
  value: {
    name: 'Forum Khách Hàng',
    description: 'Nơi giao lưu kết nối của các tín đồ hàng hiệu',
    id: 1
  }
}
let activeName = ref('first')
let listActive = ref(true)
const social = '/img/GlobeHemisphereWest.8d0f5605.svg'
const handleClick = (tab) => {
  activeName.value = tab.name
  listActive.value = activeName.value == 'first'
  //getPostForum()
}
const userInfo = {
  id: 'fd83c99a-44a4-4756-baaa-a5a9d26f7bda',
  idNhanVien: '5854d17e-9379-4b67-aa52-80116f956934',
  idSalon: null,
  idTechnician: null,
  userName: 'admin',
  cityId: null,
  districtId: null,
  streetId: null,
  wardId: null,
  address: null,
  email: null,
  fullName: 'Thanh Hà',
  avatar: null,
  phoneNumber: null,
  birthday: null,
  permission: {
    id: '67793ba1-6d09-4043-b840-258c3b78731c',
    idUser: 'fd83c99a-44a4-4756-baaa-a5a9d26f7bda',
    permission: '[{"Role":"Admin","RoleClaim":[]}]',
    roomLock: null,
    isDeleted: false
  }
}
const baseUrl = 'https://api.cooftech.net/'
const openPostNewsDialog = () => {
  console.log('this open post dialog')
}
const posts = [
  {
    userName: '0971425768',
    fullName: '0971425768',
    content: 'tin hit',
    avatar: null,
    timeAgo: '132 ngày trước',
    imagePosts: [],
    isUserLiked: true,
    createAt: '2022-04-21T12:24:55.743',
    totalLike: 1,
    userId: 210,
    totalComment: 0,
    isPostProhibit: false,
    email: 'vinh@gmail.con',
    phone: '0971425768',
    comments: [],
    tags: [{ postId: 2071, id: 1, name: 'Hàng Authentic' }],
    id: 2071
  },
  {
    userName: 'admin',
    fullName: 'admin',
    content: 'Lamborghini',
    avatar: null,
    timeAgo: '148 ngày trước',
    imagePosts: [
      { postId: 1088, imageId: 1458, imagePath: 'PostsImages\\637847560936862582_car_3.jpg' }
    ],
    isUserLiked: true,
    createAt: '2022-04-05T11:48:12.45',
    totalLike: 1,
    userId: 207,
    totalComment: 0,
    isPostProhibit: false,
    email: 'NoahKhalifa1781310207@gmail.com',
    phone: null,
    comments: [],
    tags: [{ postId: 1088, id: 1, name: 'Hàng Authentic' }],
    id: 1088
  },
  {
    userName: 'admin',
    fullName: 'admin',
    content: 'bugati',
    avatar: null,
    timeAgo: '148 ngày trước',
    imagePosts: [
      { postId: 1087, imageId: 1457, imagePath: 'PostsImages\\637847557518154766_car_5.jpg' }
    ],
    isUserLiked: true,
    createAt: '2022-04-05T11:42:31.767',
    totalLike: 1,
    userId: 207,
    totalComment: 1,
    isPostProhibit: false,
    email: 'NoahKhalifa1781310207@gmail.com',
    phone: null,
    comments: [
      {
        postId: 1087,
        content: 'giá bán lẻ',
        createAt: '2022-04-28T13:48:14.3',
        userAccount: '0987654325',
        userFullName: 'LangVi',
        is_Deleted: false,
        parentId: 0,
        commentId: 10068,
        avatar: ''
      }
    ],
    tags: [
      { postId: 1087, id: 1, name: 'Hàng Authentic' },
      { postId: 1087, id: 3, name: 'Trang sức' }
    ],
    id: 1087
  },
  {
    userName: 'admin',
    fullName: 'admin',
    content: 'maserati',
    avatar: null,
    timeAgo: '148 ngày trước',
    imagePosts: [
      { postId: 1086, imageId: 1456, imagePath: 'PostsImages\\637847553153917630_WLRzuf.jpg' }
    ],
    isUserLiked: true,
    createAt: '2022-04-05T11:35:14.173',
    totalLike: 1,
    userId: 207,
    totalComment: 0,
    isPostProhibit: false,
    email: 'NoahKhalifa1781310207@gmail.com',
    phone: null,
    comments: [],
    tags: [
      { postId: 1086, id: 1, name: 'Hàng Authentic' },
      { postId: 1086, id: 2, name: 'Giày Sneaker' }
    ],
    id: 1086
  },
  {
    userName: 'admin',
    fullName: 'admin',
    content: 'chevolet',
    avatar: null,
    timeAgo: '148 ngày trước',
    imagePosts: [
      { postId: 1085, imageId: 1455, imagePath: 'PostsImages\\637847542797692026_4665561.jpg' }
    ],
    isUserLiked: false,
    createAt: '2022-04-05T11:17:58.57',
    totalLike: 0,
    userId: 207,
    totalComment: 0,
    isPostProhibit: false,
    email: 'NoahKhalifa1781310207@gmail.com',
    phone: null,
    comments: [],
    tags: [
      { postId: 1085, id: 3, name: 'Trang sức' },
      { postId: 1085, id: 2, name: 'Giày Sneaker' }
    ],
    id: 1085
  },
  {
    userName: 'admin',
    fullName: 'admin',
    content: 'ferrari',
    avatar: null,
    timeAgo: '148 ngày trước',
    imagePosts: [
      { postId: 1084, imageId: 1454, imagePath: 'PostsImages\\637847541815059035_jvw2Xk.jpg' }
    ],
    isUserLiked: false,
    createAt: '2022-04-05T11:16:20.307',
    totalLike: 0,
    userId: 207,
    totalComment: 0,
    isPostProhibit: false,
    email: 'NoahKhalifa1781310207@gmail.com',
    phone: null,
    comments: [],
    tags: [
      { postId: 1084, id: 2, name: 'Giày Sneaker' },
      { postId: 1084, id: 3, name: 'Trang sức' }
    ],
    id: 1084
  },
  {
    userName: 'admin',
    fullName: 'admin',
    content: 'xe bugati',
    avatar: null,
    timeAgo: '148 ngày trước',
    imagePosts: [
      { postId: 1083, imageId: 1453, imagePath: 'PostsImages\\637847536493357554_car_5.jpg' }
    ],
    isUserLiked: false,
    createAt: '2022-04-05T11:07:28.147',
    totalLike: 0,
    userId: 207,
    totalComment: 0,
    isPostProhibit: false,
    email: 'NoahKhalifa1781310207@gmail.com',
    phone: null,
    comments: [],
    tags: [
      { postId: 1083, id: 2, name: 'Giày Sneaker' },
      { postId: 1083, id: 1, name: 'Hàng Authentic' }
    ],
    id: 1083
  },
  {
    userName: 'admin',
    fullName: 'admin',
    content: 'noi dung test',
    avatar: null,
    timeAgo: '148 ngày trước',
    imagePosts: [
      { postId: 1082, imageId: 1450, imagePath: 'PostsImages\\637847516811315724_fpLD6o.jpg' },
      { postId: 1082, imageId: 1451, imagePath: 'PostsImages\\637847516812665210_4665561.jpg' },
      { postId: 1082, imageId: 1452, imagePath: 'PostsImages\\637847516813303888_4665585.jpg' }
    ],
    isUserLiked: false,
    createAt: '2022-04-05T10:34:39.973',
    totalLike: 0,
    userId: 207,
    totalComment: 0,
    isPostProhibit: false,
    email: 'NoahKhalifa1781310207@gmail.com',
    phone: null,
    comments: [],
    tags: [
      { postId: 1082, id: 1, name: 'Hàng Authentic' },
      { postId: 1082, id: 2, name: 'Giày Sneaker' },
      { postId: 1082, id: 3, name: 'Trang sức' }
    ],
    id: 1082
  },
  {
    userName: 'admin',
    fullName: 'admin',
    content: 'Noah khalifa',
    avatar: null,
    timeAgo: '148 ngày trước',
    imagePosts: [
      { postId: 1081, imageId: 1448, imagePath: 'PostsImages\\637847513103090078_jvw2Xk.jpg' },
      { postId: 1081, imageId: 1449, imagePath: 'PostsImages\\637847513106125756_car_2.jpg' }
    ],
    isUserLiked: false,
    createAt: '2022-04-05T10:28:29.153',
    totalLike: 0,
    userId: 207,
    totalComment: 0,
    isPostProhibit: false,
    email: 'NoahKhalifa1781310207@gmail.com',
    phone: null,
    comments: [],
    tags: [
      { postId: 1081, id: 2, name: 'Giày Sneaker' },
      { postId: 1081, id: 1, name: 'Hàng Authentic' },
      { postId: 1081, id: 3, name: 'Trang sức' },
      { postId: 1081, id: 4, name: 'Đồng hồ' }
    ],
    id: 1081
  },
  {
    userName: 'admin',
    fullName: 'admin',
    content: 'Noah khalifa',
    avatar: null,
    timeAgo: '148 ngày trước',
    imagePosts: [
      { postId: 1080, imageId: 1446, imagePath: 'PostsImages\\637847511715361952_jvw2Xk.jpg' },
      { postId: 1080, imageId: 1447, imagePath: 'PostsImages\\637847511721519245_car_5.jpg' }
    ],
    isUserLiked: false,
    createAt: '2022-04-05T10:25:59.777',
    totalLike: 0,
    userId: 207,
    totalComment: 0,
    isPostProhibit: false,
    email: 'NoahKhalifa1781310207@gmail.com',
    phone: null,
    comments: [],
    tags: [
      { postId: 1080, id: 2, name: 'Giày Sneaker' },
      { postId: 1080, id: 3, name: 'Trang sức' },
      { postId: 1080, id: 4, name: 'Đồng hồ' }
    ],
    id: 1080
  }
]
const allPick = ref(false)
const actionAllPost = (type) => {
  if (!allPick.value) return false
  console.log(type)
  // if (type == 'approve') {
  //   posts.map((el) => {
  //     approvePost(el.id)
  //   })
  // }
  // if (type == 'cancel') {
  //   posts.map((el) => {
  //     cancelPost(el.id)
  //   })
  // }
}
const keyword = ref('')
const dataSearch = ref([{ id: 1, keyword: '' }])
const search = () => {
  const times = new Date().getTime()
  if (keyword.value) {
    dataSearch.value.push({ id: times, keyword: keyword.value })
  }
}
const removeSearch = (id) => {
  const indexById = dataSearch.value.findIndex((el) => el.id == id)
  dataSearch.value.splice(indexById, 1)
}
const members = [
  {
    fullName: null,
    accountName: null,
    avatar: null,
    id: 0,
    wallpaper: null,
    isPostProhibit: false,
    email: null,
    phone: null
  },
  {
    fullName: 'Ngô Tất Tố',
    accountName: 'ngo@gmail.com',
    avatar: 'UserAvatar\\637859618873354027_car_5.jpg',
    id: 2,
    wallpaper: null,
    isPostProhibit: false,
    email: 'ngo@gmail.com',
    phone: '0823456789'
  },
  {
    fullName: 'Thuy NV',
    accountName: null,
    avatar: null,
    id: 6,
    wallpaper: null,
    isPostProhibit: true,
    email: 'nguyenthuy220495@gmail.com',
    phone: '0355590686'
  },
  {
    fullName: 'Trần Tuấn Linh',
    accountName: 'Shearstabby',
    avatar: 'string',
    id: 13,
    wallpaper: null,
    isPostProhibit: true,
    email: 'abc.xyz@gmail.com',
    phone: '0912460231'
  },
  {
    fullName: 'Trần Tuấn Linh',
    accountName: 'Shearstabby12',
    avatar: 'UserAvatar\\637760581454011397.jpg',
    id: 14,
    wallpaper: null,
    isPostProhibit: false,
    email: 'abc.xyz12@gmail.com',
    phone: '0912460232'
  },
  {
    fullName: 'Trần Tuấn Linh',
    accountName: 'Shearstabby122',
    avatar: 'UserAvatar\\637760582385358791.jpg',
    id: 15,
    wallpaper: null,
    isPostProhibit: false,
    email: 'abc.xyz122@gmail.com',
    phone: '0912460233'
  },
  {
    fullName: 'Trần Tuấn Linh',
    accountName: 'Shearstabby124',
    avatar: 'UserAvatar\\637760589471093960.jpg',
    id: 16,
    wallpaper: null,
    isPostProhibit: false,
    email: 'abc.xyz123@gmail.com',
    phone: '0912460234'
  },
  {
    fullName: 'duc trinh',
    accountName: '0352528092',
    avatar: null,
    id: 118,
    wallpaper: null,
    isPostProhibit: false,
    email: 'duc@gmail.com',
    phone: '0352528092'
  },
  {
    fullName: '0901778086',
    accountName: '0901778086',
    avatar: null,
    id: 120,
    wallpaper: null,
    isPostProhibit: false,
    email: 'hieuck.nth@gmail.com',
    phone: '0901778086'
  },
  {
    fullName: 'binh nam',
    accountName: '0909111222',
    avatar: null,
    id: 121,
    wallpaper: null,
    isPostProhibit: false,
    email: 'bin@gmail.com',
    phone: '0909111222'
  },
  {
    fullName: 'Hoàng Dung',
    accountName: '0911111111',
    avatar: null,
    id: 122,
    wallpaper: null,
    isPostProhibit: false,
    email: 'hoangdung@gmail.com',
    phone: '0911111111'
  },
  {
    fullName: 'test1',
    accountName: '0911966900',
    avatar: null,
    id: 123,
    wallpaper: null,
    isPostProhibit: false,
    email: 'test1@cooftech.com',
    phone: '0911966900'
  },
  {
    fullName: '0948033770',
    accountName: '0948033770',
    avatar: null,
    id: 124,
    wallpaper: null,
    isPostProhibit: false,
    email: 'phamvietcuong108@gmail.com',
    phone: '0948033770'
  },
  {
    fullName: 'cuong',
    accountName: '0948033771',
    avatar: null,
    id: 125,
    wallpaper: null,
    isPostProhibit: false,
    email: 'hai@gmail.com',
    phone: '0948033771'
  },
  {
    fullName: 'cuong',
    accountName: '0948033777',
    avatar: null,
    id: 126,
    wallpaper: null,
    isPostProhibit: true,
    email: 'cuong2@yopmail.com',
    phone: '0948033777'
  },
  {
    fullName: 'cyong',
    accountName: '0948072147',
    avatar: null,
    id: 127,
    wallpaper: null,
    isPostProhibit: false,
    email: 'phamchong@gmail.com',
    phone: '0948072147'
  },
  {
    fullName: 'baoloc201222@gmail.com',
    accountName: 'baoloc201222@gmail.com',
    avatar: null,
    id: 136,
    wallpaper: null,
    isPostProhibit: false,
    email: 'baoloc201222@gmail.com',
    phone: '0901234567'
  },
  {
    fullName: 'ducdinhtrinh1@gmail.com',
    accountName: 'ducdinhtrinh1@gmail.com',
    avatar: null,
    id: 138,
    wallpaper: null,
    isPostProhibit: false,
    email: 'ducdinhtrinh1@gmail.com',
    phone: '09123456678'
  },
  {
    fullName: 'test name 2',
    accountName: 'trantrungsky6787@gmail.com',
    avatar: '',
    id: 141,
    wallpaper: null,
    isPostProhibit: false,
    email: 'test2@gmail.com',
    phone: '0967884557'
  },
  {
    fullName: 'test',
    accountName: 'test003',
    avatar: 'UserAvatar\\637771916924790696.jpg',
    id: 142,
    wallpaper: null,
    isPostProhibit: false,
    email: 'test@test.com',
    phone: '0900909909'
  },
  {
    fullName: 'Văn Tiến Đạt',
    accountName: '1642130933468',
    avatar: '',
    id: 147,
    wallpaper: null,
    isPostProhibit: false,
    email: '1642130933468@erp.com',
    phone: '0923812312'
  },
  {
    fullName: 'Hà Văn Tiên',
    accountName: '1642131038952',
    avatar: '',
    id: 148,
    wallpaper: null,
    isPostProhibit: false,
    email: '1642131038952@erp.com',
    phone: '092823121'
  },
  {
    fullName: 'tung pt 14',
    accountName: '0836434714',
    avatar: null,
    id: 156,
    wallpaper: null,
    isPostProhibit: false,
    email: '0nlyusnd14@gmail.com',
    phone: '0836434714'
  },
  {
    fullName: 'tung pt 16',
    accountName: '0836434716',
    avatar: null,
    id: 157,
    wallpaper: null,
    isPostProhibit: false,
    email: '0nlyusnd16@gmail.com',
    phone: '0836434716'
  },
  {
    fullName: 'tung pt 22',
    accountName: '0836434722',
    avatar: null,
    id: 158,
    wallpaper: null,
    isPostProhibit: false,
    email: '0nlyusnd22@gmail.com',
    phone: '0836434722'
  },
  {
    fullName: 'tuan',
    accountName: '1642331399280',
    avatar: '',
    id: 159,
    wallpaper: null,
    isPostProhibit: false,
    email: '1642331399280@erp.com',
    phone: '0343402954'
  },
  {
    fullName: 'tuan',
    accountName: '0343402962',
    avatar: null,
    id: 171,
    wallpaper: null,
    isPostProhibit: false,
    email: 'tuannt09111998@gmail.com',
    phone: '0343402962'
  },
  {
    fullName: 'tuan',
    accountName: '0343456788',
    avatar: null,
    id: 180,
    wallpaper: null,
    isPostProhibit: false,
    email: 'tuanvip@gmail.com',
    phone: '0343456788'
  },
  {
    fullName: 'tuan',
    accountName: '0343498687',
    avatar: null,
    id: 181,
    wallpaper: null,
    isPostProhibit: false,
    email: 'tuangh@gmail.com',
    phone: '0343498687'
  },
  {
    fullName: '0922222222',
    accountName: '0922222222',
    avatar: null,
    id: 185,
    wallpaper: null,
    isPostProhibit: false,
    email: 'hh@gmail.com',
    phone: '0922222222'
  },
  {
    fullName: 'tuann',
    accountName: '0349568249',
    avatar: null,
    id: 187,
    wallpaper: null,
    isPostProhibit: false,
    email: 'NoahKhalifa1781310187@gmail.com',
    phone: '0349568249'
  },
  {
    fullName: 'huy',
    accountName: '0343402933',
    avatar: null,
    id: 188,
    wallpaper: null,
    isPostProhibit: false,
    email: 'NoahKhalifa1781310188@gmail.com',
    phone: '0343402933'
  },
  {
    fullName: 'ada',
    accountName: '0897654321',
    avatar: null,
    id: 189,
    wallpaper: null,
    isPostProhibit: false,
    email: 'asdas@sdds.ccc',
    phone: '0897654321'
  },
  {
    fullName: '0384481639',
    accountName: '0384481639',
    avatar:
      'UserAvatar\\637801101754720274_image_picker_7B682219-F606-4A0E-BD40-25596ADA2867-849-00000109E001C0B4.jpg',
    id: 190,
    wallpaper: null,
    isPostProhibit: false,
    email: 'phuonglinh170197@gmail.com',
    phone: '0384481639'
  },
  {
    fullName: 'Dũng',
    accountName: 'U0003',
    avatar: 'UserAvatar\\637799254715959917.png',
    id: 191,
    wallpaper: null,
    isPostProhibit: false,
    email: 'hauqyduing.a@gmail.com',
    phone: '09123456789'
  },
  {
    fullName: 'Trần Tuấn Linh',
    accountName: 'Shearstabby222',
    avatar: 'UserAvatar\\637800969535391874.png',
    id: 192,
    wallpaper: null,
    isPostProhibit: false,
    email: 'abc.xyz111111111@gmail.com',
    phone: '0912460200'
  },
  {
    fullName: 'Noah khalifa',
    accountName: 'Noah',
    avatar: '',
    id: 193,
    wallpaper: null,
    isPostProhibit: false,
    email: 'noah@gmail.com',
    phone: '0357357599'
  },
  {
    fullName: 'HanQuangVu',
    accountName: 'HanQuangVu',
    avatar: '',
    id: 195,
    wallpaper: null,
    isPostProhibit: false,
    email: 'NoahSlhfjasef@gmail.com',
    phone: '0725369369'
  },
  {
    fullName: 'Nguyễn Hoàng Anh',
    accountName: 'NguyenHoangAnh',
    avatar: '',
    id: 196,
    wallpaper: null,
    isPostProhibit: false,
    email: 'hoanganh@gmail.com',
    phone: '0966789789'
  },
  {
    fullName: 'Hà Quý Dũng',
    accountName: '0967121665',
    avatar: null,
    id: 198,
    wallpaper: null,
    isPostProhibit: false,
    email: 'bxhdjd@bdbd.sndn',
    phone: '0967121665'
  },
  {
    fullName: '0912490231',
    accountName: '0912490231',
    avatar: '',
    id: 201,
    wallpaper: null,
    isPostProhibit: false,
    email: 'gunnyonline096@gmail.com',
    phone: '0912490231'
  },
  {
    fullName: 'Trần Tuấn Linh',
    accountName: '0914568520',
    avatar: 'UserAvatar\\637805390923251088.jpg',
    id: 202,
    wallpaper: null,
    isPostProhibit: false,
    email: 'gunnyonline.d14@gmail.com',
    phone: '0914568520'
  },
  {
    fullName: 'dungtest1602tenlienhe',
    accountName: 'dungtest1602tentk',
    avatar: 'UserAvatar\\637806236016480215.png',
    id: 203,
    wallpaper: null,
    isPostProhibit: false,
    email: 'dungtest1602email@gmail.com',
    phone: '09123123123'
  }
]
const getMember = (obj) => {
  console.log('this call api get member', obj)

  // const loading = this.$loading({ lock: true })
  // const params = obj ?? { Keyword: '', UserType: -1 }
  // params.ForumId = this.formInfo.value.id
  // GetMember(params)
  //   .then((res) => {
  //     const { data } = res.data
  //     if (data?.data && res.data.statusCode === 200) {
  //       if (this.members.length > 0) {
  //         this.members.splice(0, this.members.length)
  //       }
  //       this.totalMember = data.count.toString()
  //       this.members = data.data
  //     }
  //   })
  //   .catch((err) => {
  //     console.error(err)
  //   })
  //   .finally(() => {
  //     loading.close()
  //   })
}
const getPostForum = () => {
  console.log('this function call api get post forum')
  // const loading = this.$loading({ lock: true })
  // GetPostForum({
  //   IsActive: this.listActive,
  //   PageIndex: this.pageIndex,
  //   PageSize: this.pageSize
  // })
  //   .then((res) => {
  //     this.posts = res.data.data.data
  //   })
  //   .catch((err) => {
  //     console.error(err)
  //   })
  //   .finally(() => {
  //     loading.close()
  //   })
}
const totalMember = '43'
</script>
<template>
  <div>
    <div class="ps-4 pb-1 base__main-background">
      <el-card>
        <div class="text-end position-relative">
          <CarouselComponent :items="sliders" />
        </div>
        <div class="mt-3 pb-4">
          <div class="fs-4 fw-bold pt-2">{{ formInfo.value.name }}</div>
          <img :src="social" alt="" />
          <small class="ms-1"> {{ formInfo.value.description }}</small>
        </div>
        <div class="directory-bar">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="Bài viết" name="first" />
            <el-tab-pane label="Chờ duyệt" name="second" />
          </el-tabs>
        </div>
      </el-card>
    </div>
    <div class="ps-3 py-4 base__main-background">
      <el-row :gutter="20" class="m-0">
        <el-col :span="13" v-if="listActive">
          <el-card class="p-3">
            <div class="d-flex">
              <div class="">
                <el-avatar v-if="userInfo.avatar" :src="baseUrl + userInfo.avatar" :size="47" />
                <el-avatar v-else icon="el-icon-user-solid" :size="47" />
              </div>
              <div class="input-group input-group-lg ps-4">
                <input
                  type="text"
                  class="form-control rounded-20 bg-primary bg-opacity-10 fs-6"
                  placeholder="Nhập nội dung..."
                />
              </div>
            </div>
            <div class="menu-list-item ps-3 mt-3" @click="openPostNewsDialog" role="button">
              <el-avatar v-if="userInfo.avatar" :src="baseUrl + userInfo.avatar" :size="47" />
              <el-avatar v-else icon="el-icon-user-solid" :size="47" />
              <span class="ps-2" name="text">Chọn ảnh</span>
            </div>
          </el-card>

          <div class="fw-bold p-3">Gần đây <i class="el-icon-caret-bottom" role="button"></i></div>
        </el-col>
        <el-col :span="13" v-else>
          <el-card class="p-3">
            <div class="d-flex justify-content-between">
              <div class="pt-3">
                <span class="fw-bold pe-3 dot">Bài viết chờ duyệt</span>
                <span class="fw-bold ps-2">{{ posts.length }}</span>
              </div>
              <div>
                <button
                  :class="[
                    allPick ? 'bg-success bg-gradient text-dark' : 'bg-secondary',
                    'btn bg-opacity-50 me-4'
                  ]"
                  @click="actionAllPost('approve')"
                  >Phê duyệt</button
                >
                <button
                  :class="[
                    allPick ? 'bg-danger bg-gradient text-light' : 'bg-secondary',
                    'btn bg-opacity-50'
                  ]"
                  @click="actionAllPost('cancel')"
                  >Từ chối</button
                >
              </div>
            </div>
            <div class="d-flex justify-content-between pt-3">
              <div class="pt-3">
                <el-checkbox v-model="allPick" :value="true"> Chọn tất cả</el-checkbox>
              </div>
              <div style="align-self: center">
                <el-popover
                  placement="bottom"
                  width="200"
                  trigger="click"
                  content="this is content, this is content, this is content"
                >
                  <template #default>
                    <div class="w-100 p-3">
                      <div class="pb-2 d-flex justify-content-between"
                        ><span class="fw-bold">Mới nhất trước</span>
                        <i class="el-icon-arrow-right"></i
                      ></div>
                      <div class="d-flex justify-content-between"
                        ><span class="text-secondary">Cũ nhất trước</span>
                        <i class="el-icon-arrow-right"></i
                      ></div>
                    </div>
                  </template>
                  <template #reference>
                    <span class="fw-bold"> Mới nhất trước</span>
                  </template>
                </el-popover>
              </div>
            </div>
          </el-card>
          <!-- pending -->
        </el-col>
        <el-col :span="11">
          <el-card class="p-3 mb-3">
            <div class="input-group input-group-lg">
              <input
                type="text"
                class="form-control rounded-20 bg-primary bg-opacity-10 fs-6"
                placeholder="Tìm kiếm trong nhóm này ..."
                v-model="keyword"
                @change="search()"
                style="height: 50px"
              />
            </div>
            <div class="fs-6 pt-3 fw-bold" v-if="dataSearch.length > 0"> Tìm kiếm gần đây</div>
            <div class="pt-3" v-for="item in dataSearch" :key="item.id">
              <span class="fw-bold" style="cursor: pointer" @click="removeSearch(item.id)">x</span>
              <span class="ps-4">{{ item.keyword }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menu-list-item {
  height: get-vh(47px);
  box-shadow: inset 0 11px 10px -12px #6596f3;
  line-height: get-vh(47px);
  border-radius: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  span[name='text'] {
    font-size: 15px;
    color: blue;
  }
  &:hover {
    span {
      text-decoration: underline;
      font-weight: 500;
    }
  }
}

:deep(.el-tabs__item) {
  font-size: 15px;
}
:deep(.el-tabs__item.is-active) {
  color: red;
  font-weight: bold;
}
:deep(.el-tabs__active-bar) {
  background-color: red;
}

.directory-bar {
  box-shadow: inset 0 11px 10px -12px #6596f3;
  padding: get-vh(17px) get-vw(19px) 0;
  border-radius: 10px;
}
.h-67-px {
  height: 67px;
}

:deep(.el-tabs__nav-scroll) {
  border-bottom: 0;
}

:deep(.el-tabs__nav-wrap::after) {
  background: none;
  height: 0;
}

:deep(.el-tabs__nav-scroll) {
  min-height: 3rem;
}

:deep(.el-tabs__header) {
  margin: 0;
}

:deep(.el-tabs__active-bar) {
  top: 100%;
}

.circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.rounded-20 {
  border-radius: 2rem;
}

.dot {
  position: relative;
}

.dot::after {
  content: ' ';
  position: absolute;
  left: 100%;
  width: 5px;
  height: 5px;
  bottom: 5px;
  border-radius: 50%;
  background: #0d0d0d;
}

.dots {
  margin-right: 3px;
  content: ' ';
  width: 5px;
  height: 5px;
  bottom: 5px;
  border-radius: 50%;
  background: #0d0d0d;
}

.image-map {
  height: 190px;
}

.image-new {
  height: 140px;
}

@media only screen and (max-width: 1400px) {
  .image-map {
    height: 133px;
  }
  .image-new {
    height: 94px;
  }
}

:deep(.el-textarea__inner) {
  border: none;
  padding-left: 2px;
}

:deep(.el-textarea__inner::placeholder) {
  font-style: italic;
}

:deep(.el-dialog--center .el-dialog__body) {
  padding-top: 0;
}

.fs-7 {
  font-size: 80%;
}

:deep(.el-popover) {
  padding: 0;
}

:deep(.el-popover--plain) {
  padding: 0 !important;
}
</style>
<style lang="scss" scoped>
.el-popover--plain {
  padding: 0;
}
</style>
