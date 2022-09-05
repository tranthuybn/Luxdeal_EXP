<script setup lang="ts">
import { ref } from 'vue'
import { ElRow, ElCol } from 'element-plus'
import componentMember from './components/componentMember.vue'
const members = ref([
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
])
const totalMember = '43'
const getMember = (obj) => {
  console.log('getMember', obj)
}
</script>
<template>
  <div>
    <div>
      <el-row :gutter="20" class="m-0">
        <el-col :offset="6" :span="12">
          <componentMember
            :members="members"
            :is-home-page="true"
            @get-member="getMember"
            :total-member="totalMember"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
