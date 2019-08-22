<template>
  <main class="home">
    <header class="home-header">
      <home-nav />
      <home-header />
    </header>

    <section class="home-container">
      <home-tab @click="openMak" @exchange="maskShow = true" />

      <home-body />

      <section class="btn-list">
        <public-btn :txt="settleBtn" @click.native="settle" />

        <input
          type="number"
          :placeholder="$t('home.amountIpt')"
          v-model="withdrawIpt"
          maxlength="42"
        />
        <public-btn :txt="withdrawBtn" @click.native="withdrawal" />

        <input
          type="text"
          :placeholder="$t('home.addressIpt')"
          v-model="invitationIpt"
          maxlength="42"
        />
        <input type="text" v-model="userAddress" />
        <public-btn :txt="invitationBtn" @click.native="invitation" />
      </section>
    </section>

    <home-mask v-show="maskShow" @close="closeMask" />

    <public-toast v-show="toastShow" :txt="toastTxt" />
  </main>
</template>

<script>
import '../utils/homeBgCanvas.js'
import homeNav from './components/home-nav'
import publicBtn from '../components/public-btn'
import homeHeader from './components/home-header'
import homeBody from './components/home-body'
import homeMask from './components/home-mask'
import publicToast from '../components/public-toast'

import homeTab from "./components/home-header-tab";
import Clipboard from 'clipboard'

export default {
  name: 'home',
  components: {
    homeNav,
    homeHeader,
    homeBody,
    publicBtn,
    homeMask,
    homeTab,
    publicToast
  },
  props: {},
  data() {
    return {
      settleBtn: 'home.settleBtn',
      withdrawBtn: 'home.withdrawBtn',
      invitationBtn: 'home.invitationBtn',
      maskShow: false,
      invitationIpt: '', //被邀请人地址
      withdrawIpt: '', //提现金额
      toastShow: false,
      toastTxt: '',

      userAddress: ''
    }
  },
  computed: {

  },
  created() {
    let that = this
    imToken.callAPI('user.getCurrentAccount', function (err, address) {
      if (err) {
        imToken.callAPI('native.toastInfo', '获取钱包信息失败，请稍后重试')
      } else {
        that.userAddress = address
      }
    })
  },
  mounted() {
    document.getElementsByTagName('canvas')[0].style.visibility = "visible"
  },
  destroyed() {
    document.getElementsByTagName('canvas')[0].style.visibility = "hidden"

  },
  methods: {
    settle() {
      this.$router.push({ path: '/withdraw' })
    },

    openMak() {
      this.maskShow = true
    },

    closeMask() {
      this.maskShow = false
    },

    //复制
    invitation() {
      let address2 = this.invitationIpt.replace(/\s+/g, "")
      let parm = {
        "address": this.userAddress,
        "refAddress": address2
      }
      console.log(parm);
      //var address1 = "0x09ced3ca4a35a636e5e190a1608e4b0299109e8"

      this.$axios.post(_const.url + "/aceWeb/operateBtt/operateAccount", this.qs.stringify(parm)).then(res => {
        let data = res.data
        let code = data.statusCode
        if (code == 200) {
          imToken.callAPI('native.setClipboard', _const.urlLink + '/?address=' + address2)
          imToken.callAPI('native.toastInfo', '复制成功')
          //alert("成功")
        } else {
          imToken.callAPI('native.toastInfo', '复制失败')
          this.invitationIpt = ""
          //alert("复制失败")
        }
      }).catch(error => {
        console.log(error)
        imToken.callAPI('native.toastInfo', '系统错误，请稍后重试...')
        //alert("系统错误，请稍后重试")
      });
    },



    //提现
    withdrawal() {
      let ipt = this.withdrawIpt.replace(/\s+/g, "")
      var walletAddress = this.userAddress
      const parm = {
        "address": walletAddress, //提现地址
        "amount": ipt //提现数额 字符串，单位：eth
      }
      this.$axios.post(_const.url + '/aceWeb/operateBtt/withdraw', this.qs.stringify(parm)).then(res => {
        let data = res.data
        let code = data.statusCode
        if (code == 200) {
          imToken.callAPI('native.toastInfo', '提现成功')
          //alert("提现成功")
        } else {
          imToken.callAPI('native.toastInfo', '提现失败：' + data.statusMsg)
          //alert("提现失败：" + data.statusMsg)
        }
      }).catch(error => {
        imToken.callAPI('native.toastInfo', '系统错误，请稍后重试...')
        console.log(error)
        //alert("系统错误，请稍后重试")
      });
    }
  }
}
</script>

<style scoped lang="scss">
@import "../assets/styless/public";
.home {
  background: #ebecf0;
  padding-bottom: 0.35rem;
  .home-header {
    height: 8.68rem;
  }
  .home-container {
    width: 9.47rem;
    border-radius: 0.21rem 0.21rem 0 0;
    margin: 0 auto;
    margin-top: -1.5rem;
    z-index: 4;
    position: relative;
  }
  .btn-list {
    @extend %flexCenter;
    flex-direction: column;
    background: #fff;
    padding: 0.29rem 0 0.75rem;
    border-radius: 0 0 0.21rem 0.21rem;
    button {
      width: 8.67rem;
      margin-top: 0.27rem;
      &:first-child {
        margin-top: 0;
      }
    }
    input {
      width: 8.67rem;
      margin-top: 0.27rem;
      padding: 0.35rem 0;
      border: 0;
      @include border($d: bottom);
      border-radius: 0;
    }
  }
}
</style>